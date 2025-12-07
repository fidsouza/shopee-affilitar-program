import { useCallback, useRef, useState } from "react";

type ConfirmTarget = {
  id: string;
  label?: string;
};

type Resolver = (confirm: boolean) => void;

export function useConfirmDelete() {
  const [pending, setPending] = useState<ConfirmTarget | null>(null);
  const resolverRef = useRef<Resolver | null>(null);

  const requestConfirmation = useCallback((target: ConfirmTarget) => {
    setPending(target);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const confirm = useCallback(() => {
    resolverRef.current?.(true);
    resolverRef.current = null;
    setPending(null);
  }, []);

  const cancel = useCallback(() => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setPending(null);
  }, []);

  const reset = useCallback(() => {
    resolverRef.current = null;
    setPending(null);
  }, []);

  return {
    pending,
    requestConfirmation,
    confirm,
    cancel,
    reset,
  };
}
