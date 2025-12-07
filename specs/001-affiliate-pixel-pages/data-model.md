# Data Model - Affiliate Pixel Redirect Pages

## Entities

### PixelConfiguration
- `id`: string (uuid)
- `label`: string (human-friendly name)
- `pixelId`: string (Meta Pixel ID; numeric, length 15–20; required)
- `isDefault`: boolean (only one default)
- `defaultEvents`: MetaEvent[] (deduped list)
- `createdAt` / `updatedAt`: ISO string

**Relationships**
- Referenced by `ProductLink.pixelConfigId`.

**Validation**
- `pixelId` must match `/^[0-9]{10,20}$/`.
- `defaultEvents` must be from MetaEvent enum; dedupe client- and server-side.
- Only one `isDefault` true across stored configs.

### ProductLink
- `id`: string (uuid)
- `slug`: string (unique, URL-safe; generated)
- `title`: string
- `affiliateUrl`: string (required; must be valid URL and domain in {shopee, aliexpress, mercadolivre, amazon})
- `pixelConfigId`: string (required; references PixelConfiguration)
- `events`: MetaEvent[] (one or more; deduped)
- `status`: `active` | `inactive`
- `createdAt` / `updatedAt`: ISO string

**Relationships**
- `pixelConfigId` references an existing PixelConfiguration.

**Validation**
- `affiliateUrl` must be non-empty, valid URL, allowed host, and https.
- `events` must contain at least one MetaEvent when `status=active`.
- `status=active` requires a valid pixel reference; otherwise block activation.

**State transitions**
- `inactive` → `active`: requires valid pixel + affiliateUrl + ≥1 event.
- `active` → `inactive`: transition page renders inactive state; no events fired.

### TrackingEvent (runtime observation, not persisted in Edge Config)
- `eventName`: MetaEvent
- `pixelId`: string
- `eventId`: string (shared between pixel + CAPI for dedup)
- `source`: `pixel` | `capi`
- `timestamp`: number
- `result`: `sent` | `failed`

## Enums

### MetaEvent
`PageView | ViewContent | AddToCart | InitiateCheckout | Lead | Purchase | AddPaymentInfo | CompleteRegistration`

## Edge Config layout
- Keys: `pixels:{id}` for PixelConfiguration; `products:{id}` for ProductLink.
- Indexes: `pixels:index` (array of {id,label,isDefault}); `products:index` (array of {id,slug,title,status,pixelConfigId,events}).
- Enforce single default pixel in index updates; use index for admin listings to avoid full scans.
