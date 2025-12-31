import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';

import { getWhatsAppPageBySlug, listWhatsAppPages } from '@/lib/repos/whatsapp-pages';
import { readValue } from '@/lib/edge-config';
import type { PixelRecord } from '@/lib/repos/pixels';
import { sendConversionEvent } from '@/lib/conversion-api';
import { logError, logInfo } from '@/lib/logging';
import { META_STANDARD_EVENTS } from '@/lib/meta-events';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const trackRedirectSchema = z.object({
  pageId: z.string().uuid(),
  eventName: z.enum(META_STANDARD_EVENTS),
  eventId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageId, eventName, eventId } = trackRedirectSchema.parse(body);

    // Find page by ID
    const pages = await listWhatsAppPages();
    const page = pages.find((p) => p.id === pageId);

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 },
      );
    }

    // Get pixel if configured
    if (!page.pixelConfigId) {
      logInfo("track-redirect: no pixel configured", { pageId });
      return NextResponse.json({ success: true, tracked: false });
    }

    const pixel = await readValue<PixelRecord>(`pixels_${page.pixelConfigId}`);
    if (!pixel) {
      logError("track-redirect: pixel not found", {
        pageId,
        pixelConfigId: page.pixelConfigId,
      });
      return NextResponse.json({ success: true, tracked: false });
    }

    // Build source URL
    const hdrs = await headers();
    const proto = hdrs.get("x-forwarded-proto") ?? "https";
    const host = hdrs.get("host") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const sourceUrl = `${proto}://${host}/w/${page.slug}`;

    // Fire Conversion API for redirect event
    await sendConversionEvent({
      pixelId: pixel.pixelId,
      eventName,
      eventId,
      eventSourceUrl: sourceUrl,
    });

    logInfo("track-redirect: event sent", {
      pageId,
      eventName,
      eventId,
      pixelId: pixel.pixelId,
    });

    return NextResponse.json({ success: true, tracked: true });
  } catch (error) {
    logError("track-redirect: failed", { error: String(error) });
    return NextResponse.json(
      { error: 'Failed to track redirect event', details: String(error) },
      { status: 400 },
    );
  }
}
