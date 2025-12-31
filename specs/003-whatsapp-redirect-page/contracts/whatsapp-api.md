# API Contract: WhatsApp Pages

**Feature Branch**: `003-whatsapp-redirect-page`
**Base Path**: `/api/whatsapp`
**Updated**: 2025-12-31 (Multi-Event Support)

## Endpoints Overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/whatsapp` | List all WhatsApp pages |
| POST | `/api/whatsapp` | Create or update a WhatsApp page |
| DELETE | `/api/whatsapp/[id]` | Delete a WhatsApp page |

---

## GET /api/whatsapp

List all WhatsApp pages.

### Request

```http
GET /api/whatsapp HTTP/1.1
Host: {base_url}
```

### Response

**Success (200 OK)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "slug": "grupo-ofertas-vip",
    "headline": "Entre no Grupo VIP de Ofertas!",
    "headerImageUrl": "https://example.com/foto.jpg",
    "socialProofs": ["+5.000 membros", "⭐ 4.9"],
    "buttonText": "Entrar no Grupo VIP",
    "whatsappUrl": "https://chat.whatsapp.com/ABC123",
    "pixelConfigId": "123e4567-e89b-12d3-a456-426614174000",
    "events": ["ViewContent", "Lead"],
    "redirectEvent": "CompleteRegistration",
    "redirectDelay": 5,
    "status": "active",
    "createdAt": "2025-12-30T10:00:00.000Z",
    "updatedAt": "2025-12-31T14:00:00.000Z"
  }
]
```

**Error (500 Internal Server Error)**

```json
{
  "error": "Failed to load WhatsApp pages"
}
```

---

## POST /api/whatsapp

Create a new WhatsApp page or update an existing one.

### Request

```http
POST /api/whatsapp HTTP/1.1
Host: {base_url}
Content-Type: application/json

{
  "headline": "Entre no Grupo VIP de Ofertas!",
  "headerImageUrl": "https://example.com/foto.jpg",
  "socialProofs": ["+5.000 membros", "⭐ 4.9 de avaliação"],
  "buttonText": "Entrar no Grupo VIP",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123xyz",
  "pixelConfigId": "123e4567-e89b-12d3-a456-426614174000",
  "events": ["ViewContent", "Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active"
}
```

### Request Body Schema (Updated 2025-12-31)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | No | UUID for update (omit for create) |
| headline | string | Yes | Main title (1-200 chars) |
| headerImageUrl | string | No | HTTPS URL for circular image |
| socialProofs | string[] | Yes | Array of social proof texts |
| buttonText | string | Yes | CTA button text (1-100 chars) |
| whatsappUrl | string | Yes | WhatsApp URL (chat.whatsapp.com/* or wa.me/*) |
| pixelConfigId | string | No | UUID of associated Pixel Config |
| events | MetaEvent[] | Yes | Events to fire on page load (min 1) |
| redirectEvent | MetaEvent | Yes | Event to fire before redirect |
| redirectDelay | number | No | Seconds before redirect (default: 5) |
| status | string | Yes | "active" or "inactive" |

### Response

**Success (200 OK)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "entre-no-grupo-vip-de-ofertas",
  "headline": "Entre no Grupo VIP de Ofertas!",
  "headerImageUrl": "https://example.com/foto.jpg",
  "socialProofs": ["+5.000 membros", "⭐ 4.9 de avaliação"],
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

**Validation Error (400 Bad Request)**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["whatsappUrl"],
      "message": "URL deve ser do WhatsApp (chat.whatsapp.com ou wa.me)"
    }
  ]
}
```

---

## DELETE /api/whatsapp/[id]

Delete a WhatsApp page by ID.

### Request

```http
DELETE /api/whatsapp/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: {base_url}
```

### Response

**Success (204 No Content)**

No body returned.

**Error (400 Bad Request)**

```json
{
  "error": "Invalid page ID"
}
```

---

## Public Route: /w/[slug]

This is a page route, not an API endpoint.

### Behavior

1. **GET /w/{slug}** - Renders the WhatsApp redirect page
   - If page exists and is active: Render page with tracking
   - If page exists and is inactive: Return 404
   - If page does not exist: Return 404

### Server-Side Actions (Updated 2025-12-31)

When page loads (server component):
1. Fetch WhatsAppPage by slug
2. If page has pixelConfigId, fetch PixelRecord
3. Fire server-side Conversion API for ALL events in `events[]` array
4. Generate unique eventId for redirect event
5. Return page data + pixelId + eventId to client component

### Client-Side Actions (Updated 2025-12-31)

**On Page Mount:**
1. Initialize Meta Pixel SDK (if pixelId available)
2. Fire PageView (required for Meta Pixel Helper)
3. Fire all events from `events[]` via fbq (with deduplication)
4. Start countdown timer

**On Countdown End OR Button Click (whichever first):**
1. Check `hasRedirectTracked` ref - if true, skip tracking
2. Fire `redirectEvent` via fbq
3. Call server endpoint to fire `redirectEvent` via Conversion API
4. Set `hasRedirectTracked` = true
5. Redirect to whatsappUrl

### Event Deduplication Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  Page Load Events (events[]):                               │
│  - Server: Fire once in page.tsx                            │
│  - Client: Fire once in useEffect (hasTrackedPageEvents ref)│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Redirect Event (redirectEvent):                            │
│  - Server: Fire via API call from client before redirect    │
│  - Client: Fire once (hasRedirectTracked ref)               │
│  - Both paths (click/auto) use same ref                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Meta Events

Valid values for `events[]` and `redirectEvent`:

```typescript
type MetaEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "AddPaymentInfo"
  | "CompleteRegistration";
```

### Recommended Event Usage

| Event | Recommended For |
|-------|-----------------|
| ViewContent | Page load (events[]) - tracks page view |
| Lead | Page load (events[]) - tracks lead capture |
| CompleteRegistration | Redirect (redirectEvent) - tracks conversion |
| Purchase | Redirect (redirectEvent) - high-value conversion |

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 204 | Success (no content) |
| 400 | Validation error or invalid request |
| 404 | Page not found (public route only) |
| 500 | Server error |
