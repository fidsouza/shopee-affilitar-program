import { z } from "zod";

import { META_STANDARD_EVENTS, type MetaEvent } from "./meta-events";

const metaEventEnum = z.enum(META_STANDARD_EVENTS);
const allowedHosts = ["shopee", "aliexpress", "mercadolivre", "amazon"];

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
    events: z
      .array(metaEventEnum, { invalid_type_error: "Selecione pelo menos um evento" })
      .min(1, "Selecione pelo menos um evento")
      .transform(dedupeEvents),
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
