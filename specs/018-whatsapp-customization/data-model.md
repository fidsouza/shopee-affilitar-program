# Data Model: WhatsApp Group Customization Features

**Feature**: 018-whatsapp-customization
**Date**: 2026-01-11
**Purpose**: Define data structures and validation rules for new customization fields

## Overview

This feature extends the existing `WhatsAppPageRecord` type with three optional fields to support group image customization, participant count display, and footer configuration. All changes maintain backward compatibility with existing records.

---

## Entities

### WhatsAppPageRecord (Extended)

**Purpose**: Represents a WhatsApp group landing page with customization options

**Storage**: Vercel Edge Config (key: `whatsapp_pages_{id}`)

**Type Definition**:

```typescript
export type WhatsAppPageRecord = {
  // ... existing fields (unchanged) ...
  id: string;
  slug: string;
  headline: string;
  headerImageUrl?: string;
  socialProofs: string[];
  buttonText: string;
  whatsappUrl: string;
  pixelConfigId?: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: 'active' | 'inactive';
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
  socialProofEnabled: boolean;
  socialProofInterval: number;
  redirectEnabled: boolean;
  buttonEvent?: MetaEvent;
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string | null;
  vacancyBackgroundColor: string | null;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
  vacancyDecrementInterval: number;
  vacancyHeadlineColor: string | null;
  vacancyCountColor: string | null;
  vacancyFooterColor: string | null;
  socialProofCarouselItems: SocialProofItem[];
  carouselAutoPlay: boolean;
  carouselInterval: number;
  footerText: string | null;
  subheadlineFontSize: EmojiSize;
  buttonSize: EmojiSize;
  createdAt: string;
  updatedAt: string;

  // NEW FIELDS (Feature 018)
  groupImageUrl?: string;      // Custom group profile image URL
  participantCount?: number;   // Custom participant count to display
  footerEnabled: boolean;      // Whether to show WhatsApp-style footer
};
```

**New Field Details**:

1. **groupImageUrl** (optional string)
   - URL to custom group profile image
   - Displayed as circular header image
   - Separate from `headerImageUrl` (which may be used for different purposes)
   - Must be HTTPS URL pointing to valid image file
   - Default: `undefined` (no group image displayed)

2. **participantCount** (optional number)
   - Number of participants to display
   - Independent from `vacancyCount` (which tracks remaining slots)
   - Displayed as simple text below headline: "{count} participantes"
   - Must be non-negative integer (0-999999)
   - Default: `undefined` (no participant count displayed)

3. **footerEnabled** (boolean)
   - Whether to render the WhatsApp-style footer component
   - Footer includes text input field + send button
   - Clicking send triggers same redirect as main CTA button
   - Default: `false` (footer not shown)

---

## Validation Schemas

### groupImageUrlSchema

**Purpose**: Validate custom group image URLs

**Zod Schema**:

```typescript
export const groupImageUrlSchema = z
  .string()
  .url("URL inválida")
  .regex(
    /^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
    "URL deve ser HTTPS e apontar para uma imagem válida (.jpg, .png, .gif, .webp)"
  )
  .max(2048, "URL deve ter no máximo 2048 caracteres")
  .optional();
```

**Validation Rules**:
- Must be valid URL format
- Must use HTTPS protocol (not HTTP)
- Must end with image extension: .jpg, .jpeg, .png, .gif, or .webp (case-insensitive)
- Allows query parameters (e.g., `?size=large&quality=high`)
- Maximum length: 2048 characters
- Optional: can be undefined or empty string

**Error Messages** (Portuguese):
- Invalid URL: "URL inválida"
- Not HTTPS or wrong extension: "URL deve ser HTTPS e apontar para uma imagem válida (.jpg, .png, .gif, .webp)"
- Too long: "URL deve ter no máximo 2048 caracteres"

---

### participantCountSchema

**Purpose**: Validate participant count values

**Zod Schema**:

```typescript
export const participantCountSchema = z
  .number({
    invalid_type_error: "Quantidade deve ser um número",
  })
  .int("Quantidade deve ser um número inteiro")
  .min(0, "Quantidade deve ser maior ou igual a 0")
  .max(999999, "Quantidade deve ser menor que 1.000.000")
  .optional();
```

**Validation Rules**:
- Must be a number (integer only)
- Minimum value: 0 (cannot be negative)
- Maximum value: 999,999 (practical display limit)
- Optional: can be undefined

**Error Messages** (Portuguese):
- Not a number: "Quantidade deve ser um número"
- Not integer: "Quantidade deve ser um número inteiro"
- Negative: "Quantidade deve ser maior ou igual a 0"
- Too large: "Quantidade deve ser menor que 1.000.000"

---

### footerEnabledSchema

**Purpose**: Validate footer toggle setting

**Zod Schema**:

```typescript
export const footerEnabledSchema = z.boolean().default(false);
```

**Validation Rules**:
- Must be boolean (true/false)
- Default value: `false` (footer disabled by default)
- Non-optional (always has a value)

---

### Extended whatsAppPageSchema

**Updated Schema**:

```typescript
export const whatsAppPageSchema = z.object({
  // ... existing fields ...
  id: z.string().uuid().optional(),
  headline: z.string().min(1, "Informe um título"),
  headerImageUrl: z.string().url().optional(),
  socialProofs: z.array(z.string()),
  buttonText: z.string().min(1, "Informe o texto do botão"),
  whatsappUrl: z.string().url("URL do WhatsApp inválida"),
  pixelConfigId: z.string().optional(),
  events: z.array(metaEventEnum),
  redirectEvent: metaEventEnum,
  redirectDelay: z.number().min(0),
  status: z.enum(["active", "inactive"]),
  // ... other existing fields ...

  // NEW FIELDS (Feature 018)
  groupImageUrl: groupImageUrlSchema,
  participantCount: participantCountSchema,
  footerEnabled: footerEnabledSchema,
});

export type WhatsAppPageInput = z.infer<typeof whatsAppPageSchema>;
```

---

## Data Relationships

### WhatsAppPageRecord ↔ Edge Config

**Storage Pattern**: Index + Individual Records

**Index Entry** (`whatsapp_pages_index`):
```typescript
type WhatsAppPageIndexEntry = {
  id: string;
  slug: string;
  headline: string;
  status: 'active' | 'inactive';
};
```

**Individual Record** (`whatsapp_pages_{id}`):
```typescript
WhatsAppPageRecord (full object with all fields)
```

**Relationship Notes**:
- Index is updated when headline or status changes
- Individual record is always stored in full
- New fields are included in individual record only (not in index)
- Slug remains derived from headline (unchanged)

---

### WhatsAppPageRecord ↔ UI Components

**Component Mapping**:

1. **Group Image** (`groupImageUrl`)
   - Consumed by: `/w/[slug]/client.tsx`
   - Rendered as: Circular header image (`<img>` with border-radius and border)
   - Placement: Top of page, before headline
   - Conditional: Only shown if `groupImageUrl` is defined

2. **Participant Count** (`participantCount`)
   - Consumed by: `/w/[slug]/client.tsx`
   - Rendered as: Small gray text below headline
   - Placement: Between headline and social proofs/subheadline
   - Conditional: Only shown if `participantCount` is defined and > 0
   - Format: "{count} participantes"

3. **Footer** (`footerEnabled`)
   - Consumed by: `/w/[slug]/client.tsx`
   - Rendered as: `<WhatsAppFooter>` component at bottom
   - Placement: Fixed bottom of viewport
   - Conditional: Only shown if `footerEnabled` is true
   - Behavior: Triggers WhatsApp redirect on send click

---

## State Transitions

### WhatsAppPageRecord Lifecycle

```
1. CREATE (via admin form)
   └─> New record with optional fields set to defaults
       - groupImageUrl: undefined
       - participantCount: undefined
       - footerEnabled: false

2. UPDATE (via admin form)
   └─> Existing record modified
       - groupImageUrl: can be set, cleared (→ undefined), or unchanged
       - participantCount: can be set, cleared (→ undefined), or unchanged
       - footerEnabled: can be toggled true/false

3. READ (via /w/[slug] page)
   └─> Record fetched from Edge Config
       - Migration applied for backward compatibility
       - Defaults set for missing fields

4. DELETE (via admin form)
   └─> Record removed from Edge Config
       - Index updated
       - Individual record deleted
```

**Field Value Transitions**:

- **groupImageUrl**: `undefined` ↔ `"https://..."` ↔ `undefined`
- **participantCount**: `undefined` ↔ `0-999999` ↔ `undefined`
- **footerEnabled**: `false` ↔ `true` ↔ `false`

---

## Backward Compatibility

### Migration Function Updates

**Location**: `frontend/src/lib/repos/whatsapp-pages.ts`

**Updated Migration**:

```typescript
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  let migrated = { ...record } as WhatsAppPageRecord;

  // ... existing migrations ...

  // Add defaults for Feature 018 fields (backward compatibility - 2026-01-11)
  migrated.groupImageUrl = record.groupImageUrl ?? undefined;
  migrated.participantCount = record.participantCount ?? undefined;
  migrated.footerEnabled = record.footerEnabled ?? false;

  return migrated;
}
```

**Legacy Type Extension**:

```typescript
type LegacyWhatsAppPageRecord = Omit<
  WhatsAppPageRecord,
  'groupImageUrl' | 'participantCount' | 'footerEnabled'
> & {
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled?: boolean;
};
```

**Behavior**:
- Existing records without new fields get default values
- No data migration scripts needed
- All pages continue to work without modification
- Admins can opt-in to new features per page

---

## Constraints & Rules

### Business Rules

1. **Group Image**:
   - Image must be externally hosted (no uploads)
   - Must be accessible via HTTPS
   - Must be valid image format
   - Displayed as 96px × 96px circle (responsive to screen size)

2. **Participant Count**:
   - Independent from vacancy counter
   - Static display (no automatic updates)
   - Can show any positive integer (not tied to actual WhatsApp group size)
   - Optional social proof element

3. **Footer**:
   - Purely decorative (doesn't send actual messages)
   - Input text is not stored or processed
   - Send button triggers same redirect as main CTA
   - Fixed position on mobile for easy access

### Technical Constraints

1. **Edge Runtime Compatibility**:
   - All new fields must be serializable to JSON
   - No Node.js-specific APIs in rendering logic
   - Minimal bundle size impact

2. **Performance**:
   - Image loading must not block page render
   - Footer component must be lightweight (<5KB)
   - No additional API calls for new features

3. **Mobile-First**:
   - All new UI elements must be responsive
   - Footer must handle small screens gracefully
   - Images must adapt to viewport size

---

## Database Schema (Edge Config)

**Storage Format**: JSON

**Example Record**:

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "slug": "grupo-ofertas-shopee",
  "headline": "Grupo VIP de Ofertas Shopee",
  "headerImageUrl": "https://example.com/header.jpg",
  "socialProofs": ["Mais de 500 membros ativos", "Ofertas atualizadas diariamente"],
  "buttonText": "Entrar no Grupo VIP",
  "whatsappUrl": "https://chat.whatsapp.com/...",
  "pixelConfigId": "abc-123",
  "events": ["ViewContent", "AddToCart"],
  "redirectEvent": "Lead",
  "redirectDelay": 5,
  "status": "active",
  "benefitCards": [],
  "emojiSize": "medium",
  "socialProofEnabled": false,
  "socialProofInterval": 10,
  "redirectEnabled": true,
  "buttonEvent": "Lead",
  "vacancyCounterEnabled": false,
  "vacancyHeadline": "",
  "vacancyCount": 0,
  "vacancyFooter": null,
  "vacancyBackgroundColor": null,
  "vacancyCountFontSize": "large",
  "vacancyHeadlineFontSize": "medium",
  "vacancyFooterFontSize": "small",
  "vacancyDecrementInterval": 10,
  "vacancyHeadlineColor": null,
  "vacancyCountColor": null,
  "vacancyFooterColor": null,
  "socialProofCarouselItems": [],
  "carouselAutoPlay": false,
  "carouselInterval": 5,
  "footerText": null,
  "subheadlineFontSize": "medium",
  "buttonSize": "medium",
  "createdAt": "2026-01-11T10:00:00Z",
  "updatedAt": "2026-01-11T10:00:00Z",

  "groupImageUrl": "https://example.com/group-profile.jpg",
  "participantCount": 247,
  "footerEnabled": true
}
```

---

## Edge Cases

### Group Image URL

1. **Invalid URL format**: Validation error displayed, field cleared
2. **HTTP (not HTTPS)**: Validation error: "URL deve ser HTTPS..."
3. **Non-image URL**: Validation error: "...apontar para uma imagem válida"
4. **Image fails to load**: Browser shows broken image icon (native behavior)
5. **Very large image**: May load slowly but won't block page render
6. **Unusual aspect ratio**: Cropped to square circle via CSS

### Participant Count

1. **Zero (0)**: Valid but not displayed (conditional rendering)
2. **Negative number**: Validation error: "...maior ou igual a 0"
3. **Decimal number**: Validation error: "...número inteiro"
4. **Very large number (>999999)**: Validation error: "...menor que 1.000.000"
5. **Not a number**: Validation error: "...deve ser um número"

### Footer

1. **Footer enabled but footer component fails**: Graceful degradation, main CTA still works
2. **User types long text**: Input accepts text but doesn't send (decorative only)
3. **User presses Enter**: Same as clicking send button (triggers redirect)
4. **Small screen (<320px)**: Footer scales down but remains functional
5. **Footer conflicts with browser keyboard**: Native browser behavior (footer scrolls up)

---

## Indexing & Queries

**Current Queries** (unchanged):
- Get all pages: Read `whatsapp_pages_index`, then batch read individual records
- Get page by slug: Search index for slug, read individual record
- Get page by ID: Direct read `whatsapp_pages_{id}`

**No new queries needed**: All features use existing access patterns.

---

## Data Migration

**Migration Required**: NO

**Rationale**:
- All new fields are optional with sensible defaults
- Migration function handles missing fields at read time
- Existing records continue to work without modification
- No schema version tracking needed

**Deployment Steps**:
1. Deploy code with new fields and migration logic
2. No database migration script needed
3. Existing pages automatically get default values on next read
4. Admins can update pages to use new features

---

## Summary

### Changes to Existing Entities

**WhatsAppPageRecord**:
- Added 3 new optional fields
- Total new fields: `groupImageUrl`, `participantCount`, `footerEnabled`
- Backward compatible: existing records work without changes

### New Validation Schemas

1. `groupImageUrlSchema`: HTTPS image URL validation
2. `participantCountSchema`: Integer 0-999999 validation
3. `footerEnabledSchema`: Boolean with default false

### Storage Impact

- **Additional data per record**: ~50-200 bytes (minimal)
- **Edge Config quota impact**: Negligible (<1% increase)
- **No new keys**: All data stored in existing record structure

### Migration Strategy

- **Runtime migration**: Applied on read via `migrateRecord()` function
- **Default values**: `undefined` for optional fields, `false` for footerEnabled
- **No downtime**: Fully backward compatible deployment
