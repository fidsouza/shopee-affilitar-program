'use server';

import type { MetaEvent } from "@/lib/meta-events";
import { readValue, readValues, upsertItems } from "@/lib/edge-config";
import {
  deleteWhatsAppPageSchema,
  whatsAppPageSchema,
  type BenefitCard,
  type DeleteWhatsAppPageInput,
  type EmojiSize,
  type SocialProofItem,
  type WhatsAppPageInput,
} from "@/lib/validation";
import { uuidv4 } from "@/lib/uuid";
import { logInfo, logError } from "@/lib/logging";

// Updated 2025-12-31: Multi-event support (events[] + redirectEvent)
// Updated 2026-01-01: Benefit cards support (benefitCards[] + emojiSize)
// Updated 2026-01-03: Social proof notifications (socialProofEnabled + socialProofInterval)
// Updated 2026-01-06: Redirect toggle (redirectEnabled + buttonEvent)
// Updated 2026-01-06: Vacancy counter (vacancyCounterEnabled + vacancyHeadline + vacancyCount + vacancyFooter + vacancyBackgroundColor + vacancyCountFontSize + vacancyHeadlineFontSize + vacancyFooterFontSize + vacancyDecrementInterval + vacancyHeadlineColor + vacancyCountColor + vacancyFooterColor)
// Updated 2026-01-07: Social proof carousel (socialProofCarouselItems + carouselAutoPlay + carouselInterval) + Custom footer (footerText)
// Updated 2026-01-08: Subheadline font size (subheadlineFontSize)
export type WhatsAppPageRecord = Omit<WhatsAppPageInput, 'headerImageUrl' | 'pixelConfigId' | 'benefitCards' | 'emojiSize' | 'socialProofEnabled' | 'socialProofInterval' | 'buttonEvent' | 'vacancyFooter' | 'vacancyBackgroundColor' | 'vacancyHeadlineColor' | 'vacancyCountColor' | 'vacancyFooterColor' | 'footerText' | 'subheadlineFontSize'> & {
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
  // Vacancy Counter - added 2026-01-06
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string | null;
  vacancyBackgroundColor: string | null;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
  // Dynamic vacancy counter - added 2026-01-06
  vacancyDecrementInterval: number;
  vacancyHeadlineColor: string | null;
  vacancyCountColor: string | null;
  vacancyFooterColor: string | null;
  // Social Proof Carousel - added 2026-01-07
  socialProofCarouselItems: SocialProofItem[];
  carouselAutoPlay: boolean;
  carouselInterval: number;
  // Custom Footer - added 2026-01-07
  footerText: string | null;
  // Subheadline Font Size - added 2026-01-08
  subheadlineFontSize: EmojiSize;
  createdAt: string;
  updatedAt: string;
};

// Legacy type for migration from buttonEvent to events/redirectEvent and missing fields
type LegacyWhatsAppPageRecord = Omit<WhatsAppPageRecord, 'events' | 'redirectEvent' | 'benefitCards' | 'emojiSize' | 'socialProofEnabled' | 'socialProofInterval' | 'redirectEnabled' | 'buttonEvent' | 'vacancyCounterEnabled' | 'vacancyHeadline' | 'vacancyCount' | 'vacancyFooter' | 'vacancyBackgroundColor' | 'vacancyCountFontSize' | 'vacancyHeadlineFontSize' | 'vacancyFooterFontSize' | 'vacancyDecrementInterval' | 'vacancyHeadlineColor' | 'vacancyCountColor' | 'vacancyFooterColor' | 'socialProofCarouselItems' | 'carouselAutoPlay' | 'carouselInterval' | 'footerText' | 'subheadlineFontSize'> & {
  buttonEvent?: MetaEvent;
  events?: MetaEvent[];
  redirectEvent?: MetaEvent;
  benefitCards?: BenefitCard[];
  emojiSize?: EmojiSize;
  socialProofEnabled?: boolean;
  socialProofInterval?: number;
  redirectEnabled?: boolean;
  // Vacancy Counter - optional for backward compatibility
  vacancyCounterEnabled?: boolean;
  vacancyHeadline?: string;
  vacancyCount?: number;
  vacancyFooter?: string | null;
  vacancyBackgroundColor?: string | null;
  vacancyCountFontSize?: EmojiSize;
  vacancyHeadlineFontSize?: EmojiSize;
  vacancyFooterFontSize?: EmojiSize;
  // Dynamic vacancy counter - optional for backward compatibility
  vacancyDecrementInterval?: number;
  vacancyHeadlineColor?: string | null;
  vacancyCountColor?: string | null;
  vacancyFooterColor?: string | null;
  // Social Proof Carousel - optional for backward compatibility (2026-01-07)
  socialProofCarouselItems?: SocialProofItem[];
  carouselAutoPlay?: boolean;
  carouselInterval?: number;
  // Custom Footer - optional for backward compatibility (2026-01-07)
  footerText?: string | null;
  // Subheadline Font Size - optional for backward compatibility (2026-01-08)
  subheadlineFontSize?: EmojiSize;
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

  // Add default vacancy counter fields if missing (backward compatibility - 2026-01-06)
  migrated.vacancyCounterEnabled = record.vacancyCounterEnabled ?? false;
  migrated.vacancyHeadline = record.vacancyHeadline ?? "";
  migrated.vacancyCount = record.vacancyCount ?? 0;
  migrated.vacancyFooter = record.vacancyFooter ?? null;
  migrated.vacancyBackgroundColor = record.vacancyBackgroundColor ?? null;
  migrated.vacancyCountFontSize = record.vacancyCountFontSize ?? "large";
  migrated.vacancyHeadlineFontSize = record.vacancyHeadlineFontSize ?? "medium";
  migrated.vacancyFooterFontSize = record.vacancyFooterFontSize ?? "small";

  // Add default dynamic vacancy counter fields if missing (backward compatibility - 2026-01-06)
  migrated.vacancyDecrementInterval = record.vacancyDecrementInterval ?? 10;
  migrated.vacancyHeadlineColor = record.vacancyHeadlineColor ?? null;
  migrated.vacancyCountColor = record.vacancyCountColor ?? null;
  migrated.vacancyFooterColor = record.vacancyFooterColor ?? null;

  // Add default social proof carousel fields if missing (backward compatibility - 2026-01-07)
  migrated.socialProofCarouselItems = record.socialProofCarouselItems ?? [];
  migrated.carouselAutoPlay = record.carouselAutoPlay ?? false;
  migrated.carouselInterval = record.carouselInterval ?? 5;

  // Add default footerText if missing (backward compatibility - 2026-01-07)
  migrated.footerText = record.footerText ?? null;

  // Add default subheadlineFontSize if missing (backward compatibility - 2026-01-08)
  migrated.subheadlineFontSize = record.subheadlineFontSize ?? "medium";

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

  const keys = index.map((item) => whatsappPageKey(item.id));
  const records = await readValues<Record<string, LegacyWhatsAppPageRecord>>(keys);

  // Apply migration for legacy records (buttonEvent -> events/redirectEvent)
  return Object.values(records).filter(Boolean).map((record) => migrateRecord(record!));
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
    // Updated 2026-01-06: Vacancy counter
    vacancyCounterEnabled: parsed.vacancyCounterEnabled ?? existing?.vacancyCounterEnabled ?? false,
    vacancyHeadline: parsed.vacancyHeadline ?? existing?.vacancyHeadline ?? "",
    vacancyCount: parsed.vacancyCount ?? existing?.vacancyCount ?? 0,
    vacancyFooter: parsed.vacancyFooter ?? existing?.vacancyFooter ?? null,
    vacancyBackgroundColor: parsed.vacancyBackgroundColor ?? existing?.vacancyBackgroundColor ?? null,
    vacancyCountFontSize: parsed.vacancyCountFontSize ?? existing?.vacancyCountFontSize ?? "large",
    vacancyHeadlineFontSize: parsed.vacancyHeadlineFontSize ?? existing?.vacancyHeadlineFontSize ?? "medium",
    vacancyFooterFontSize: parsed.vacancyFooterFontSize ?? existing?.vacancyFooterFontSize ?? "small",
    // Dynamic vacancy counter
    vacancyDecrementInterval: parsed.vacancyDecrementInterval ?? existing?.vacancyDecrementInterval ?? 10,
    vacancyHeadlineColor: parsed.vacancyHeadlineColor ?? existing?.vacancyHeadlineColor ?? null,
    vacancyCountColor: parsed.vacancyCountColor ?? existing?.vacancyCountColor ?? null,
    vacancyFooterColor: parsed.vacancyFooterColor ?? existing?.vacancyFooterColor ?? null,
    // Updated 2026-01-07: Social proof carousel
    socialProofCarouselItems: parsed.socialProofCarouselItems ?? existing?.socialProofCarouselItems ?? [],
    carouselAutoPlay: parsed.carouselAutoPlay ?? existing?.carouselAutoPlay ?? false,
    carouselInterval: parsed.carouselInterval ?? existing?.carouselInterval ?? 5,
    // Updated 2026-01-07: Custom footer
    footerText: parsed.footerText ?? existing?.footerText ?? null,
    // Updated 2026-01-08: Subheadline font size
    subheadlineFontSize: parsed.subheadlineFontSize ?? existing?.subheadlineFontSize ?? "medium",
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
