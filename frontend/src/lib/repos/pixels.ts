'use server';

import { META_STANDARD_EVENTS, type MetaEvent } from "@/lib/meta-events";
import { readValue, readValues, upsertItems } from "@/lib/edge-config";
import {
  deletePixelSchema,
  pixelConfigSchema,
  type DeletePixelInput,
  type PixelConfigInput,
} from "@/lib/validation";
import { uuidv4 } from "@/lib/uuid";

export type PixelRecord = PixelConfigInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

type PixelIndexEntry = {
  id: string;
  label: string;
  pixelId: string;
  defaultEvents?: MetaEvent[];
  isDefault?: boolean;
};

const PIXEL_INDEX_KEY = "pixels_index";
const pixelKey = (id: string) => `pixels_${id}`;

async function getIndex(): Promise<PixelIndexEntry[]> {
  const index = await readValue<PixelIndexEntry[]>(PIXEL_INDEX_KEY);
  return index ?? [];
}

function normalizeDefaultFlag(index: PixelIndexEntry[], targetId: string, makeDefault: boolean) {
  if (!makeDefault) return index;
  return index.map((entry) =>
    entry.id === targetId ? { ...entry, isDefault: true } : { ...entry, isDefault: false },
  );
}

function ensureDefault(index: PixelIndexEntry[]): PixelIndexEntry[] {
  const hasDefault = index.some((p) => p.isDefault);
  if (hasDefault || index.length === 0) return index;
  // If no default set, mark first as default for convenience.
  const [first, ...rest] = index;
  return [{ ...first, isDefault: true }, ...rest];
}

export async function listPixels(): Promise<PixelRecord[]> {
  const index = await getIndex();
  if (index.length === 0) return [];

  const keys = index.map((p) => pixelKey(p.id));
  const records = await readValues<Record<string, PixelRecord>>(keys);

  return Object.values(records).filter(Boolean) as PixelRecord[];
}

export async function upsertPixel(input: PixelConfigInput): Promise<PixelRecord> {
  const parsed = pixelConfigSchema.parse(input);
  const now = new Date().toISOString();
  const id = parsed.id ?? uuidv4();

  const index = await getIndex();
  const existing = await readValue<PixelRecord>(pixelKey(id));

  const record: PixelRecord = {
    id,
    label: parsed.label,
    pixelId: parsed.pixelId,
    isDefault: parsed.isDefault ?? false,
    defaultEvents: parsed.defaultEvents ?? META_STANDARD_EVENTS.slice(0, 1),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const updatedIndex = normalizeDefaultFlag(
    [
      // keep others, replace or add this
      ...index.filter((p) => p.id !== id),
      {
        id,
        label: record.label,
        pixelId: record.pixelId,
        defaultEvents: record.defaultEvents,
        isDefault: record.isDefault,
      },
    ],
    id,
    record.isDefault,
  );

  const finalIndex = ensureDefault(updatedIndex);

  await upsertItems([
    { key: pixelKey(id), value: record },
    { key: PIXEL_INDEX_KEY, value: finalIndex },
  ]);

  return record;
}

export async function getDefaultPixel(): Promise<PixelRecord | null> {
  const index = await getIndex();
  const defaultEntry =
    index.find((p) => p.isDefault) ?? (index.length > 0 ? ensureDefault(index)[0] : null);
  if (!defaultEntry) return null;
  return readValue<PixelRecord>(pixelKey(defaultEntry.id));
}

export async function deletePixel(input: DeletePixelInput): Promise<void> {
  const { pixelId } = deletePixelSchema.parse(input);
  const index = await getIndex();
  const remaining = index.filter((entry) => entry.id !== pixelId);

  if (remaining.length === index.length) return;

  const finalIndex = ensureDefault(remaining);

  await upsertItems([
    { key: pixelKey(pixelId), operation: "delete" },
    { key: PIXEL_INDEX_KEY, value: finalIndex },
  ]);
}
