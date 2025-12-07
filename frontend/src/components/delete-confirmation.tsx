import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { useConfirmDelete } from "@/lib/hooks/useConfirmDelete";

type Props = {
  state: ReturnType<typeof useConfirmDelete>;
  title?: string;
  description?: string;
};

export function DeleteConfirmationDialog({
  state,
  title = "Confirmar exclusão",
  description = "Esta ação não pode ser desfeita.",
}: Props) {
  const confirmRef = useRef<HTMLButtonElement | null>(null);
  const isOpen = Boolean(state.pending);
  const label = state.pending?.label ?? "este item";

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      aria-describedby="confirm-delete-desc"
    >
      <div className="w-full max-w-sm rounded-lg bg-card p-4 shadow-xl focus:outline-none">
        <h2 id="confirm-delete-title" className="text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p id="confirm-delete-desc" className="mt-2 text-sm text-muted-foreground">
          {description} Confirme se deseja remover <span className="font-medium">{label}</span>.
        </p>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={state.cancel}>
            Cancelar
          </Button>
          <Button ref={confirmRef} variant="destructive" onClick={state.confirm}>
            Remover
          </Button>
        </div>
      </div>
    </div>
  );
}
