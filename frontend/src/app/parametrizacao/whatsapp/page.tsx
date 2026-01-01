"use client";

import { useEffect, useMemo, useState } from "react";

import { META_STANDARD_EVENTS, type MetaEvent } from "@/lib/meta-events";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation";
import { logDeleteOutcome } from "@/lib/logging";
import { useConfirmDelete } from "@/lib/hooks/useConfirmDelete";
import type { PixelRecord } from "@/lib/repos/pixels";
import type { WhatsAppPageRecord } from "@/lib/repos/whatsapp-pages";
import type { BenefitCard, EmojiSize } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EMOJI_SIZE_OPTIONS: { value: EmojiSize; label: string }[] = [
  { value: "small", label: "Pequeno" },
  { value: "medium", label: "Medio" },
  { value: "large", label: "Grande" },
];

const EMOJI_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "text-2xl",
  medium: "text-4xl",
  large: "text-6xl",
};

// Updated 2025-12-31: Multi-event support (events[] + redirectEvent)
// Updated 2026-01-01: Benefit cards support (benefitCards[] + emojiSize)
type FormState = {
  id?: string;
  headline: string;
  headerImageUrl: string;
  socialProofs: string[];
  buttonText: string;
  whatsappUrl: string;
  pixelConfigId: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: "active" | "inactive";
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
};

const initialForm: FormState = {
  headline: "",
  headerImageUrl: "",
  socialProofs: [],
  buttonText: "Entrar no Grupo VIP",
  whatsappUrl: "",
  pixelConfigId: "",
  events: ["Lead"],
  redirectEvent: "CompleteRegistration",
  redirectDelay: 5,
  status: "active",
  benefitCards: [],
  emojiSize: "medium",
};

export default function WhatsAppAdminPage() {
  const [pixels, setPixels] = useState<PixelRecord[]>([]);
  const [pages, setPages] = useState<WhatsAppPageRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [socialProofsText, setSocialProofsText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const confirmDelete = useConfirmDelete();

  const defaultPixel = useMemo(
    () => pixels.find((p) => p.isDefault) ?? pixels[0] ?? null,
    [pixels],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pixelsRes, pagesRes] = await Promise.all([
          fetch("/api/pixels", { cache: "no-store" }),
          fetch("/api/whatsapp", { cache: "no-store" }),
        ]);
        if (!pixelsRes.ok || !pagesRes.ok) throw new Error("Erro ao carregar dados");
        const [pixelsData, pagesData] = (await Promise.all([
          pixelsRes.json(),
          pagesRes.json(),
        ])) as [PixelRecord[], WhatsAppPageRecord[]];
        if (cancelled) return;
        setPixels(pixelsData);
        setPages(pagesData);
        setForm((prev) => ({
          ...prev,
          pixelConfigId: prev.pixelConfigId || defaultPixel?.id || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const socialProofs = socialProofsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      // Filter out incomplete benefit cards before submitting
      const validBenefitCards = form.benefitCards.filter(
        (card) => card.emoji && card.title
      );

      const payload = {
        ...form,
        socialProofs,
        // Always include headerImageUrl (even empty string) so API knows whether to clear or preserve
        headerImageUrl: form.headerImageUrl,
        pixelConfigId: form.pixelConfigId || undefined,
        // Updated 2026-01-01: Benefit cards support
        benefitCards: validBenefitCards,
        emojiSize: form.emojiSize,
      };

      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Erro ao salvar página");

      setPages((prev) => {
        const others = prev.filter((p) => p.id !== data.id);
        return [...others, data].sort((a, b) => a.headline.localeCompare(b.headline));
      });

      resetForm();
      setSuccess(editingId ? "Página atualizada com sucesso!" : "Página criada com sucesso!");
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      pixelConfigId: defaultPixel?.id || "",
    });
    setSocialProofsText("");
    setEditingId(null);
  };

  const handleEdit = (page: WhatsAppPageRecord) => {
    setForm({
      id: page.id,
      headline: page.headline,
      headerImageUrl: page.headerImageUrl || "",
      socialProofs: page.socialProofs,
      buttonText: page.buttonText,
      whatsappUrl: page.whatsappUrl,
      pixelConfigId: page.pixelConfigId || "",
      // Updated 2025-12-31: Multi-event support
      events: page.events,
      redirectEvent: page.redirectEvent,
      redirectDelay: page.redirectDelay,
      status: page.status,
      // Updated 2026-01-01: Benefit cards support
      benefitCards: page.benefitCards ?? [],
      emojiSize: page.emojiSize ?? "medium",
    });
    setSocialProofsText(page.socialProofs.join("\n"));
    setEditingId(page.id);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappPageUrl = (slug: string) => `${window.location.origin}/w/${slug}`;

  const copyLink = async (slug: string) => {
    try {
      await navigator.clipboard.writeText(whatsappPageUrl(slug));
      setSuccess("Link copiado para a área de transferência!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Falha ao copiar link: ${err}`);
    }
  };

  const handleDelete = async (page: WhatsAppPageRecord) => {
    const confirmed = await confirmDelete.requestConfirmation({
      id: page.id,
      label: page.headline,
    });
    if (!confirmed) return;

    setDeletingId(page.id);
    setError(null);
    const started = performance.now();
    try {
      const res = await fetch(`/api/whatsapp/${page.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Erro ao remover página");
      }
      setPages((prev) => prev.filter((p) => p.id !== page.id));
      logDeleteOutcome("whatsapp_page", "success", {
        pageId: page.id,
        durationMs: Math.round(performance.now() - started),
      });
      setSuccess("Página removida com sucesso!");
    } catch (err) {
      logDeleteOutcome("whatsapp_page", "failure", {
        pageId: page.id,
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
        <h1 className="text-2xl font-semibold">Páginas WhatsApp</h1>
        <p className="text-muted-foreground">
          Crie páginas de redirecionamento para grupos de WhatsApp com headline, provas sociais e tracking.
        </p>
      </div>

      <form className="space-y-4 rounded-lg border bg-card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Headline *</label>
          <input
            required
            value={form.headline}
            onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ex: Entre no Grupo VIP de Ofertas!"
            maxLength={200}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">URL da Foto do Header (opcional)</label>
          <input
            value={form.headerImageUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, headerImageUrl: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://exemplo.com/foto.jpg"
            type="url"
          />
          <p className="text-xs text-muted-foreground">Foto circular exibida no topo da página (HTTPS obrigatório)</p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Provas Sociais (uma por linha)</label>
          <textarea
            value={socialProofsText}
            onChange={(e) => setSocialProofsText(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder={"+5.000 membros\n⭐ 4.9 de avaliação\n🔥 Ofertas exclusivas diárias"}
            rows={3}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Texto do Botão *</label>
          <input
            required
            value={form.buttonText}
            onChange={(e) => setForm((prev) => ({ ...prev, buttonText: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Ex: Entrar no Grupo VIP"
            maxLength={100}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">URL do WhatsApp *</label>
          <input
            required
            value={form.whatsappUrl}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsappUrl: e.target.value }))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://chat.whatsapp.com/ABC123..."
            type="url"
          />
          <p className="text-xs text-muted-foreground">Aceita: chat.whatsapp.com ou wa.me</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Pixel (opcional)</label>
            <select
              value={form.pixelConfigId}
              onChange={(e) => setForm((prev) => ({ ...prev, pixelConfigId: e.target.value }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Sem tracking</option>
              {pixels.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} {p.isDefault ? "(padrão)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Evento de Redirect *</label>
            <select
              required
              value={form.redirectEvent}
              onChange={(e) => setForm((prev) => ({ ...prev, redirectEvent: e.target.value as MetaEvent }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {META_STANDARD_EVENTS.map((event) => (
                <option key={event} value={event}>
                  {event}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">Disparado antes do redirect (clique ou automático)</p>
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Eventos ao Carregar * (mín. 1)</label>
          <div className="flex flex-wrap gap-3 rounded-md border bg-background p-3">
            {META_STANDARD_EVENTS.map((event) => (
              <label key={event} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.events.includes(event)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm((prev) => ({ ...prev, events: [...prev.events, event] }));
                    } else {
                      setForm((prev) => ({
                        ...prev,
                        events: prev.events.filter((ev) => ev !== event),
                      }));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                {event}
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Eventos disparados ao carregar a página</p>
          {form.events.length === 0 && (
            <p className="text-xs text-destructive">Selecione pelo menos 1 evento</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Tempo de Redirect (segundos)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={form.redirectDelay}
              onChange={(e) => setForm((prev) => ({ ...prev, redirectDelay: parseInt(e.target.value) || 5 }))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-4 pt-2">
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
        </div>

        {/* Benefit Cards Section */}
        <div className="grid gap-4 rounded-md border bg-accent/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Benefit Cards (opcional)</label>
              <p className="text-xs text-muted-foreground">
                Cards com beneficios exibidos antes do botao (max. 8)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Tamanho emoji:</label>
              <select
                value={form.emojiSize}
                onChange={(e) => setForm((prev) => ({ ...prev, emojiSize: e.target.value as EmojiSize }))}
                className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {EMOJI_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Existing Cards List */}
          {form.benefitCards.length > 0 && (
            <div className="space-y-2">
              {form.benefitCards.map((card, idx) => (
                <div key={idx} className="flex items-start gap-2 rounded-md border bg-background p-3">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const newCards = [...form.benefitCards];
                        [newCards[idx - 1], newCards[idx]] = [newCards[idx], newCards[idx - 1]];
                        setForm((prev) => ({ ...prev, benefitCards: newCards }));
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === form.benefitCards.length - 1}
                      onClick={() => {
                        const newCards = [...form.benefitCards];
                        [newCards[idx], newCards[idx + 1]] = [newCards[idx + 1], newCards[idx]];
                        setForm((prev) => ({ ...prev, benefitCards: newCards }));
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  <span className={cn("flex-shrink-0", EMOJI_SIZE_CLASSES[form.emojiSize])}>
                    {card.emoji}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <input
                      value={card.emoji}
                      onChange={(e) => {
                        const newCards = [...form.benefitCards];
                        newCards[idx] = { ...newCards[idx], emoji: e.target.value.slice(0, 2) };
                        setForm((prev) => ({ ...prev, benefitCards: newCards }));
                      }}
                      placeholder="Emoji"
                      maxLength={2}
                      className="w-16 rounded border bg-background px-2 py-1 text-sm"
                    />
                    <input
                      value={card.title}
                      onChange={(e) => {
                        const newCards = [...form.benefitCards];
                        newCards[idx] = { ...newCards[idx], title: e.target.value };
                        setForm((prev) => ({ ...prev, benefitCards: newCards }));
                      }}
                      placeholder="Titulo (obrigatorio)"
                      maxLength={50}
                      className="w-full rounded border bg-background px-2 py-1 text-sm"
                    />
                    <input
                      value={card.description || ""}
                      onChange={(e) => {
                        const newCards = [...form.benefitCards];
                        newCards[idx] = { ...newCards[idx], description: e.target.value || undefined };
                        setForm((prev) => ({ ...prev, benefitCards: newCards }));
                      }}
                      placeholder="Descricao (opcional)"
                      maxLength={150}
                      className="w-full rounded border bg-background px-2 py-1 text-sm"
                    />
                    {(!card.emoji || !card.title) && (
                      <p className="text-xs text-destructive">Emoji e titulo sao obrigatorios</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        benefitCards: prev.benefitCards.filter((_, i) => i !== idx),
                      }));
                    }}
                    className="text-destructive hover:text-destructive/80 text-sm px-2"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Card Button */}
          {form.benefitCards.length < 8 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  benefitCards: [
                    ...prev.benefitCards,
                    { emoji: "", title: "", description: undefined },
                  ],
                }));
              }}
            >
              + Adicionar Benefit Card
            </Button>
          )}
          {form.benefitCards.length >= 8 && (
            <p className="text-xs text-muted-foreground">Limite de 8 cards atingido</p>
          )}

          {/* Preview Section */}
          {form.benefitCards.length > 0 && form.benefitCards.some(c => c.emoji && c.title) && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {form.benefitCards
                  .filter(c => c.emoji && c.title)
                  .map((card, idx) => (
                    <div key={idx} className="rounded-lg border bg-white p-3 text-center">
                      <span className={EMOJI_SIZE_CLASSES[form.emojiSize]}>{card.emoji}</span>
                      <h4 className="font-bold text-sm mt-1">{card.title}</h4>
                      {card.description && (
                        <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : editingId ? "Atualizar página" : "Criar página"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar edição
            </Button>
          )}
        </div>
      </form>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Páginas cadastradas</h2>
          <span className="text-xs text-muted-foreground">Total: {pages.length}</span>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : pages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma página cadastrada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {pages.map((page) => (
              <li
                key={page.id}
                className={cn(
                  "flex flex-col gap-2 rounded-md border px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
                  editingId === page.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{page.headline}</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {page.whatsappUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Eventos: {page.events.join(", ")} | Redirect: {page.redirectEvent} | Delay: {page.redirectDelay}s
                    {page.pixelConfigId && ` | Pixel: ${pixels.find((p) => p.id === page.pixelConfigId)?.label ?? "?"}`}
                  </p>
                  {page.socialProofs.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-muted-foreground">
                      {page.socialProofs.map((proof, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground"
                        >
                          {proof}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs",
                      page.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-zinc-200 text-zinc-800",
                    )}
                  >
                    {page.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" onClick={() => copyLink(page.slug)}>
                      Copiar link
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === page.id}
                      onClick={() => handleDelete(page)}
                    >
                      {deletingId === page.id ? "Removendo..." : "Remover"}
                    </Button>
                    <a
                      className="text-xs text-primary underline self-center"
                      href={`/w/${page.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      /w/{page.slug}
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
