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
});

export type WhatsAppPageInput = z.infer<typeof whatsAppPageSchema>;

export const deleteWhatsAppPageSchema = z.object({
  pageId: uuidString,
});

export type DeleteWhatsAppPageInput = z.infer<typeof deleteWhatsAppPageSchema>;
