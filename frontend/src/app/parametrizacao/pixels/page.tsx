"use client";

import { useEffect, useMemo, useState } from "react";

import { DeleteConfirmationDialog } from "@/components/delete-confirmation";
import { META_STANDARD_EVENTS, type MetaEvent } from "@/lib/meta-events";
import { logDeleteOutcome } from "@/lib/logging";
import { useConfirmDelete } from "@/lib/hooks/useConfirmDelete";
import type { PixelRecord } from "@/lib/repos/pixels";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormState = {
  label: string;
  pixelId: string;
  defaultEvents: MetaEvent[];
  isDefault: boolean;
};

const initialForm: FormState = {
  label: "",
  pixelId: "",
  defaultEvents: ["PageView"],
  isDefault: false,
};

export default function PixelAdminPage() {
  const [pixels, setPixels] = useState<PixelRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmDelete = useConfirmDelete();

  const defaultPixelId = useMemo(
    () => pixels.find((p) => p.isDefault)?.id ?? null,
    [pixels],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/pixels", { cache: "no-store" });
        if (!res.ok) throw new Error("Erro ao carregar pixels");
        const data = (await res.json()) as PixelRecord[];
        if (!cancelled) setPixels(data);
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleEvent = (event: MetaEvent) => {
    setForm((prev) => {
      const exists = prev.defaultEvents.includes(event);
      return {
        ...prev,
        defaultEvents: exists
          ? prev.defaultEvents.filter((e) => e !== event)
          : [...prev.defaultEvents, event],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erro ao salvar pixel");
      setPixels((prev) => {
        const others = prev.filter((p) => p.id !== data.id);
        // ensure ordering: default first then by label
        return [...others, data].sort((a, b) => a.label.localeCompare(b.label));
      });
      setForm(initialForm);
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (pixel: PixelRecord) => {
    const confirmed = await confirmDelete.requestConfirmation({
      id: pixel.id,
      label: pixel.label,
    });
    if (!confirmed) return;

    setDeletingId(pixel.id);
    setError(null);
    const started = performance.now();
    try {
      const res = await fetch(`/api/pixels/${pixel.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Erro ao remover pixel");
      }
      setPixels((prev) => {
        const remaining = prev.filter((p) => p.id !== pixel.id);
        return remaining.sort((a, b) => a.label.localeCompare(b.label));
      });
      logDeleteOutcome("pixel", "success", {
        pixelId: pixel.id,
        durationMs: Math.round(performance.now() - started),
      });
    } catch (err) {
      logDeleteOutcome("pixel", "failure", {
        pixelId: pixel.id,
        error: String(err),
      });
      setError(String(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Cadastrar Pixel</h1>
        <p className="text-muted-foreground">
          Registre Pixel ID, eventos padrão e defina o pixel default para novos produtos.
        </p>
      </div>

      <form className="space-y-4 rounded-lg bg-card p-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Nome/Label</label>
          <input
            required
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ex: Pixel Loja Principal"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Pixel ID (Meta)</label>
          <input
            required
            value={form.pixelId}
            onChange={(e) => setForm((prev) => ({ ...prev, pixelId: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Somente números, 10-20 dígitos"
            inputMode="numeric"
            pattern="[0-9]{10,20}"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Eventos padrão</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {META_STANDARD_EVENTS.map((event) => (
              <label
                key={event}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  form.defaultEvents.includes(event) ? "bg-accent border-accent" : "bg-background",
                )}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.defaultEvents.includes(event)}
                  onChange={() => toggleEvent(event)}
                />
                {event}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isDefault"
            type="checkbox"
            className="h-4 w-4"
            checked={form.isDefault}
            onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
          />
          <label htmlFor="isDefault" className="text-sm">
            Definir como padrão para novos produtos
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar pixel"}
        </Button>
      </form>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pixels cadastrados</h2>
          <span className="text-xs text-muted-foreground">
            Padrão: {defaultPixelId ?? "nenhum"}
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : pixels.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum pixel cadastrado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {pixels.map((pixel) => (
              <li
                key={pixel.id}
                className="rounded-md px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {pixel.label} {pixel.isDefault && <span className="text-primary">(padrão)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">Pixel ID: {pixel.pixelId}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                    {pixel.defaultEvents?.map((event) => (
                      <span
                        key={event}
                        className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === pixel.id}
                      onClick={() => handleDelete(pixel)}
                    >
                      {deletingId === pixel.id ? "Removendo..." : "Remover"}
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <DeleteConfirmationDialog state={confirmDelete} />
    </div>
  );
}
