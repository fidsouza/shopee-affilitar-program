import { z } from "zod";

import { META_STANDARD_EVENTS, type MetaEvent } from "./meta-events";

const metaEventEnum = z.enum(META_STANDARD_EVENTS);
const allowedHosts = ["shopee", "aliexpress", "mercadolivre", "amazon"];
const uuidString = z.string().uuid("ID inválido");

function dedupeEvents(events: MetaEvent[]): MetaEvent[] {
  return Array.from(new Set(events));
}

function isAllowedAffiliateHost(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.protocol === "https:" &&
      allowedHosts.some((host) => parsed.hostname.toLowerCase().includes(host))
    );
  } catch {
    return false;
  }
}

export const pixelConfigSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1, "Informe um nome para o pixel"),
  pixelId: z
    .string()
    .regex(/^[0-9]{10,20}$/, "Pixel ID deve conter apenas números (10-20 dígitos)"),
  isDefault: z.boolean().optional().default(false),
  defaultEvents: z
    .array(metaEventEnum)
    .optional()
    .transform((events) => dedupeEvents(events ?? [])),
});

export type PixelConfigInput = z.infer<typeof pixelConfigSchema>;

export const productLinkSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().min(1, "Informe um título"),
    affiliateUrl: z
      .string()
      .min(1, "Informe a URL do afiliado")
      .refine(isAllowedAffiliateHost, "URL deve ser https e pertencer a shopee/aliexpress/mercadolivre/amazon"),
    pixelConfigId: z.string().min(1, "Selecione um pixel"),
    events: z.array(metaEventEnum).min(1, "Selecione pelo menos um evento").transform(dedupeEvents),
    status: z.enum(["active", "inactive"]),
  })
  .refine(
    (data) => data.status === "inactive" || data.events.length > 0,
    "Links ativos precisam de eventos selecionados",
  )
  .refine(
    (data) => data.status === "inactive" || Boolean(data.pixelConfigId),
    "Links ativos precisam de um pixel selecionado",
  );

export type ProductLinkInput = z.infer<typeof productLinkSchema>;

export const deleteProductSchema = z.object({
  productId: uuidString,
});

export type DeleteProductInput = z.infer<typeof deleteProductSchema>;

export const deletePixelSchema = z.object({
  pixelId: uuidString,
});

export type DeletePixelInput = z.infer<typeof deletePixelSchema>;

// Benefit Card Validation
export const benefitCardSchema = z.object({
  emoji: z.string()
    .min(1, "Emoji é obrigatório")
    .max(2, "Emoji deve ter no máximo 2 caracteres"),
  title: z.string()
    .min(1, "Título é obrigatório")
    .max(50, "Título deve ter no máximo 50 caracteres"),
  description: z.string()
    .max(150, "Descrição deve ter no máximo 150 caracteres")
    .optional(),
});

export type BenefitCard = z.infer<typeof benefitCardSchema>;

export const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");
export type EmojiSize = z.infer<typeof emojiSizeSchema>;

// Social Proof Carousel Items - added 2026-01-07 for feature 015-whatsapp-social-carousel-footer
export const socialProofTextItemSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('text'),
  description: z.string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  author: z.string()
    .min(1, "Autor é obrigatório")
    .max(100, "Nome do autor deve ter no máximo 100 caracteres"),
  city: z.string()
    .min(1, "Cidade é obrigatória")
    .max(100, "Cidade deve ter no máximo 100 caracteres"),
});

export const socialProofImageItemSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('image'),
  imageUrl: z.string()
    .url("URL inválida")
    .refine((url) => url.startsWith("https://"), "URL deve usar HTTPS"),
});

export const socialProofItemSchema = z.discriminatedUnion('type', [
  socialProofTextItemSchema,
  socialProofImageItemSchema,
]);

export type SocialProofItem = z.infer<typeof socialProofItemSchema>;
export type SocialProofTextItem = z.infer<typeof socialProofTextItemSchema>;
export type SocialProofImageItem = z.infer<typeof socialProofImageItemSchema>;

// WhatsApp Page Validation
const allowedWhatsAppHosts = ["chat.whatsapp.com", "wa.me"];

function isAllowedWhatsAppHost(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") return false;
    return allowedWhatsAppHosts.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export const whatsAppPageSchema = z.object({
  id: z.string().uuid().optional(),
  headline: z.string().min(1, "Informe uma headline").max(200, "Headline muito longa (máx. 200 caracteres)"),
  headerImageUrl: z
    .string()
    .url("URL de imagem inválida")
    .refine((url) => url.startsWith("https://"), "URL deve usar HTTPS")
    .optional()
    .or(z.literal("")),
  socialProofs: z.array(z.string()).default([]),
  buttonText: z.string().min(1, "Informe o texto do botão").max(100, "Texto do botão muito longo (máx. 100 caracteres)"),
  // Button Size - added 2026-01-09 for feature 017-whatsapp-button-size
  buttonSize: emojiSizeSchema.default("medium"),
  whatsappUrl: z
    .string()
    .min(1, "Informe a URL do WhatsApp")
    .refine(isAllowedWhatsAppHost, "URL deve ser do WhatsApp (chat.whatsapp.com ou wa.me)"),
  pixelConfigId: z.string().uuid().optional().or(z.literal("")),
  // Updated 2025-12-31: Multi-event support
  events: z.array(metaEventEnum).min(1, "Selecione pelo menos um evento").transform(dedupeEvents),
  redirectEvent: metaEventEnum,
  redirectDelay: z.number().int().min(1, "Mínimo 1 segundo").max(30, "Máximo 30 segundos").default(5),
  status: z.enum(["active", "inactive"]),
  // Benefit Cards - added 2026-01-01
  benefitCards: z.array(benefitCardSchema)
    .max(8, "Máximo de 8 benefit cards por página")
    .default([]),
  emojiSize: emojiSizeSchema,
  // Social Proof Notifications - added 2026-01-03
  socialProofEnabled: z.boolean().default(false),
  socialProofInterval: z.number()
    .int("Intervalo deve ser número inteiro")
    .min(5, "Intervalo mínimo: 5 segundos")
    .max(60, "Intervalo máximo: 60 segundos")
    .default(10),
  // Redirect Toggle - added 2026-01-06 for feature 013-redirect-toggle
  redirectEnabled: z.boolean().default(true),
  buttonEvent: metaEventEnum.optional(),
  // Vacancy Counter - added 2026-01-06 for feature 014-whatsapp-vacancy-counter
  vacancyCounterEnabled: z.boolean().default(false),
  vacancyHeadline: z.string()
    .max(100, "Headline do contador deve ter no máximo 100 caracteres")
    .default(""),
  vacancyCount: z.number()
    .int("Número de vagas deve ser inteiro")
    .min(0, "Número de vagas não pode ser negativo")
    .default(0),
  vacancyFooter: z.string()
    .max(200, "Footer do contador deve ter no máximo 200 caracteres")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyBackgroundColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyCountFontSize: emojiSizeSchema.default("large"),
  vacancyHeadlineFontSize: emojiSizeSchema.default("medium"),
  vacancyFooterFontSize: emojiSizeSchema.default("small"),
  // Dynamic vacancy counter - added 2026-01-06
  vacancyDecrementInterval: z.number()
    .int("Intervalo deve ser número inteiro")
    .min(1, "Intervalo mínimo: 1 segundo")
    .max(60, "Intervalo máximo: 60 segundos")
    .default(10),
  vacancyHeadlineColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyCountColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyFooterColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  // Social Proof Carousel - added 2026-01-07 for feature 015-whatsapp-social-carousel-footer
  socialProofCarouselItems: z.array(socialProofItemSchema)
    .max(10, "Máximo de 10 provas sociais por página")
    .default([]),
  carouselAutoPlay: z.boolean().default(false),
  carouselInterval: z.number()
    .int("Intervalo deve ser número inteiro")
    .min(3, "Intervalo mínimo: 3 segundos")
    .max(15, "Intervalo máximo: 15 segundos")
    .default(5),
  // Custom Footer - added 2026-01-07 for feature 015-whatsapp-social-carousel-footer
  footerText: z.string()
    .max(500, "Footer deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  // Subheadline Font Size - added 2026-01-08 for feature 016-subheadline-font-size
  subheadlineFontSize: emojiSizeSchema.default("medium"),
  // Group Image URL - added 2026-01-11 for feature 018-whatsapp-customization
  groupImageUrl: z
    .string()
    .url("URL inválida")
    .regex(
      /^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
      "URL deve ser HTTPS e apontar para uma imagem válida (.jpg, .png, .gif, .webp)"
    )
    .max(2048, "URL deve ter no máximo 2048 caracteres")
    .optional()
    .or(z.literal(""))
    .transform(v => v || undefined),
  // Participant Count - added 2026-01-11 for feature 018-whatsapp-customization
  participantCount: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade deve ser maior ou igual a 0")
    .max(999999, "Quantidade deve ser menor que 1.000.000")
    .optional(),
  // Footer Enabled - added 2026-01-11 for feature 018-whatsapp-customization
  footerEnabled: z.boolean().default(false),
});

export type WhatsAppPageInput = z.infer<typeof whatsAppPageSchema>;

export const deleteWhatsAppPageSchema = z.object({
  pageId: uuidString,
});

export type DeleteWhatsAppPageInput = z.infer<typeof deleteWhatsAppPageSchema>;

// WhatsApp Appearance Config - Global styling for /w/[slug] pages
// Added 2026-01-04 for feature 009-whatsapp-appearance
export const whatsAppAppearanceSchema = z.object({
  redirectText: z.string()
    .min(1, "Texto é obrigatório")
    .max(100, "Texto muito longo (máx. 100 caracteres)"),
  backgroundColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal("")),
  borderEnabled: z.boolean().default(false),
});

export type WhatsAppAppearanceInput = z.infer<typeof whatsAppAppearanceSchema>;
