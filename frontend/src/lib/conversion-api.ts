import type { MetaEvent } from "@/lib/meta-events";
import { logError, logInfo } from "@/lib/logging";
import { uuidv4 } from "@/lib/uuid";

const FB_TOKEN = process.env.FB_PIXEL_API_TOKEN;
const FB_API_VERSION = "v18.0";

type SendEventInput = {
  pixelId: string;
  eventName: MetaEvent;
  eventId: string;
  eventSourceUrl: string;
};

export async function sendConversionEvent({
  pixelId,
  eventName,
  eventId,
  eventSourceUrl,
}: SendEventInput) {
  if (!FB_TOKEN) {
    logInfo("FB_PIXEL_API_TOKEN missing, skipping CAPI send", { eventName, pixelId });
    return { skipped: true };
  }
  const url = `https://graph.facebook.com/${FB_API_VERSION}/${pixelId}/events`;
  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: eventSourceUrl,
        event_id: eventId,
      },
    ],
    access_token: FB_TOKEN,
    test_event_code: process.env.FB_TEST_EVENT_CODE,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    logError("CAPI send failed", { status: response.status, body: text, eventName, pixelId });
    throw new Error(`CAPI send failed: ${response.status}`);
  }

  logInfo("CAPI send ok", { eventName, pixelId, eventId });
  return { ok: true };
}

export function generateEventId() {
  return uuidv4();
}
