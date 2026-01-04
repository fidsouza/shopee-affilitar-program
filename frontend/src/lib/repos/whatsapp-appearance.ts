'use server';

import { readValue, upsertItems } from "@/lib/edge-config";
import {
  whatsAppAppearanceSchema,
  type WhatsAppAppearanceInput,
} from "@/lib/validation";

const APPEARANCE_KEY = "whatsapp_appearance";

export type WhatsAppAppearanceRecord = {
  redirectText: string;
  backgroundColor?: string;
  borderEnabled: boolean;
  updatedAt: string;
};

const DEFAULT_APPEARANCE: WhatsAppAppearanceRecord = {
  redirectText: "Redirecionando...",
  backgroundColor: undefined,
  borderEnabled: false,
  updatedAt: new Date().toISOString(),
};

/**
 * Get the global WhatsApp appearance configuration.
 * Returns default values if no configuration exists.
 */
export async function getWhatsAppAppearance(): Promise<WhatsAppAppearanceRecord> {
  const config = await readValue<WhatsAppAppearanceRecord>(APPEARANCE_KEY);
  return config ?? { ...DEFAULT_APPEARANCE, updatedAt: new Date().toISOString() };
}

/**
 * Update the global WhatsApp appearance configuration.
 * Validates input and persists to Edge Config.
 */
export async function updateWhatsAppAppearance(
  input: WhatsAppAppearanceInput
): Promise<WhatsAppAppearanceRecord> {
  const parsed = whatsAppAppearanceSchema.parse(input);
  const now = new Date().toISOString();

  const record: WhatsAppAppearanceRecord = {
    redirectText: parsed.redirectText,
    backgroundColor: parsed.backgroundColor || undefined,
    borderEnabled: parsed.borderEnabled,
    updatedAt: now,
  };

  await upsertItems([{ key: APPEARANCE_KEY, value: record }]);

  return record;
}
