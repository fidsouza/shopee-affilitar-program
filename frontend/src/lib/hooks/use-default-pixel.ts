"use client";

import { useEffect, useMemo, useState } from "react";

import type { PixelRecord } from "@/lib/repos/pixels";

type State = {
  pixels: PixelRecord[];
  loading: boolean;
  error?: string;
};

export function useDefaultPixel() {
  const [state, setState] = useState<State>({ pixels: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/pixels", { cache: "no-store" });
        if (!res.ok) throw new Error("Erro ao buscar pixels");
        const pixels = (await res.json()) as PixelRecord[];
        if (!cancelled) setState({ pixels, loading: false });
      } catch (error) {
        if (!cancelled) setState({ pixels: [], loading: false, error: String(error) });
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const defaultPixel = useMemo(() => {
    if (state.pixels.length === 0) return null;
    return state.pixels.find((p) => p.isDefault) ?? state.pixels[0];
  }, [state.pixels]);

  return { ...state, defaultPixel };
}
