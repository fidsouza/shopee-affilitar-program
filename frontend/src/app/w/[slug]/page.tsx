import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { WhatsAppRedirectClient } from "./client";
import { getWhatsAppPageBySlug } from "@/lib/repos/whatsapp-pages";
import { readValue } from "@/lib/edge-config";
import type { PixelRecord } from "@/lib/repos/pixels";
import { generateEventId, sendConversionEvent } from "@/lib/conversion-api";
import { logError, logInfo } from "@/lib/logging";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function WhatsAppRedirectPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await getWhatsAppPageBySlug(slug);
  if (!page) {
    notFound();
  }

  if (page.status === "inactive") {
    notFound();
  }

  // Get pixel if configured
  let pixel: PixelRecord | null = null;
  if (page.pixelConfigId) {
    pixel = await readValue<PixelRecord>(`pixels_${page.pixelConfigId}`);
    if (!pixel) {
      logError("Pixel não encontrado para página WhatsApp", {
        pageId: page.id,
        pixelId: page.pixelConfigId
      });
    }
  }

  // Updated 2025-12-31: Multi-event support
  const eventId = generateEventId();
  const redirectEventId = generateEventId(); // Separate ID for redirect event
  const hdrs = await headers();
  const proto = hdrs.get("x-forwarded-proto") ?? "https";
  const host = hdrs.get("host") ?? process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const sourceUrl = `${proto}://${host}/w/${page.slug}`;

  // Fire Conversion API server-side for ALL events[] (best effort) if pixel exists
  if (pixel && page.events.length > 0) {
    try {
      await Promise.all(
        page.events.map((eventName) =>
          sendConversionEvent({
            pixelId: pixel.pixelId,
            eventName,
            eventId,
            eventSourceUrl: sourceUrl,
          })
        )
      );
    } catch (err) {
      logError("CAPI send failed for WhatsApp page events", {
        error: String(err),
        events: page.events,
        pageId: page.id
      });
    }
  }

  logInfo("WhatsApp page render", {
    slug: page.slug,
    events: page.events,
    redirectEvent: page.redirectEvent,
    pixelId: pixel?.pixelId,
    hasPixel: !!pixel,
    // DEBUG: headerImageUrl tracking
    hasHeaderImageUrl: "headerImageUrl" in page,
    headerImageUrl: page.headerImageUrl ?? "NOT_SET",
    pageKeys: Object.keys(page),
  });

  return (
    <WhatsAppRedirectClient
      page={page}
      pixelId={pixel?.pixelId}
      eventId={eventId}
      redirectEventId={redirectEventId}
    />
  );
}
