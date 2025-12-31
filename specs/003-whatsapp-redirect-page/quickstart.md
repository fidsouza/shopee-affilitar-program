# Quickstart: WhatsApp Redirect Page

**Feature Branch**: `003-whatsapp-redirect-page`
**Date**: 2025-12-30
**Updated**: 2025-12-31 (Multi-Event Support)

## Overview

Este guia descreve como implementar a feature de páginas de redirecionamento WhatsApp seguindo os padrões existentes do projeto.

## Implementation Order

```
1. Repository (lib/repos/whatsapp-pages.ts)
   ↓
2. Validation (lib/validation.ts - add schema)
   ↓
3. API Routes (app/api/whatsapp/)
   ↓
4. Admin Page (app/admin/whatsapp/page.tsx)
   ↓
5. Admin Nav (app/admin/layout.tsx - add link)
   ↓
6. Redirect Page (app/w/[slug]/)
   ↓
7. Testing & Polish
```

## Step 1: Repository

**File**: `frontend/src/lib/repos/whatsapp-pages.ts`

**Reference**: Copy structure from `lib/repos/products.ts`

```typescript
"use server";

import { readValue, readValues, upsertItems } from "@/lib/edge-config";
import { generateUUID } from "@/lib/uuid";
import { logInfo, logError } from "@/lib/logging";

// Types
export interface WhatsAppPageRecord { ... }
interface WhatsAppPageIndexEntry { ... }

// Storage keys
const INDEX_KEY = "whatsapp_pages_index";
const recordKey = (id: string) => `whatsapp_pages_${id}`;

// Methods to implement:
// - listWhatsAppPages()
// - getWhatsAppPageBySlug(slug: string)
// - upsertWhatsAppPage(input: WhatsAppPageInput)
// - deleteWhatsAppPage(input: { pageId: string })
```

**Key Patterns**:
- Use `"use server"` directive
- Generate slug from headline (slugify function)
- Handle slug collisions with counter suffix
- Two-level storage (index + records)

## Step 2: Validation Schema

**File**: `frontend/src/lib/validation.ts`

**Add** to existing file:

```typescript
// WhatsApp URL hosts
const ALLOWED_WHATSAPP_HOSTS = ["chat.whatsapp.com", "wa.me"];

function isAllowedWhatsAppHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_WHATSAPP_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

// Updated 2025-12-31: Multi-event support
const metaEventEnum = z.enum(META_EVENTS as [MetaEvent, ...MetaEvent[]]);

export const whatsAppPageSchema = z.object({
  headline: z.string().min(1).max(200),
  headerImageUrl: z.string().url().startsWith("https://").optional().or(z.literal("")),
  socialProofs: z.array(z.string()).default([]),
  buttonText: z.string().min(1).max(100),
  whatsappUrl: z.string().url().refine(isAllowedWhatsAppHost, {
    message: "URL deve ser do WhatsApp (chat.whatsapp.com ou wa.me)",
  }),
  pixelConfigId: z.string().uuid().optional().or(z.literal("")),
  // NEW: Multiple events for page load
  events: z.array(metaEventEnum)
    .min(1, "Selecione pelo menos 1 evento")
    .transform((events) => [...new Set(events)]), // Deduplicate
  // NEW: Single event for redirect
  redirectEvent: metaEventEnum,
  redirectDelay: z.number().int().min(1).max(30).default(5),
  status: z.enum(["active", "inactive"]),
});

export const deleteWhatsAppPageSchema = z.object({
  pageId: z.string().uuid(),
});
```

## Step 3: API Routes

### GET + POST Route

**File**: `frontend/src/app/api/whatsapp/route.ts`

```typescript
import { NextResponse } from "next/server";
import { listWhatsAppPages, upsertWhatsAppPage } from "@/lib/repos/whatsapp-pages";
import { whatsAppPageSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pages = await listWhatsAppPages();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load pages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = whatsAppPageSchema.parse(body);
    const page = await upsertWhatsAppPage(validated);
    return NextResponse.json(page);
  } catch (error) {
    // Handle Zod errors and return 400
  }
}
```

### DELETE Route

**File**: `frontend/src/app/api/whatsapp/[id]/route.ts`

```typescript
import { NextResponse } from "next/server";
import { deleteWhatsAppPage } from "@/lib/repos/whatsapp-pages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteWhatsAppPage({ pageId: id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
```

## Step 4: Admin Page

**File**: `frontend/src/app/admin/whatsapp/page.tsx`

**Reference**: Copy structure from `app/admin/products/page.tsx`

**Key Components**:
- Form with all fields (headline, imageUrl, socialProofs, buttonText, whatsappUrl, etc.)
- Pixel selector dropdown (fetch from /api/pixels)
- **NEW**: Checkboxes for multiple events (events[])
- **NEW**: Dropdown for redirect event (redirectEvent)
- Status radio buttons
- List of existing pages with edit/delete actions
- Copy link button for `/w/[slug]`

**Events UI (Updated 2025-12-31)**:
```tsx
// Checkboxes for page load events
<div className="space-y-2">
  <label className="block text-sm font-medium">Eventos ao Carregar (mín. 1)</label>
  {META_EVENTS.map((event) => (
    <label key={event} className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={events.includes(event)}
        onChange={(e) => {
          if (e.target.checked) {
            setEvents([...events, event]);
          } else {
            setEvents(events.filter((e) => e !== event));
          }
        }}
      />
      {event}
    </label>
  ))}
</div>

// Dropdown for redirect event
<div>
  <label className="block text-sm font-medium">Evento de Redirecionamento</label>
  <select
    value={redirectEvent}
    onChange={(e) => setRedirectEvent(e.target.value as MetaEvent)}
  >
    {META_EVENTS.map((event) => (
      <option key={event} value={event}>{event}</option>
    ))}
  </select>
</div>
```

**Social Proofs UI**:
```tsx
// Simple textarea, one line per proof
<textarea
  value={socialProofs.join("\n")}
  onChange={(e) => setSocialProofs(e.target.value.split("\n").filter(Boolean))}
  placeholder="Uma prova social por linha..."
/>
```

## Step 5: Admin Navigation

**File**: `frontend/src/app/admin/layout.tsx`

**Add** to navigation items:

```typescript
import { MessageCircle } from "lucide-react";

const navItems = [
  { name: "Cadastrar Produto", href: "/admin/products", icon: Package },
  { name: "Cadastrar Pixel", href: "/admin/pixels", icon: Crosshair },
  { name: "Páginas WhatsApp", href: "/admin/whatsapp", icon: MessageCircle }, // NEW
];
```

## Step 6: Redirect Page

### Server Component

**File**: `frontend/src/app/w/[slug]/page.tsx`

```typescript
import { notFound } from "next/navigation";
import { getWhatsAppPageBySlug } from "@/lib/repos/whatsapp-pages";
import { getPixelById } from "@/lib/repos/pixels";
import { sendConversionEvent, generateEventId } from "@/lib/conversion-api";
import { WhatsAppRedirectClient } from "./client";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function WhatsAppRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getWhatsAppPageBySlug(slug);

  if (!page || page.status !== "active") {
    notFound();
  }

  const pixel = page.pixelConfigId
    ? await getPixelById(page.pixelConfigId)
    : null;

  const eventId = generateEventId();
  const redirectEventId = generateEventId(); // Separate ID for redirect event
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  // Fire server-side events for page load (best-effort)
  // Updated 2025-12-31: Fire ALL events in events[] array
  if (pixel && page.events.length > 0) {
    try {
      await Promise.all(
        page.events.map((eventName) =>
          sendConversionEvent({
            pixelId: pixel.pixelId,
            eventName,
            eventId, // Same eventId for deduplication
            eventSourceUrl: `${baseUrl}/w/${slug}`,
          })
        )
      );
    } catch (e) {
      // Log but don't block
    }
  }

  return (
    <WhatsAppRedirectClient
      page={page}
      pixelId={pixel?.pixelId}
      eventId={eventId}
      redirectEventId={redirectEventId} // Pass redirect event ID
    />
  );
}
```

### Client Component (Updated 2025-12-31)

**File**: `frontend/src/app/w/[slug]/client.tsx`

```typescript
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import type { WhatsAppPageRecord } from "@/lib/repos/whatsapp-pages";

interface Props {
  page: WhatsAppPageRecord;
  pixelId?: string;
  eventId: string;
  redirectEventId: string; // NEW: Separate ID for redirect event
}

export function WhatsAppRedirectClient({
  page,
  pixelId,
  eventId,
  redirectEventId
}: Props) {
  const [countdown, setCountdown] = useState(page.redirectDelay);
  const hasTrackedPageEvents = useRef(false); // NEW: Track page load events
  const hasTrackedRedirect = useRef(false); // NEW: Track redirect event

  // Initialize fbq and fire page load events
  useEffect(() => {
    if (!pixelId || typeof window === "undefined") return;
    if (hasTrackedPageEvents.current) return;
    hasTrackedPageEvents.current = true;

    // Load Meta Pixel SDK dynamically
    // ... (existing SDK loading code)

    // Fire PageView first (required for Meta Pixel Helper)
    window.fbq("track", "PageView");

    // Fire all page load events
    page.events.forEach((eventName) => {
      window.fbq("track", eventName, {}, { eventID: eventId });
    });
  }, [pixelId, page.events, eventId]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = async () => {
    // Deduplication: only fire redirect event once
    if (hasTrackedRedirect.current) return;
    hasTrackedRedirect.current = true;

    // Fire client-side redirect event
    if (pixelId && typeof window !== "undefined" && window.fbq) {
      window.fbq("track", page.redirectEvent, {}, { eventID: redirectEventId });
    }

    // Fire server-side redirect event via API
    // (Optional: call /api/whatsapp/track-redirect endpoint)
    try {
      await fetch("/api/whatsapp/track-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: page.id,
          eventName: page.redirectEvent,
          eventId: redirectEventId,
        }),
      });
    } catch (e) {
      // Best-effort, don't block redirect
    }

    // Redirect after short delay to ensure events fire
    setTimeout(() => {
      window.location.href = page.whatsappUrl;
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {page.headerImageUrl && (
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
          <Image
            src={page.headerImageUrl}
            alt=""
            width={96}
            height={96}
            className="object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-4">{page.headline}</h1>

      {page.socialProofs.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {page.socialProofs.map((proof, i) => (
            <span key={i} className="text-gray-600 text-center">
              {proof}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={handleRedirect}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
      >
        {page.buttonText}
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Redirecionando em {countdown} segundos...
      </p>
    </div>
  );
}
```

## Step 7: Testing Checklist (Updated 2025-12-31)

### Basic Functionality
- [ ] Create WhatsApp page via admin
- [ ] Verify slug is generated correctly
- [ ] Test URL validation (only WhatsApp URLs accepted)
- [ ] Test image URL validation (HTTPS only)
- [ ] Access `/w/[slug]` and verify content renders
- [ ] Verify countdown timer works
- [ ] Verify button click redirects immediately
- [ ] Verify auto-redirect after countdown

### Multi-Event Testing (NEW)
- [ ] Select multiple events in admin form
- [ ] Verify all selected events appear in saved record
- [ ] Select different redirectEvent from events list
- [ ] Verify events[] fire on page load (check Meta Events Manager)
- [ ] Verify redirectEvent fires BEFORE redirect (check Meta Events Manager)
- [ ] Test deduplication: click button multiple times rapidly
- [ ] Test deduplication: click button just as countdown ends
- [ ] Verify redirect event fires only once per session

### Pixel Integration
- [ ] Test with Pixel Config associated (check events in Meta Events Manager)
- [ ] Test without Pixel Config (should work without tracking)
- [ ] Verify server-side events fire (check Conversion API logs)
- [ ] Verify client-side events fire (use Meta Pixel Helper extension)

### Admin Operations
- [ ] Test inactive page returns 404
- [ ] Test edit existing page
- [ ] Test delete page
- [ ] Test copy link functionality

## Environment Variables

Ensure these are set:

```env
EDGE_CONFIG=...
EDGE_CONFIG_REST_API_URL=...
EDGE_CONFIG_REST_TOKEN=...
FB_PIXEL_API_TOKEN=...
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Common Issues

1. **Slug collision**: Add counter suffix automatically
2. **Image not loading**: Verify HTTPS URL and CORS
3. **Event not firing**: Check FB_PIXEL_API_TOKEN and pixel ID
4. **404 on active page**: Clear Edge Config cache
