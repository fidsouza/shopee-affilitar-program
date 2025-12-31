# Data Model: WhatsApp Redirect Page

**Feature Branch**: `003-whatsapp-redirect-page`
**Date**: 2025-12-30
**Updated**: 2025-12-31 (Multi-Event Support)

## Entity: WhatsAppPage

### Schema Definition

```typescript
interface WhatsAppPageRecord {
  // Identification
  id: string;                    // UUID v4
  slug: string;                  // URL-friendly identifier (auto-generated from headline)

  // Content
  headline: string;              // Main title displayed on page
  headerImageUrl?: string;       // Optional circular photo URL (HTTPS only)
  socialProofs: string[];        // Array of social proof texts (e.g., "+5.000 membros")
  buttonText: string;            // CTA button text (e.g., "Entrar no Grupo VIP")

  // Destination
  whatsappUrl: string;           // WhatsApp group URL (chat.whatsapp.com/* or wa.me/*)

  // Tracking (Updated 2025-12-31)
  pixelConfigId?: string;        // Reference to PixelRecord.id (optional)
  events: MetaEvent[];           // Events fired on page load (min 1 required)
  redirectEvent: MetaEvent;      // Event fired BEFORE redirect (click or auto)

  // Behavior
  redirectDelay: number;         // Seconds before auto-redirect (default: 5)

  // State
  status: "active" | "inactive"; // Page visibility status

  // Timestamps
  createdAt: string;             // ISO 8601 timestamp
  updatedAt: string;             // ISO 8601 timestamp
}
```

### Event Firing Behavior (New 2025-12-31)

```
Page Load:
┌─────────────────────────────────────────────────────────────┐
│  1. Server-side: Fire all events[] via Conversion API       │
│  2. Client-side: Load fbq, fire PageView, then all events[] │
└─────────────────────────────────────────────────────────────┘

Before Redirect (click OR auto-countdown):
┌─────────────────────────────────────────────────────────────┐
│  1. Client-side: Fire redirectEvent via fbq                 │
│  2. Server-side: Fire redirectEvent via Conversion API      │
│  3. Wait for tracking to complete                            │
│  4. Redirect to whatsappUrl                                  │
└─────────────────────────────────────────────────────────────┘

Deduplication:
- events[] fired once per page load (useRef flag)
- redirectEvent fired once per session (useRef flag)
- If user clicks AND countdown ends, only first fires
```

### Index Entry

```typescript
interface WhatsAppPageIndexEntry {
  id: string;
  slug: string;
  headline: string;
  status: "active" | "inactive";
}
```

### Storage Keys

| Key Pattern | Content | Example |
|-------------|---------|---------|
| `whatsapp_pages_index` | Array of WhatsAppPageIndexEntry | `[{id, slug, headline, status}, ...]` |
| `whatsapp_pages_<id>` | Single WhatsAppPageRecord | `{id: "abc123", slug: "grupo-vip", ...}` |

## Validation Rules

### Field Constraints

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| id | string | Auto | UUID v4 format |
| slug | string | Auto | Lowercase, alphanumeric + hyphens, unique |
| headline | string | Yes | 1-200 characters, non-empty |
| headerImageUrl | string | No | Valid HTTPS URL if provided |
| socialProofs | string[] | Yes | Array of non-empty strings (can be empty array) |
| buttonText | string | Yes | 1-100 characters, non-empty |
| whatsappUrl | string | Yes | HTTPS, must match allowed hosts |
| pixelConfigId | string | No | Valid UUID if provided |
| events | MetaEvent[] | Yes | Min 1 event, deduplicated, valid Meta events |
| redirectEvent | MetaEvent | Yes | Must be valid Meta event |
| redirectDelay | number | No | 1-30 seconds, default: 5 |
| status | enum | Yes | "active" or "inactive" |
| createdAt | string | Auto | ISO 8601 timestamp |
| updatedAt | string | Auto | ISO 8601 timestamp |

### WhatsApp URL Validation

```typescript
const ALLOWED_WHATSAPP_HOSTS = [
  "chat.whatsapp.com",
  "wa.me"
];

function isAllowedWhatsAppHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_WHATSAPP_HOSTS.some(host =>
      parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}
```

### Header Image URL Validation

```typescript
function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
```

## Zod Schema (Updated 2025-12-31)

```typescript
import { z } from "zod";
import { META_EVENTS, type MetaEvent } from "@/lib/meta-events";

const metaEventEnum = z.enum(META_EVENTS as [MetaEvent, ...MetaEvent[]], {
  errorMap: () => ({ message: "Selecione um evento Meta válido" })
});

export const whatsAppPageSchema = z.object({
  headline: z.string().min(1, "Headline é obrigatório").max(200),
  headerImageUrl: z.string().url().startsWith("https://").optional().or(z.literal("")),
  socialProofs: z.array(z.string()).default([]),
  buttonText: z.string().min(1, "Texto do botão é obrigatório").max(100),
  whatsappUrl: z.string()
    .url("URL inválida")
    .refine(isAllowedWhatsAppHost, {
      message: "URL deve ser do WhatsApp (chat.whatsapp.com ou wa.me)"
    }),
  pixelConfigId: z.string().uuid().optional().or(z.literal("")),
  // NEW: Multiple events for page load
  events: z.array(metaEventEnum)
    .min(1, "Selecione pelo menos 1 evento")
    .transform((events) => [...new Set(events)]), // Deduplicate
  // NEW: Single event for redirect
  redirectEvent: metaEventEnum,
  redirectDelay: z.number().int().min(1).max(30).default(5),
  status: z.enum(["active", "inactive"])
});

export type WhatsAppPageInput = z.infer<typeof whatsAppPageSchema>;
```

### Migration from `buttonEvent` to `events` + `redirectEvent`

For existing records with `buttonEvent`:
```typescript
// Migration logic (in repository layer)
function migrateRecord(record: OldWhatsAppPageRecord): WhatsAppPageRecord {
  return {
    ...record,
    events: [record.buttonEvent], // Old buttonEvent becomes single event in array
    redirectEvent: record.buttonEvent, // Same event for redirect
    // Remove buttonEvent field
  };
}
```

## State Transitions

```
┌─────────────┐
│   Created   │
│  (active)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   Active    │◄───►│  Inactive   │
│ (accessible)│     │  (404)      │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────────────────────────┐
│            Deleted              │
│    (removed from storage)       │
└─────────────────────────────────┘
```

### Transition Rules

| From | To | Trigger | Validation |
|------|----|---------|------------|
| - | Active | Create with status=active | All required fields valid |
| - | Inactive | Create with status=inactive | All required fields valid |
| Active | Inactive | Update status | None |
| Inactive | Active | Update status | None |
| Any | Deleted | Delete action | None (idempotent) |

## Relationships

```
┌──────────────────┐         ┌──────────────────┐
│  WhatsAppPage    │         │   PixelRecord    │
├──────────────────┤         ├──────────────────┤
│ id               │         │ id               │
│ pixelConfigId ───┼────────►│ pixelId          │
│ buttonEvent      │         │ label            │
│ ...              │         │ ...              │
└──────────────────┘         └──────────────────┘
        │
        │ 0..1 (optional)
        │
        ▼
   Pixel may not exist
   (page works without tracking)
```

## Sample Data

### Active Page with Pixel (Updated 2025-12-31)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "grupo-ofertas-vip",
  "headline": "Entre no Grupo VIP de Ofertas!",
  "headerImageUrl": "https://example.com/foto-criadora.jpg",
  "socialProofs": [
    "+5.000 membros",
    "⭐ 4.9 de avaliação",
    "🔥 Ofertas exclusivas diárias"
  ],
  "buttonText": "Entrar no Grupo VIP",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123xyz",
  "pixelConfigId": "123e4567-e89b-12d3-a456-426614174000",
  "events": ["ViewContent", "Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active",
  "createdAt": "2025-12-30T10:00:00.000Z",
  "updatedAt": "2025-12-31T14:00:00.000Z"
}
```

### Minimal Page (No Pixel, No Image)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "slug": "grupo-teste",
  "headline": "Grupo de Teste",
  "socialProofs": [],
  "buttonText": "Entrar",
  "whatsappUrl": "https://wa.me/message/XYZ789",
  "events": ["Lead"],
  "redirectEvent": "Lead",
  "redirectDelay": 3,
  "status": "inactive",
  "createdAt": "2025-12-30T11:00:00.000Z",
  "updatedAt": "2025-12-31T14:00:00.000Z"
}
```
