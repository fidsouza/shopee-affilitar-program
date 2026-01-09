"use client";

import { useEffect, useMemo, useState } from "react";

import { META_STANDARD_EVENTS, type MetaEvent } from "@/lib/meta-events";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation";
import { logDeleteOutcome } from "@/lib/logging";
import { useConfirmDelete } from "@/lib/hooks/useConfirmDelete";
import type { PixelRecord } from "@/lib/repos/pixels";
import type { ProductRecord } from "@/lib/repos/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormState = {
  title: string;
  affiliateUrl: string;
  pixelConfigId: string;
  events: MetaEvent[];
  status: "active" | "inactive";
};

const initialForm: FormState = {
  title: "",
  affiliateUrl: "",
  pixelConfigId: "",
  events: [],
  status: "active",
};

export default function ProductAdminPage() {
  const [pixels, setPixels] = useState<PixelRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const confirmDelete = useConfirmDelete();

  const defaultPixel = useMemo(
    () => pixels.find((p) => p.isDefault) ?? pixels[0] ?? null,
    [pixels],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pixelsRes, productsRes] = await Promise.all([
          fetch("/api/pixels"),
          fetch("/api/products"),
        ]);
        if (!pixelsRes.ok || !productsRes.ok) throw new Error("Erro ao carregar dados");
        const [pixelsData, productsData] = (await Promise.all([
          pixelsRes.json(),
          productsRes.json(),
        ])) as [PixelRecord[], ProductRecord[]];
        if (cancelled) return;
        setPixels(pixelsData);
        setProducts(productsData);
        setForm((prev) => ({
          ...prev,
          pixelConfigId: prev.pixelConfigId || defaultPixel?.id || "",
          events: prev.events.length ? prev.events : defaultPixel?.defaultEvents || ["PageView"],
        }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleEvent = (event: MetaEvent) => {
    setForm((prev) => {
      const exists = prev.events.includes(event);
      return {
        ...prev,
        events: exists ? prev.events.filter((e) => e !== event) : [...prev.events, event],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erro ao salvar produto");
      setProducts((prev) => {
        const others = prev.filter((p) => p.id !== data.id);
        return [...others, data].sort((a, b) => a.title.localeCompare(b.title));
      });
      setForm(() => ({
        ...initialForm,
        pixelConfigId: defaultPixel?.id || "",
        events: defaultPixel?.defaultEvents || ["PageView"],
      }));
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const transitionUrl = (slug: string) => `${window.location.origin}/t/${slug}`;

  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(transitionUrl(slug));
    } catch (err) {
      setError(`Falha ao copiar link: ${err}`);
    }
  };

  const handleDelete = async (product: ProductRecord) => {
    const confirmed = await confirmDelete.requestConfirmation({
      id: product.id,
      label: product.title,
    });
    if (!confirmed) return;

    setDeletingId(product.id);
    setError(null);
    const started = performance.now();
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Erro ao remover produto");
      }
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      logDeleteOutcome("product", "success", {
        productId: product.id,
        durationMs: Math.round(performance.now() - started),
      });
    } catch (err) {
      logDeleteOutcome("product", "failure", {
        productId: product.id,
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
        <h1 className="text-2xl font-semibold">Cadastrar Produto</h1>
        <p className="text-muted-foreground">
          Informe a URL do afiliado, escolha eventos e pixel, defina ativo/inativo e copie o link de
          transição.
        </p>
      </div>

      <form className="space-y-4 rounded-lg bg-card p-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Título</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ex: Oferta Shopee do dia"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">URL do afiliado</label>
          <input
            required
            value={form.affiliateUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, affiliateUrl: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://www.shopee.com/..."
            inputMode="url"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Pixel</label>
          <select
            required
            value={form.pixelConfigId}
            onChange={(e) => setForm((prev) => ({ ...prev, pixelConfigId: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="" disabled>
              {pixels.length === 0 ? "Cadastre um pixel primeiro" : "Selecione um pixel"}
            </option>
            {pixels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label} {p.isDefault ? "(padrão)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Eventos a disparar</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {META_STANDARD_EVENTS.map((event) => (
              <label
                key={event}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
                  form.events.includes(event) ? "bg-accent border-accent" : "bg-background",
                )}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.events.includes(event)}
                  onChange={() => toggleEvent(event)}
                />
                {event}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Status</label>
          <div className="flex gap-4">
            {(["active", "inactive"] as const).map((status) => (
              <label key={status} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={form.status === status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as FormState["status"],
                    }))
                  }
                />
                {status === "active" ? "Ativo" : "Inativo"}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Produtos cadastrados</h2>
          <span className="text-xs text-muted-foreground">Total: {products.length}</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum produto cadastrado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex flex-col gap-2 rounded-md px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {product.affiliateUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pixel: {pixels.find((p) => p.id === product.pixelConfigId)?.label ?? "?"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                    {product.events.map((event) => (
                      <span
                        key={event}
                        className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs",
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-200 text-zinc-800",
                    )}
                  >
                    {product.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => copyLink(product.slug)}>
                      Copiar link
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === product.id}
                      onClick={() => handleDelete(product)}
                    >
                      {deletingId === product.id ? "Removendo..." : "Remover"}
                    </Button>
                    <a
                      className="text-xs text-primary underline"
                      href={`/t/${product.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      /t/{product.slug}
                    </a>
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
