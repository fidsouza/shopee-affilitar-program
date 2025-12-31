import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DEBUG endpoint to inspect raw Edge Config data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    // List all whatsapp pages index
    const index = await get<unknown>('whatsapp_pages_index');
    return NextResponse.json({
      key: 'whatsapp_pages_index',
      raw: index,
      type: typeof index,
      isArray: Array.isArray(index),
    });
  }

  // Get specific page by key
  const raw = await get<unknown>(key);
  return NextResponse.json({
    key,
    raw,
    type: typeof raw,
    keys: raw && typeof raw === 'object' ? Object.keys(raw) : null,
    hasHeaderImageUrl: raw && typeof raw === 'object' ? 'headerImageUrl' in raw : false,
    headerImageUrl: raw && typeof raw === 'object' ? (raw as Record<string, unknown>).headerImageUrl : undefined,
  });
}
