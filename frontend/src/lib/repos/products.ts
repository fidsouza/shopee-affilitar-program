'use server';

import type { MetaEvent } from "@/lib/meta-events";
import { readValue, readValues, upsertItems } from "@/lib/edge-config";
import {
  deleteProductSchema,
  productLinkSchema,
  type DeleteProductInput,
  type ProductLinkInput,
} from "@/lib/validation";
import { uuidv4 } from "@/lib/uuid";

export type ProductRecord = ProductLinkInput & {
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type ProductIndexEntry = {
  id: string;
  slug: string;
  title: string;
  status: 'active' | 'inactive';
  pixelConfigId: string;
  events: MetaEvent[];
};

const PRODUCT_INDEX_KEY = "products_index";
const productKey = (id: string) => `products_${id}`;

async function getIndex(): Promise<ProductIndexEntry[]> {
  const index = await readValue<ProductIndexEntry[]>(PRODUCT_INDEX_KEY);
  return index ?? [];
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `link-${Math.random().toString(36).slice(2, 6)}`;
}

function uniqueSlug(base: string, index: ProductIndexEntry[], currentId?: string): string {
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

export async function listProducts(): Promise<ProductRecord[]> {
  const index = await getIndex();
  if (index.length === 0) return [];

  const keys = index.map((item) => productKey(item.id));
  const records = await readValues<Record<string, ProductRecord>>(keys);

  return Object.values(records).filter(Boolean) as ProductRecord[];
}

export async function upsertProduct(input: ProductLinkInput): Promise<ProductRecord> {
  const parsed = productLinkSchema.parse(input);
  const now = new Date().toISOString();
  const id = parsed.id ?? uuidv4();

  const index = await getIndex();
  const existing = await readValue<ProductRecord>(productKey(id));

  const baseSlug = slugifyTitle(parsed.title);
  const slug = existing?.slug ?? uniqueSlug(baseSlug, index, id);

  const record: ProductRecord = {
    id,
    slug,
    title: parsed.title,
    affiliateUrl: parsed.affiliateUrl,
    pixelConfigId: parsed.pixelConfigId,
    events: parsed.events,
    status: parsed.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const newIndex: ProductIndexEntry[] = [
    ...index.filter((p) => p.id !== id),
    {
      id,
      slug,
      title: record.title,
      status: record.status,
      pixelConfigId: record.pixelConfigId,
      events: record.events,
    },
  ];

  await upsertItems([
    { key: productKey(id), value: record },
    { key: PRODUCT_INDEX_KEY, value: newIndex },
  ]);

  return record;
}

export async function getProductBySlug(slug: string): Promise<ProductRecord | null> {
  const index = await getIndex();
  const entry = index.find((item) => item.slug === slug);
  if (!entry) return null;
  const record = await readValue<ProductRecord>(productKey(entry.id));
  return record ?? null;
}

export async function deleteProduct(input: DeleteProductInput): Promise<void> {
  const { productId } = deleteProductSchema.parse(input);
  const index = await getIndex();
  const remaining = index.filter((item) => item.id !== productId);

  // If not found, treat as idempotent success.
  if (remaining.length === index.length) return;

  await upsertItems([
    { key: productKey(productId), operation: "delete" },
    { key: PRODUCT_INDEX_KEY, value: remaining },
  ]);
}
