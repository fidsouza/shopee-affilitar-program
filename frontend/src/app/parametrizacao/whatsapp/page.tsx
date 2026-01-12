"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import { META_STANDARD_EVENTS, type MetaEvent } from "@/lib/meta-events";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation";
import { logDeleteOutcome } from "@/lib/logging";
import { useConfirmDelete } from "@/lib/hooks/useConfirmDelete";
import type { PixelRecord } from "@/lib/repos/pixels";
import type { WhatsAppPageRecord } from "@/lib/repos/whatsapp-pages";
import type { WhatsAppAppearanceRecord } from "@/lib/repos/whatsapp-appearance";
import type { BenefitCard, EmojiSize, SocialProofItem } from "@/lib/validation";
import { SocialProofCarousel } from "@/components/social-proof-carousel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toPng } from 'html-to-image';
import type { Participant } from '../whatsapp-generator/types';
import { generateTimestamp, generateFilename } from '../whatsapp-generator/types';

// Appearance form state type
type AppearanceFormState = {
  redirectText: string;
  backgroundColor: string;
  borderEnabled: boolean;
};

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

// Button Size Classes - added 2026-01-09 for feature 017-whatsapp-button-size
const BUTTON_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "px-6 py-3 text-base",
  medium: "px-8 py-4 text-lg",
  large: "px-10 py-5 text-xl",
};

// Updated 2025-12-31: Multi-event support (events[] + redirectEvent)
// Updated 2026-01-01: Benefit cards support (benefitCards[] + emojiSize)
// Updated 2026-01-03: Social proof notifications (socialProofEnabled + socialProofInterval)
// Updated 2026-01-06: Redirect toggle (redirectEnabled + buttonEvent)
// Updated 2026-01-06: Vacancy counter (vacancyCounterEnabled + vacancyHeadline + vacancyCount + vacancyFooter + vacancyBackgroundColor + vacancyCountFontSize + vacancyHeadlineFontSize + vacancyFooterFontSize + vacancyDecrementInterval + vacancyHeadlineColor + vacancyCountColor + vacancyFooterColor)
// Updated 2026-01-07: Social proof carousel (socialProofCarouselItems + carouselAutoPlay + carouselInterval) + Custom footer (footerText)
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
  socialProofEnabled: boolean;
  socialProofInterval: number;
  redirectEnabled: boolean;
  buttonEvent: MetaEvent | "";
  // Vacancy Counter - added 2026-01-06
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string;
  vacancyBackgroundColor: string;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
  // Dynamic vacancy counter - added 2026-01-06
  vacancyDecrementInterval: number;
  vacancyHeadlineColor: string;
  vacancyCountColor: string;
  vacancyFooterColor: string;
  // Social Proof Carousel - added 2026-01-07
  socialProofCarouselItems: SocialProofItem[];
  carouselAutoPlay: boolean;
  carouselInterval: number;
  // Custom Footer - added 2026-01-07
  footerText: string;
  // Subheadline Font Size - added 2026-01-08
  subheadlineFontSize: EmojiSize;
  // Button Size - added 2026-01-09
  buttonSize: EmojiSize;
  // Group Customization - added 2026-01-11 for feature 018-whatsapp-customization
  groupImageUrl: string;
  participantCount: number | "";
  footerEnabled: boolean;
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
  socialProofEnabled: false,
  socialProofInterval: 10,
  // Updated 2026-01-06: Redirect toggle defaults
  redirectEnabled: true,
  buttonEvent: "",
  // Updated 2026-01-06: Vacancy counter defaults
  vacancyCounterEnabled: false,
  vacancyHeadline: "",
  vacancyCount: 0,
  vacancyFooter: "",
  vacancyBackgroundColor: "",
  vacancyCountFontSize: "large",
  vacancyHeadlineFontSize: "medium",
  vacancyFooterFontSize: "small",
  // Dynamic vacancy counter defaults
  vacancyDecrementInterval: 10,
  vacancyHeadlineColor: "",
  vacancyCountColor: "",
  vacancyFooterColor: "",
  // Social Proof Carousel defaults - added 2026-01-07
  socialProofCarouselItems: [],
  carouselAutoPlay: false,
  carouselInterval: 5,
  // Custom Footer defaults - added 2026-01-07
  footerText: "",
  // Subheadline Font Size defaults - added 2026-01-08
  subheadlineFontSize: "medium",
  // Button Size defaults - added 2026-01-09
  buttonSize: "medium",
  // Group Customization defaults - added 2026-01-11
  groupImageUrl: "",
  participantCount: "",
  footerEnabled: false,
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

  // Appearance configuration state
  const [appearanceForm, setAppearanceForm] = useState<AppearanceFormState>({
    redirectText: "Redirecionando...",
    backgroundColor: "",
    borderEnabled: false,
  });
  const [appearanceLoading, setAppearanceLoading] = useState(true);
  const [appearanceSaving, setAppearanceSaving] = useState(false);
  const [appearanceSuccess, setAppearanceSuccess] = useState<string | null>(null);

  // Generator state - feature 001-whatsapp-proof-generator
  const [generatorGroupName, setGeneratorGroupName] = useState('');
  const [generatorParticipants, setGeneratorParticipants] = useState<Participant[]>([]);
  const [generatorSelectedId, setGeneratorSelectedId] = useState<string | null>(null);
  const [generatorError, setGeneratorError] = useState<string | null>(null);
  const [generatorSuccess, setGeneratorSuccess] = useState<string | null>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);

  // Generator functions
  const addGeneratorParticipant = useCallback(() => {
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      label: `pessoa ${generatorParticipants.length + 1}`,
      name: '',
      message: '',
      timestamp: generateTimestamp(generatorParticipants.length),
      order: generatorParticipants.length
    };
    setGeneratorParticipants([...generatorParticipants, newParticipant]);
    setGeneratorSelectedId(newParticipant.id);
  }, [generatorParticipants]);

  const updateGeneratorParticipant = useCallback((id: string, field: keyof Participant, value: string) => {
    setGeneratorParticipants(generatorParticipants.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  }, [generatorParticipants]);

  const downloadScreenshot = useCallback(async () => {
    if (!screenshotRef.current) return;

    if (!generatorGroupName.trim()) {
      setGeneratorError('Nome do grupo é obrigatório');
      return;
    }
    if (generatorParticipants.length === 0 || !generatorParticipants.some(p => p.message.trim())) {
      setGeneratorError('Adicione pelo menos 1 participante com mensagem');
      return;
    }

    setGeneratorError(null);
    setGeneratorSuccess(null);

    try {
      const dataUrl = await toPng(screenshotRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#e5ddd5'
      });

      const link = document.createElement('a');
      link.download = generateFilename(generatorGroupName);
      link.href = dataUrl;
      link.click();

      setGeneratorSuccess('Screenshot baixado com sucesso!');
      setTimeout(() => setGeneratorSuccess(null), 3000);
    } catch (err) {
      setGeneratorError(`Falha ao gerar screenshot: ${err}`);
    }
  }, [generatorGroupName, generatorParticipants]);

  const defaultPixel = useMemo(
    () => pixels.find((p) => p.isDefault) ?? pixels[0] ?? null,
    [pixels],
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pixelsRes, pagesRes, appearanceRes] = await Promise.all([
          fetch("/api/pixels"),
          fetch("/api/whatsapp"),
          fetch("/api/whatsapp/appearance"),
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

        // Load appearance config
        if (appearanceRes.ok) {
          const appearanceData = await appearanceRes.json() as WhatsAppAppearanceRecord;
          setAppearanceForm({
            redirectText: appearanceData.redirectText,
            backgroundColor: appearanceData.backgroundColor || "",
            borderEnabled: appearanceData.borderEnabled,
          });
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) {
          setLoading(false);
          setAppearanceLoading(false);
        }
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
        // Updated 2026-01-03: Social proof notifications
        socialProofEnabled: form.socialProofEnabled,
        socialProofInterval: form.socialProofInterval,
        // Updated 2026-01-06: Redirect toggle
        redirectEnabled: form.redirectEnabled,
        buttonEvent: form.buttonEvent || undefined,
        // Updated 2026-01-06: Vacancy counter
        vacancyCounterEnabled: form.vacancyCounterEnabled,
        vacancyHeadline: form.vacancyHeadline,
        vacancyCount: form.vacancyCount,
        vacancyFooter: form.vacancyFooter || undefined,
        vacancyBackgroundColor: form.vacancyBackgroundColor || undefined,
        vacancyCountFontSize: form.vacancyCountFontSize,
        vacancyHeadlineFontSize: form.vacancyHeadlineFontSize,
        vacancyFooterFontSize: form.vacancyFooterFontSize,
        // Dynamic vacancy counter
        vacancyDecrementInterval: form.vacancyDecrementInterval,
        vacancyHeadlineColor: form.vacancyHeadlineColor || undefined,
        vacancyCountColor: form.vacancyCountColor || undefined,
        vacancyFooterColor: form.vacancyFooterColor || undefined,
        // Updated 2026-01-07: Social proof carousel
        socialProofCarouselItems: form.socialProofCarouselItems,
        carouselAutoPlay: form.carouselAutoPlay,
        carouselInterval: form.carouselInterval,
        // Updated 2026-01-07: Custom footer
        footerText: form.footerText || undefined,
        // Updated 2026-01-08: Subheadline font size
        subheadlineFontSize: form.subheadlineFontSize,
        // Updated 2026-01-09: Button size
        buttonSize: form.buttonSize,
        // Updated 2026-01-11: Group customization (feature 018)
        groupImageUrl: form.groupImageUrl || undefined,
        participantCount: form.participantCount === "" ? undefined : Number(form.participantCount),
        footerEnabled: form.footerEnabled,
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
      // Updated 2026-01-03: Social proof notifications
      socialProofEnabled: page.socialProofEnabled ?? false,
      socialProofInterval: page.socialProofInterval ?? 10,
      // Updated 2026-01-06: Redirect toggle
      redirectEnabled: page.redirectEnabled ?? true,
      buttonEvent: page.buttonEvent ?? "",
      // Updated 2026-01-06: Vacancy counter
      vacancyCounterEnabled: page.vacancyCounterEnabled ?? false,
      vacancyHeadline: page.vacancyHeadline ?? "",
      vacancyCount: page.vacancyCount ?? 0,
      vacancyFooter: page.vacancyFooter ?? "",
      vacancyBackgroundColor: page.vacancyBackgroundColor ?? "",
      vacancyCountFontSize: page.vacancyCountFontSize ?? "large",
      vacancyHeadlineFontSize: page.vacancyHeadlineFontSize ?? "medium",
      vacancyFooterFontSize: page.vacancyFooterFontSize ?? "small",
      // Dynamic vacancy counter
      vacancyDecrementInterval: page.vacancyDecrementInterval ?? 10,
      vacancyHeadlineColor: page.vacancyHeadlineColor ?? "",
      vacancyCountColor: page.vacancyCountColor ?? "",
      vacancyFooterColor: page.vacancyFooterColor ?? "",
      // Updated 2026-01-07: Social proof carousel
      socialProofCarouselItems: page.socialProofCarouselItems ?? [],
      carouselAutoPlay: page.carouselAutoPlay ?? false,
      carouselInterval: page.carouselInterval ?? 5,
      // Updated 2026-01-07: Custom footer
      footerText: page.footerText ?? "",
      // Updated 2026-01-08: Subheadline font size
      subheadlineFontSize: page.subheadlineFontSize ?? "medium",
      // Updated 2026-01-09: Button size
      buttonSize: page.buttonSize ?? "medium",
      // Updated 2026-01-11: Group customization (feature 018)
      groupImageUrl: page.groupImageUrl ?? "",
      participantCount: page.participantCount ?? "",
      footerEnabled: page.footerEnabled ?? false,
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

  const handleSaveAppearance = useCallback(async () => {
    setAppearanceSaving(true);
    setAppearanceSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/whatsapp/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          redirectText: appearanceForm.redirectText,
          backgroundColor: appearanceForm.backgroundColor || undefined,
          borderEnabled: appearanceForm.borderEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Erro ao salvar aparência");
      }
      setAppearanceSuccess("Configuração de aparência salva com sucesso!");
      setTimeout(() => setAppearanceSuccess(null), 3000);
    } catch (err) {
      setError(String(err));
    } finally {
      setAppearanceSaving(false);
    }
  }, [appearanceForm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Páginas WhatsApp</h1>
        <p className="text-muted-foreground">
          Crie páginas de redirecionamento para grupos de WhatsApp com headline, provas sociais e tracking.
        </p>
      </div>

      <form className="space-y-4 rounded-lg bg-card p-4" onSubmit={handleSubmit}>
        {/* Aba Geral - contém os 5 campos principais */}
        <Tabs defaultValue="geral" className="w-full">
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="gatilhos">Gatilhos</TabsTrigger>
            <TabsTrigger value="pixel">Pixel</TabsTrigger>
            <TabsTrigger value="gerador">Gerador de Provas</TabsTrigger>
          </TabsList>
          <TabsContent value="geral" className="space-y-4 mt-4">
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
              <label className="text-sm font-medium">Subheadline (uma por linha)</label>
              <textarea
                value={socialProofsText}
                onChange={(e) => setSocialProofsText(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={"Texto exibido abaixo do título principal\nUse múltiplas linhas para mais destaque"}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Texto exibido logo abaixo do headline na página de redirecionamento</p>

              {/* Subheadline Font Size Selector - added 2026-01-08 */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Tamanho da fonte:</span>
                <div className="flex gap-1">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, subheadlineFontSize: size }))}
                      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                        form.subheadlineFontSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-input"
                      }`}
                    >
                      {size === "small" ? "Pequeno" : size === "medium" ? "Médio" : "Grande"}
                    </button>
                  ))}
                </div>
              </div>
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

              {/* Button Size Selector - added 2026-01-09 for feature 017-whatsapp-button-size */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Tamanho do botão:</span>
                <div className="flex gap-1">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, buttonSize: size }))}
                      className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                        form.buttonSize === size
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-input"
                      }`}
                    >
                      {size === "small" ? "Pequeno" : size === "medium" ? "Médio" : "Grande"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Preview - added 2026-01-09 for feature 017-whatsapp-button-size */}
              <div className="mt-3 p-4 bg-zinc-100 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Preview do botão:</p>
                <div className="flex justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-green-500 font-bold text-white shadow-lg transition-all hover:bg-green-600 hover:shadow-xl active:scale-95",
                      BUTTON_SIZE_CLASSES[form.buttonSize]
                    )}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {form.buttonText || "Entrar no Grupo VIP"}
                  </span>
                </div>
              </div>
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

            {/* Aparência Global - movido para dentro da aba Geral */}
            <div className="mt-6 pt-6 border-t">
              <div className="mb-4">
                <h3 className="text-base font-semibold">Aparência Global</h3>
                <p className="text-xs text-muted-foreground">
                  Configurações visuais aplicadas a todas as páginas de redirecionamento /w/[slug]
                </p>
              </div>

              {appearanceLoading ? (
                <p className="text-sm text-muted-foreground">Carregando configuração...</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Texto de Redirecionamento</label>
                    <input
                      value={appearanceForm.redirectText}
                      onChange={(e) =>
                        setAppearanceForm((prev) => ({ ...prev, redirectText: e.target.value }))
                      }
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Redirecionando..."
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground">Texto exibido na caixa de redirecionamento (máx. 100 caracteres)</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Cor de Fundo (opcional)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={appearanceForm.backgroundColor || "#ffffff"}
                          onChange={(e) =>
                            setAppearanceForm((prev) => ({ ...prev, backgroundColor: e.target.value }))
                          }
                          className="h-10 w-14 cursor-pointer rounded border"
                        />
                        <input
                          value={appearanceForm.backgroundColor}
                          onChange={(e) =>
                            setAppearanceForm((prev) => ({ ...prev, backgroundColor: e.target.value }))
                          }
                          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="#RRGGBB"
                          maxLength={7}
                        />
                        {appearanceForm.backgroundColor && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAppearanceForm((prev) => ({ ...prev, backgroundColor: "" }))}
                          >
                            Limpar
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Formato hexadecimal (#RRGGBB) ou deixe vazio para transparente</p>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Borda</label>
                      <div className="flex items-center gap-3 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={appearanceForm.borderEnabled}
                            onChange={(e) =>
                              setAppearanceForm((prev) => ({ ...prev, borderEnabled: e.target.checked }))
                            }
                            className="rounded border-gray-300 h-4 w-4"
                          />
                          <span className="text-sm">{appearanceForm.borderEnabled ? "Habilitada" : "Desabilitada"}</span>
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">Borda cinza (#e5e7eb) ao redor da caixa</p>
                    </div>
                  </div>

                  {/* Appearance Preview */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Preview</label>
                    <div className="flex justify-center rounded-md border bg-zinc-100 p-6">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
                          appearanceForm.borderEnabled && "border border-gray-200"
                        )}
                        style={{
                          backgroundColor: appearanceForm.backgroundColor || "transparent",
                        }}
                      >
                        <svg
                          className="h-4 w-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {appearanceForm.redirectText || "Redirecionando..."}
                      </div>
                    </div>
                  </div>

                  {appearanceSuccess && <p className="text-sm text-green-600">{appearanceSuccess}</p>}

                  <Button
                    type="button"
                    onClick={handleSaveAppearance}
                    disabled={appearanceSaving || !appearanceForm.redirectText.trim()}
                  >
                    {appearanceSaving ? "Salvando..." : "Salvar Aparência"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba Gatilhos - Benefit Cards e Social Proof */}
          <TabsContent value="gatilhos" className="space-y-4 mt-4">
            {/* Benefit Cards Section */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
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
                    <div key={idx} className="flex items-start gap-2 rounded-md bg-background p-3">
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
                        <div key={idx} className="rounded-lg bg-white p-3 text-center">
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

            {/* Social Proof Notifications Section */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
              <div>
                <label className="text-sm font-medium">Notificações de Prova Social</label>
                <p className="text-xs text-muted-foreground">
                  Exibe notificações como &quot;Priscila de São Paulo acabou de entrar no grupo!&quot;
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.socialProofEnabled}
                    onChange={(e) => setForm((prev) => ({ ...prev, socialProofEnabled: e.target.checked }))}
                    className="rounded border-gray-300 h-4 w-4"
                  />
                  <span className="text-sm">Habilitar notificações</span>
                </label>
              </div>

              {form.socialProofEnabled && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Intervalo entre notificações (segundos)</label>
                  <input
                    type="number"
                    min={5}
                    max={60}
                    value={form.socialProofInterval}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 10;
                      setForm((prev) => ({ ...prev, socialProofInterval: Math.min(60, Math.max(5, val)) }));
                    }}
                    className="w-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">Mínimo: 5s | Máximo: 60s | Padrão: 10s</p>
                </div>
              )}
            </div>

            {/* Social Proof Carousel Section - added 2026-01-07 */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Carrossel de Provas Sociais</label>
                  <p className="text-xs text-muted-foreground">
                    Adicione depoimentos de clientes em texto ou imagens (máx. 10)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.carouselAutoPlay}
                      onChange={(e) => setForm((prev) => ({ ...prev, carouselAutoPlay: e.target.checked }))}
                      className="rounded border-gray-300 h-4 w-4"
                    />
                    <span className="text-xs">Auto-play</span>
                  </label>
                  {form.carouselAutoPlay && (
                    <input
                      type="number"
                      min={3}
                      max={15}
                      value={form.carouselInterval}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        setForm((prev) => ({ ...prev, carouselInterval: Math.min(15, Math.max(3, val)) }));
                      }}
                      className="w-16 rounded-md border bg-background px-2 py-1 text-xs outline-none"
                      title="Intervalo em segundos (3-15)"
                    />
                  )}
                </div>
              </div>

              {/* Existing Carousel Items List */}
              {form.socialProofCarouselItems.length > 0 && (
                <div className="space-y-2">
                  {form.socialProofCarouselItems.map((item, idx) => (
                    <div key={item.id} className="flex items-start gap-2 rounded-md bg-background p-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const newItems = [...form.socialProofCarouselItems];
                            [newItems[idx - 1], newItems[idx]] = [newItems[idx], newItems[idx - 1]];
                            setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === form.socialProofCarouselItems.length - 1}
                          onClick={() => {
                            const newItems = [...form.socialProofCarouselItems];
                            [newItems[idx], newItems[idx + 1]] = [newItems[idx + 1], newItems[idx]];
                            setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <span className="flex-shrink-0 text-2xl">
                        {item.type === 'text' ? '💬' : '🖼️'}
                      </span>
                      <div className="flex-1 min-w-0 space-y-1">
                        {item.type === 'text' ? (
                          <>
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...form.socialProofCarouselItems];
                                newItems[idx] = { ...item, description: e.target.value };
                                setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                              }}
                              placeholder="Descrição do depoimento"
                              maxLength={500}
                              rows={2}
                              className="w-full rounded border bg-background px-2 py-1 text-sm"
                            />
                            <div className="flex gap-2">
                              <input
                                value={item.author}
                                onChange={(e) => {
                                  const newItems = [...form.socialProofCarouselItems];
                                  newItems[idx] = { ...item, author: e.target.value };
                                  setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                                }}
                                placeholder="Autor"
                                maxLength={100}
                                className="flex-1 rounded border bg-background px-2 py-1 text-sm"
                              />
                              <input
                                value={item.city}
                                onChange={(e) => {
                                  const newItems = [...form.socialProofCarouselItems];
                                  newItems[idx] = { ...item, city: e.target.value };
                                  setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                                }}
                                placeholder="Cidade"
                                maxLength={100}
                                className="flex-1 rounded border bg-background px-2 py-1 text-sm"
                              />
                            </div>
                            {(!item.description || !item.author || !item.city) && (
                              <p className="text-xs text-destructive">Descrição, autor e cidade são obrigatórios</p>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              value={item.imageUrl}
                              onChange={(e) => {
                                const newItems = [...form.socialProofCarouselItems];
                                newItems[idx] = { ...item, imageUrl: e.target.value };
                                setForm((prev) => ({ ...prev, socialProofCarouselItems: newItems }));
                              }}
                              placeholder="URL da imagem (HTTPS)"
                              className="w-full rounded border bg-background px-2 py-1 text-sm"
                            />
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt="Preview"
                                className="mt-1 max-h-20 rounded object-contain"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            )}
                            {!item.imageUrl && (
                              <p className="text-xs text-destructive">URL da imagem é obrigatória</p>
                            )}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            socialProofCarouselItems: prev.socialProofCarouselItems.filter((_, i) => i !== idx),
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

              {/* Add New Item Buttons */}
              {form.socialProofCarouselItems.length < 10 && (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItem: SocialProofItem = {
                        id: crypto.randomUUID(),
                        type: 'text',
                        description: '',
                        author: '',
                        city: '',
                      };
                      setForm((prev) => ({
                        ...prev,
                        socialProofCarouselItems: [...prev.socialProofCarouselItems, newItem],
                      }));
                    }}
                  >
                    + Adicionar Texto
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItem: SocialProofItem = {
                        id: crypto.randomUUID(),
                        type: 'image',
                        imageUrl: '',
                      };
                      setForm((prev) => ({
                        ...prev,
                        socialProofCarouselItems: [...prev.socialProofCarouselItems, newItem],
                      }));
                    }}
                  >
                    + Adicionar Imagem
                  </Button>
                </div>
              )}
              {form.socialProofCarouselItems.length >= 10 && (
                <p className="text-xs text-muted-foreground">Limite de 10 provas sociais atingido</p>
              )}

              {/* Preview Section */}
              {form.socialProofCarouselItems.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <div className="rounded-md border bg-zinc-100 p-4">
                    <SocialProofCarousel
                      items={form.socialProofCarouselItems.filter(item =>
                        item.type === 'text'
                          ? item.description && item.author && item.city
                          : item.imageUrl
                      )}
                      autoPlay={false}
                      interval={form.carouselInterval}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Footer Section - added 2026-01-07 */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
              <div>
                <label className="text-sm font-medium">Rodapé Personalizado</label>
                <p className="text-xs text-muted-foreground">
                  Texto exibido no final da página (avisos legais, contato, etc.)
                </p>
              </div>
              <div className="grid gap-2">
                <textarea
                  value={form.footerText}
                  onChange={(e) => setForm((prev) => ({ ...prev, footerText: e.target.value }))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ex: Este grupo é exclusivo para membros. Dúvidas: contato@exemplo.com"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  {form.footerText.length}/500 caracteres | Deixe vazio para não exibir
                </p>
              </div>
            </div>

            {/* Vacancy Counter Section - added 2026-01-06 */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
              <div>
                <label className="text-sm font-medium">Contador de Vagas</label>
                <p className="text-xs text-muted-foreground">
                  Exibe um contador de vagas restantes para criar urgência
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  form.redirectEnabled && "opacity-50 cursor-not-allowed"
                )}>
                  <input
                    type="checkbox"
                    checked={form.vacancyCounterEnabled}
                    onChange={(e) => setForm((prev) => ({ ...prev, vacancyCounterEnabled: e.target.checked }))}
                    disabled={form.redirectEnabled}
                    className="rounded border-gray-300 h-4 w-4"
                  />
                  <span className="text-sm">Habilitar contador de vagas</span>
                </label>
              </div>
              {form.redirectEnabled && (
                <p className="text-xs text-amber-600">
                  Desabilite o redirect automático para usar o contador de vagas
                </p>
              )}

              {form.vacancyCounterEnabled && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Headline do Contador *</label>
                    <input
                      value={form.vacancyHeadline}
                      onChange={(e) => setForm((prev) => ({ ...prev, vacancyHeadline: e.target.value }))}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Ex: VAGAS DISPONÍVEIS"
                      maxLength={100}
                    />
                    {!form.vacancyHeadline && (
                      <p className="text-xs text-destructive">Headline é obrigatória quando o contador está habilitado</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Número de Vagas *</label>
                      <input
                        type="number"
                        min={0}
                        value={form.vacancyCount}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyCount: Math.max(0, parseInt(e.target.value) || 0) }))}
                        className="w-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-xs text-muted-foreground">Valor inicial do contador (diminui até zero)</p>
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Intervalo de Decremento (segundos)</label>
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={form.vacancyDecrementInterval}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 10;
                          setForm((prev) => ({ ...prev, vacancyDecrementInterval: Math.min(60, Math.max(1, val)) }));
                        }}
                        className="w-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-xs text-muted-foreground">Mínimo: 1s | Máximo: 60s | Padrão: 10s</p>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Footer (opcional)</label>
                    <input
                      value={form.vacancyFooter}
                      onChange={(e) => setForm((prev) => ({ ...prev, vacancyFooter: e.target.value }))}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Ex: Garanta sua vaga agora!"
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">Texto exibido abaixo do número (máx. 200 caracteres)</p>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Cor de Fundo (opcional)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={form.vacancyBackgroundColor || "#ffffff"}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyBackgroundColor: e.target.value }))}
                        className="h-10 w-14 cursor-pointer rounded border"
                      />
                      <input
                        value={form.vacancyBackgroundColor}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyBackgroundColor: e.target.value }))}
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        placeholder="#RRGGBB"
                        maxLength={7}
                      />
                      {form.vacancyBackgroundColor && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setForm((prev) => ({ ...prev, vacancyBackgroundColor: "" }))}
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Formato hexadecimal (#RRGGBB) ou deixe vazio para transparente</p>
                  </div>

                  {/* Cores de Texto */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Cor Headline</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={form.vacancyHeadlineColor || "#374151"}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyHeadlineColor: e.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded border"
                        />
                        <input
                          value={form.vacancyHeadlineColor}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyHeadlineColor: e.target.value }))}
                          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="#374151"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Cor Número</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={form.vacancyCountColor || "#16a34a"}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyCountColor: e.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded border"
                        />
                        <input
                          value={form.vacancyCountColor}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyCountColor: e.target.value }))}
                          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="#16a34a"
                          maxLength={7}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Cor Footer</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={form.vacancyFooterColor || "#4b5563"}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyFooterColor: e.target.value }))}
                          className="h-10 w-14 cursor-pointer rounded border"
                        />
                        <input
                          value={form.vacancyFooterColor}
                          onChange={(e) => setForm((prev) => ({ ...prev, vacancyFooterColor: e.target.value }))}
                          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                          placeholder="#4b5563"
                          maxLength={7}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tamanho Headline</label>
                      <select
                        value={form.vacancyHeadlineFontSize}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyHeadlineFontSize: e.target.value as EmojiSize }))}
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {EMOJI_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tamanho Número</label>
                      <select
                        value={form.vacancyCountFontSize}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyCountFontSize: e.target.value as EmojiSize }))}
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {EMOJI_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Tamanho Footer</label>
                      <select
                        value={form.vacancyFooterFontSize}
                        onChange={(e) => setForm((prev) => ({ ...prev, vacancyFooterFontSize: e.target.value as EmojiSize }))}
                        className="rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {EMOJI_SIZE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preview Section */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Preview</label>
                    <div className="flex justify-center rounded-md border bg-zinc-100 p-6">
                      <div
                        className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 px-6 py-4"
                        style={{ backgroundColor: form.vacancyBackgroundColor || "transparent" }}
                      >
                        <span
                          className={cn(
                            form.vacancyHeadlineFontSize === "small" && "text-sm",
                            form.vacancyHeadlineFontSize === "medium" && "text-base",
                            form.vacancyHeadlineFontSize === "large" && "text-xl",
                            "font-medium"
                          )}
                          style={{ color: form.vacancyHeadlineColor || "#374151" }}
                        >
                          {form.vacancyHeadline || "VAGAS DISPONÍVEIS"}
                        </span>
                        <span
                          className={cn(
                            "font-bold",
                            form.vacancyCountFontSize === "small" && "text-2xl",
                            form.vacancyCountFontSize === "medium" && "text-4xl",
                            form.vacancyCountFontSize === "large" && "text-6xl",
                          )}
                          style={{ color: form.vacancyCountColor || "#16a34a" }}
                        >
                          {form.vacancyCount}
                        </span>
                        {form.vacancyFooter && (
                          <span
                            className={cn(
                              form.vacancyFooterFontSize === "small" && "text-xs",
                              form.vacancyFooterFontSize === "medium" && "text-sm",
                              form.vacancyFooterFontSize === "large" && "text-base",
                            )}
                            style={{ color: form.vacancyFooterColor || "#4b5563" }}
                          >
                            {form.vacancyFooter}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba Pixel - Configurações de rastreamento */}
          <TabsContent value="pixel" className="space-y-4 mt-4">
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
                <label className="text-sm font-medium">Evento de Redirect Automático *</label>
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
                <p className="text-xs text-muted-foreground">Disparado quando o countdown chega a zero</p>
              </div>
            </div>

            {/* Updated 2026-01-06: Evento do Botão */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Evento do Botão (opcional)</label>
              <select
                value={form.buttonEvent}
                onChange={(e) => setForm((prev) => ({ ...prev, buttonEvent: e.target.value as MetaEvent | "" }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring sm:w-64"
              >
                <option value="">Usar evento de redirect</option>
                {META_STANDARD_EVENTS.map((event) => (
                  <option key={event} value={event}>
                    {event}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                Evento disparado ao clicar no botão. Se não selecionado, usa o evento de redirect.
              </p>
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

            {/* Updated 2026-01-06: Redirect Toggle and Delay */}
            {/* Updated 2026-01-06: Mutual exclusivity with vacancy counter */}
            <div className="grid gap-4 rounded-md bg-accent/30 p-4">
              <div>
                <label className="text-sm font-medium">Redirect Automático</label>
                <p className="text-xs text-muted-foreground">
                  Controla se o usuário será redirecionado automaticamente após o countdown
                </p>
              </div>

              <div className="flex items-center gap-4">
                <label className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  form.vacancyCounterEnabled && "opacity-50 cursor-not-allowed"
                )}>
                  <input
                    type="checkbox"
                    checked={form.redirectEnabled}
                    onChange={(e) => setForm((prev) => ({ ...prev, redirectEnabled: e.target.checked }))}
                    disabled={form.vacancyCounterEnabled}
                    className="rounded border-gray-300 h-4 w-4"
                  />
                  <span className="text-sm">{form.redirectEnabled ? "Habilitado" : "Desabilitado"}</span>
                </label>
              </div>
              {form.vacancyCounterEnabled && (
                <p className="text-xs text-amber-600">
                  Desabilite o contador de vagas para usar o redirect automático
                </p>
              )}

              {form.redirectEnabled && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tempo de Redirect (segundos)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={form.redirectDelay}
                    onChange={(e) => setForm((prev) => ({ ...prev, redirectDelay: parseInt(e.target.value) || 5 }))}
                    className="w-32 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">Mín: 1s | Máx: 30s | Padrão: 5s</p>
                </div>
              )}

              {!form.redirectEnabled && !form.vacancyCounterEnabled && (
                <p className="text-xs text-muted-foreground italic">
                  Com redirect desabilitado, o usuário só será redirecionado ao clicar no botão.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Feature 001-whatsapp-proof-generator */}
          <TabsContent value="gerador" className="space-y-4 mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Crie capturas de tela de grupos do WhatsApp para usar como prova social nas suas páginas.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Editor */}
                <div className="space-y-4">
                  {/* Group name input */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Nome do Grupo *</label>
                    <input
                      type="text"
                      value={generatorGroupName}
                      onChange={(e) => setGeneratorGroupName(e.target.value)}
                      placeholder="Ex: Grupo VIP Shopee"
                      maxLength={100}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground">
                      {generatorGroupName.length}/100 caracteres
                    </p>
                  </div>

                  {/* Participant management */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Participantes</label>
                    {generatorParticipants.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum participante adicionado</p>
                    ) : (
                      <Tabs value={generatorSelectedId ?? ''} onValueChange={setGeneratorSelectedId}>
                        <TabsList className="w-full flex-wrap h-auto">
                          {generatorParticipants.map((p) => (
                            <TabsTrigger key={p.id} value={p.id}>{p.label}</TabsTrigger>
                          ))}
                        </TabsList>
                        {generatorParticipants.map((p) => (
                          <TabsContent key={p.id} value={p.id} className="space-y-3">
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => updateGeneratorParticipant(p.id, 'name', e.target.value)}
                              placeholder="Nome (opcional)"
                              maxLength={50}
                              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                            />
                            <p className="text-xs text-muted-foreground">
                              {p.name.length}/50 caracteres
                            </p>
                            <textarea
                              value={p.message}
                              onChange={(e) => updateGeneratorParticipant(p.id, 'message', e.target.value)}
                              placeholder="Mensagem *"
                              maxLength={500}
                              rows={3}
                              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                              {p.message.length}/500 caracteres
                            </p>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                    <Button
                      type="button"
                      onClick={addGeneratorParticipant}
                      disabled={generatorParticipants.length >= 20}
                      className="w-full sm:w-auto"
                    >
                      + Adicionar Pessoa
                    </Button>
                    {generatorParticipants.length >= 20 && (
                      <p className="text-xs text-muted-foreground">
                        Máximo de 20 participantes atingido
                      </p>
                    )}
                  </div>

                  {/* Error and success messages */}
                  {generatorError && <p className="text-sm text-destructive">{generatorError}</p>}
                  {generatorSuccess && <p className="text-sm text-green-600">{generatorSuccess}</p>}

                  {/* Download button */}
                  <Button
                    type="button"
                    onClick={downloadScreenshot}
                    size="lg"
                    className="w-full"
                  >
                    Download Screenshot
                  </Button>
                </div>

                {/* Right: Preview - INTEGRA TODAS AS FEATURES (Gerador + Personalizações US1, US2, US3) */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Preview (com todas as personalizações)</h3>
                  <div
                    ref={screenshotRef}
                    className="max-w-md mx-auto bg-[#e5ddd5] rounded-lg overflow-hidden shadow-lg relative"
                  >
                    {/* WhatsApp Header */}
                    <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
                      {/* Group Image - US1 Preview */}
                      {form.groupImageUrl ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
                          <img
                            src={form.groupImageUrl}
                            alt="Grupo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                          {generatorGroupName || 'Nome do Grupo'}
                        </p>
                        {/* Participant Count - US2 Preview */}
                        <p className="text-xs opacity-90">
                          {form.participantCount && form.participantCount > 0
                            ? `${typeof form.participantCount === 'number' ? form.participantCount.toLocaleString('pt-BR') : form.participantCount} participantes`
                            : `${generatorParticipants.length} ${generatorParticipants.length === 1 ? 'participante' : 'participantes'}`
                          }
                        </p>
                      </div>
                    </div>

                    {/* Message bubbles */}
                    <div className="p-4 space-y-2 min-h-[300px]" style={{ paddingBottom: form.footerEnabled ? '60px' : '16px' }}>
                      {generatorParticipants.map((p) => (
                        p.message.trim() && (
                          <div key={p.id} className="flex flex-col">
                            <div className="bg-white rounded-lg px-3 py-2 max-w-[80%] shadow-sm">
                              {p.name && (
                                <p className="text-xs font-semibold text-[#075e54] mb-1" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                                  {p.name}
                                </p>
                              )}
                              <p className="text-sm break-words" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                                {p.message}
                              </p>
                              <p className="text-[10px] text-gray-500 text-right mt-1">
                                {p.timestamp}
                              </p>
                            </div>
                          </div>
                        )
                      ))}
                      {generatorParticipants.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-10">
                          Adicione participantes para visualizar o preview
                        </p>
                      )}
                    </div>

                    {/* WhatsApp Footer - US3 Preview */}
                    {form.footerEnabled && (
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Digite uma mensagem"
                            disabled
                            className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm"
                            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
                          />
                          <button
                            type="button"
                            disabled
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Group Customization - added 2026-01-11 for feature 018-whatsapp-customization */}
              <div className="mt-6 pt-6 border-t">
                <div className="mb-4">
                  <h3 className="text-base font-semibold">Personalização do Grupo</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure a imagem do grupo, contagem de participantes e footer interativo
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Group Image URL - US1 */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">URL da Imagem do Grupo (opcional)</label>
                    <input
                      value={form.groupImageUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, groupImageUrl: e.target.value }))}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="https://exemplo.com/grupo.jpg"
                      type="url"
                    />
                    <p className="text-xs text-muted-foreground">
                      Imagem circular exibida no topo (HTTPS obrigatório, formatos: .jpg, .png, .gif, .webp)
                    </p>
                  </div>

                  {/* Participant Count - US2 */}
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Quantidade de Participantes (opcional)</label>
                    <input
                      type="number"
                      min="0"
                      max="999999"
                      value={form.participantCount}
                      onChange={(e) => setForm((prev) => ({ ...prev, participantCount: e.target.value === "" ? "" : Number(e.target.value) }))}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Ex: 247"
                    />
                    <p className="text-xs text-muted-foreground">
                      Exibe contagem de participantes abaixo do headline (0 a 999.999)
                    </p>
                  </div>

                  {/* Footer Enabled - US3 */}
                  <div className="flex items-center gap-2">
                    <input
                      id="footerEnabled"
                      type="checkbox"
                      checked={form.footerEnabled}
                      onChange={(e) => setForm((prev) => ({ ...prev, footerEnabled: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="footerEnabled" className="text-sm font-medium cursor-pointer">
                      Exibir footer estilo WhatsApp
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6">
                    Footer fixo na parte inferior com campo de texto e botão de envio (redireciona para WhatsApp)
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Status - fora das abas */}
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

      <div className="rounded-lg border bg-card p-4">
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
                  "flex flex-col gap-2 rounded-md px-3 py-2 sm:flex-row sm:items-center sm:justify-between",
                  editingId === page.id && "ring-2 ring-primary"
                )}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{page.headline}</p>
                  <p className="text-xs text-muted-foreground break-all">
                    {page.whatsappUrl}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Eventos: {page.events.join(", ")} | Redirect: {page.redirectEvent}
                    {page.buttonEvent && page.buttonEvent !== page.redirectEvent && ` | Botão: ${page.buttonEvent}`}
                    {page.redirectEnabled ? ` | Delay: ${page.redirectDelay}s` : " | Auto-redirect: Desabilitado"}
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
                  <div className="flex gap-2">
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
                    {page.socialProofEnabled && (
                      <span className="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-800">
                        Prova Social
                      </span>
                    )}
                    {page.vacancyCounterEnabled && (
                      <span className="rounded-full px-2 py-1 text-xs bg-amber-100 text-amber-800">
                        Contador
                      </span>
                    )}
                  </div>
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
