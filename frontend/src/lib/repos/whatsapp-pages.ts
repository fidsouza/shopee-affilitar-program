'use server';

import type { MetaEvent } from "@/lib/meta-events";
import { readValue, upsertItems } from "@/lib/edge-config";
import {
  deleteWhatsAppPageSchema,
  whatsAppPageSchema,
  type BenefitCard,
  type DeleteWhatsAppPageInput,
  type EmojiSize,
  type WhatsAppPageInput,
} from "@/lib/validation";
import { uuidv4 } from "@/lib/uuid";
import { logInfo, logError } from "@/lib/logging";

// Updated 2025-12-31: Multi-event support (events[] + redirectEvent)
// Updated 2026-01-01: Benefit cards support (benefitCards[] + emojiSize)
// Updated 2026-01-03: Social proof notifications (socialProofEnabled + socialProofInterval)
// Updated 2026-01-06: Redirect toggle (redirectEnabled + buttonEvent)
export type WhatsAppPageRecord = Omit<WhatsAppPageInput, 'headerImageUrl' | 'pixelConfigId' | 'benefitCards' | 'emojiSize' | 'socialProofEnabled' | 'socialProofInterval' | 'buttonEvent'> & {
  id: string;
  slug: string;
  headerImageUrl?: string;
  pixelConfigId?: string;
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
  socialProofEnabled: boolean;
  socialProofInterval: number;
  redirectEnabled: boolean;
  buttonEvent?: MetaEvent;
  createdAt: string;
  updatedAt: string;
};

// Legacy type for migration from buttonEvent to events/redirectEvent and missing fields
type LegacyWhatsAppPageRecord = Omit<WhatsAppPageRecord, 'events' | 'redirectEvent' | 'benefitCards' | 'emojiSize' | 'socialProofEnabled' | 'socialProofInterval' | 'redirectEnabled' | 'buttonEvent'> & {
  buttonEvent?: MetaEvent;
  events?: MetaEvent[];
  redirectEvent?: MetaEvent;
  benefitCards?: BenefitCard[];
  emojiSize?: EmojiSize;
  socialProofEnabled?: boolean;
  socialProofInterval?: number;
  redirectEnabled?: boolean;
};

// Migrate legacy record to new format (backward compatibility)
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  // Start with record as base
  let migrated = { ...record } as WhatsAppPageRecord;

  // Migrate from buttonEvent to events/redirectEvent if needed
  if (!record.events || !record.redirectEvent) {
    const buttonEvent = record.buttonEvent as MetaEvent;
    migrated = {
      ...migrated,
      events: record.events ?? [buttonEvent],
      redirectEvent: record.redirectEvent ?? buttonEvent,
    };
  }

  // Add default benefitCards and emojiSize if missing (backward compatibility)
  migrated.benefitCards = record.benefitCards ?? [];
  migrated.emojiSize = record.emojiSize ?? "medium";

  // Add default socialProof fields if missing (backward compatibility)
  migrated.socialProofEnabled = record.socialProofEnabled ?? false;
  migrated.socialProofInterval = record.socialProofInterval ?? 10;

  // Add default redirectEnabled and buttonEvent if missing (backward compatibility - 2026-01-06)
  migrated.redirectEnabled = record.redirectEnabled ?? true;
  migrated.buttonEvent = record.buttonEvent; // undefined = uses redirectEvent

  return migrated;
}

type WhatsAppPageIndexEntry = {
  id: string;
  slug: string;
  headline: string;
  status: 'active' | 'inactive';
};

const WHATSAPP_PAGES_INDEX_KEY = "whatsapp_pages_index";
const whatsappPageKey = (id: string) => `whatsapp_pages_${id}`;

async function getIndex(): Promise<WhatsAppPageIndexEntry[]> {
  const index = await readValue<WhatsAppPageIndexEntry[]>(WHATSAPP_PAGES_INDEX_KEY);
  return index ?? [];
}

function slugifyHeadline(headline: string): string {
  return headline
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `page-${Math.random().toString(36).slice(2, 6)}`;
}

function uniqueSlug(base: string, index: WhatsAppPageIndexEntry[], currentId?: string): string {
  const existingSlugs = new Set(index.filter((p) => p.id !== currentId).map((p) => p.slug));
  if (!existingSlugs.has(base)) return base;
  let attempt = 1;
  let candidate = `${base}-${attempt}`;
  while (existingSlugs.has(candidate)) {
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }
  return candidate;
}

export async function listWhatsAppPages(): Promise<WhatsAppPageRecord[]> {
  const index = await getIndex();
  if (index.length === 0) return [];
  const entries = await Promise.all(
    index.map((item) => readValue<LegacyWhatsAppPageRecord>(whatsappPageKey(item.id))),
  );
  // Apply migration for legacy records (buttonEvent -> events/redirectEvent)
  return entries.filter(Boolean).map((record) => migrateRecord(record!));
}

export async function getWhatsAppPageBySlug(slug: string): Promise<WhatsAppPageRecord | null> {
  const index = await getIndex();
  const entry = index.find((item) => item.slug === slug);
  if (!entry) return null;
  const record = await readValue<LegacyWhatsAppPageRecord>(whatsappPageKey(entry.id));
  if (!record) return null;

  // DEBUG: Log raw record from Edge Config
  logInfo("getWhatsAppPageBySlug_raw", {
    slug,
    rawKeys: Object.keys(record),
    hasHeaderImageUrl: "headerImageUrl" in record,
    headerImageUrl: record.headerImageUrl ?? "NOT_SET",
    rawRecord: JSON.stringify(record),
  });

  // Apply migration for legacy records (buttonEvent -> events/redirectEvent)
  return migrateRecord(record);
}

export async function upsertWhatsAppPage(input: WhatsAppPageInput): Promise<WhatsAppPageRecord> {
  const parsed = whatsAppPageSchema.parse(input);
  const now = new Date().toISOString();
  const id = parsed.id ?? uuidv4();

  const index = await getIndex();
  const existing = await readValue<WhatsAppPageRecord>(whatsappPageKey(id));

  const baseSlug = slugifyHeadline(parsed.headline);
  const slug = existing?.slug ?? uniqueSlug(baseSlug, index, id);

  // Handle headerImageUrl:
  // - If parsed has a non-empty URL, use it
  // - If parsed is empty string "", user wants to clear it -> undefined
  // - If parsed is undefined, preserve existing value
  const resolvedHeaderImageUrl =
    parsed.headerImageUrl !== undefined
      ? (parsed.headerImageUrl || undefined) // User explicitly set value (empty clears, non-empty keeps)
      : existing?.headerImageUrl; // Not in payload, preserve existing

  const record: WhatsAppPageRecord = {
    id,
    slug,
    headline: parsed.headline,
    headerImageUrl: resolvedHeaderImageUrl,
    socialProofs: parsed.socialProofs,
    buttonText: parsed.buttonText,
    whatsappUrl: parsed.whatsappUrl,
    pixelConfigId: parsed.pixelConfigId || undefined,
    // Updated 2025-12-31: Multi-event support
    events: parsed.events,
    redirectEvent: parsed.redirectEvent,
    redirectDelay: parsed.redirectDelay,
    status: parsed.status,
    // Updated 2026-01-01: Benefit cards support
    benefitCards: parsed.benefitCards ?? existing?.benefitCards ?? [],
    emojiSize: parsed.emojiSize ?? existing?.emojiSize ?? "medium",
    // Updated 2026-01-03: Social proof notifications
    socialProofEnabled: parsed.socialProofEnabled ?? existing?.socialProofEnabled ?? false,
    socialProofInterval: parsed.socialProofInterval ?? existing?.socialProofInterval ?? 10,
    // Updated 2026-01-06: Redirect toggle
    redirectEnabled: parsed.redirectEnabled ?? existing?.redirectEnabled ?? true,
    buttonEvent: parsed.buttonEvent ?? existing?.buttonEvent,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const newIndex: WhatsAppPageIndexEntry[] = [
    ...index.filter((p) => p.id !== id),
    {
      id,
      slug,
      headline: record.headline,
      status: record.status,
    },
  ];

  await upsertItems([
    { key: whatsappPageKey(id), value: record },
    { key: WHATSAPP_PAGES_INDEX_KEY, value: newIndex },
  ]);

  logInfo("whatsapp_page_upsert", { id, slug, isNew: !existing });

  return record;
}

export async function deleteWhatsAppPage(input: DeleteWhatsAppPageInput): Promise<void> {
  const { pageId } = deleteWhatsAppPageSchema.parse(input);
  const index = await getIndex();
  const remaining = index.filter((item) => item.id !== pageId);

  // If not found, treat as idempotent success.
  if (remaining.length === index.length) {
    logInfo("whatsapp_page_delete_not_found", { pageId });
    return;
  }

  await upsertItems([
    { key: whatsappPageKey(pageId), operation: "delete" },
    { key: WHATSAPP_PAGES_INDEX_KEY, value: remaining },
  ]);

  logInfo("whatsapp_page_delete", { pageId });
}
