# Component API Contracts

**Feature**: 018-whatsapp-customization
**Date**: 2026-01-11
**Purpose**: Define component interfaces and usage contracts

---

## WhatsAppFooter Component

### Location
`frontend/src/components/whatsapp-footer.tsx`

### Purpose
A WhatsApp-style footer component with text input and send button that mimics the familiar WhatsApp interface. Purely decorative - triggers redirect without actually sending messages.

### Props

```typescript
interface WhatsAppFooterProps {
  /**
   * Callback fired when send button is clicked or Enter is pressed in input
   * Should trigger WhatsApp redirect (same behavior as main CTA button)
   */
  onSendClick: () => void;

  /**
   * Optional placeholder text for the input field
   * @default "Digite uma mensagem..."
   */
  placeholder?: string;

  /**
   * Optional CSS classes for additional styling
   */
  className?: string;
}
```

### Usage Example

```tsx
import { WhatsAppFooter } from '@/components/whatsapp-footer';

function WhatsAppPage() {
  const handleRedirect = () => {
    window.location.href = 'https://chat.whatsapp.com/...';
  };

  return (
    <>
      {/* Page content */}
      <WhatsAppFooter onSendClick={handleRedirect} />
    </>
  );
}
```

### Behavior Specifications

#### User Interactions
1. **Click input field**: Input receives focus, keyboard appears on mobile
2. **Type text**: Text appears in input (not stored or processed)
3. **Click send button**: Fires `onSendClick` callback
4. **Press Enter in input**: Fires `onSendClick` callback (same as clicking send)
5. **Press Escape in input**: Blurs input (native browser behavior)

#### Visual States
- **Default**: Input empty, send button visible
- **Focused**: Input border highlighted (blue/green accent)
- **Typing**: Text visible in input field
- **Disabled**: N/A (component is always interactive)

#### Accessibility
- Input has proper `aria-label`: "Digite uma mensagem"
- Send button has `aria-label`: "Enviar mensagem"
- Keyboard navigation: Tab to input → Tab to send button → Enter to submit
- Screen reader: Announces input field and send button

### Styling Contract

#### Layout
- **Desktop**: Fixed bottom, centered container with max-width
- **Mobile**: Full-width fixed bottom with safe-area padding
- **Position**: `fixed bottom-0 left-0 right-0`
- **Z-index**: Higher than page content but below modals (z-50)

#### Dimensions
- **Height**: ~60px (auto-adjusts with padding)
- **Input width**: Flex-grow to fill available space
- **Send button width**: ~48px (square icon button)
- **Border radius**: Rounded (input: 24px, button: circle)

#### Colors (using site theme)
- **Background**: White or light gray (bg-white or bg-gray-50)
- **Border**: Light gray (border-gray-200)
- **Input text**: Dark gray (text-gray-900)
- **Placeholder**: Medium gray (text-gray-500)
- **Send button**: Green (bg-green-500, hover: bg-green-600)
- **Send icon**: White (text-white)

#### Spacing
- **Container padding**: p-4 (1rem)
- **Input padding**: px-4 py-2 (horizontal: 1rem, vertical: 0.5rem)
- **Gap between input and button**: gap-2 (0.5rem)

### Implementation Notes

#### Component Structure
```tsx
<div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
  <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
    <input
      type="text"
      placeholder="Digite uma mensagem..."
      className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-green-500"
      onKeyDown={(e) => e.key === 'Enter' && onSendClick()}
    />
    <button
      onClick={onSendClick}
      className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600"
      aria-label="Enviar mensagem"
    >
      <SendHorizontal className="w-5 h-5 text-white" />
    </button>
  </div>
</div>
```

#### Dependencies
- `lucide-react`: For SendHorizontal icon
- Tailwind CSS: For all styling
- React: useState (if internal state needed for input value)

#### Edge Cases
- **Very long text**: Input scrolls horizontally (native behavior)
- **Small screens (<320px)**: Footer scales down but remains functional
- **Keyboard on mobile**: Footer scrolls up with content (native behavior)
- **No onSendClick provided**: Component renders but does nothing (defensive)

---

## WhatsAppRedirectClient (Extended)

### Location
`frontend/src/app/w/[slug]/client.tsx`

### Changes Required
Extend existing component to:
1. Accept new fields in `page` prop
2. Render group image if `groupImageUrl` is set
3. Render participant count if `participantCount` is set
4. Render footer if `footerEnabled` is true

### Extended Props

```typescript
interface WhatsAppRedirectClientProps {
  page: WhatsAppPageRecord; // Now includes new fields
  pixelId?: string;
  eventId: string;
  redirectEventId: string;
  buttonEventId: string;
  appearance: WhatsAppAppearanceRecord;
}

// page.groupImageUrl?: string
// page.participantCount?: number
// page.footerEnabled: boolean
```

### New Rendering Logic

#### Group Image Display
```tsx
{page.groupImageUrl && (
  <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-green-500 shadow-lg">
    <img
      src={page.groupImageUrl}
      alt="Imagem do grupo"
      className="h-full w-full object-cover"
      loading="eager"
    />
  </div>
)}
```

**Position**: Before headline (top of page)
**Size**: 96px × 96px (h-24 w-24)
**Shape**: Circle (rounded-full)
**Border**: 4px green border (border-4 border-green-500)

#### Participant Count Display
```tsx
{page.participantCount !== undefined && page.participantCount > 0 && (
  <p className="text-sm text-gray-500 mt-1">
    {page.participantCount.toLocaleString('pt-BR')} participantes
  </p>
)}
```

**Position**: Between headline and social proofs
**Format**: "{count} participantes" (e.g., "247 participantes")
**Number formatting**: Use toLocaleString for thousands separator (1,234)
**Conditional**: Only show if count > 0

#### Footer Display
```tsx
{page.footerEnabled && (
  <WhatsAppFooter onSendClick={handleButtonClick} />
)}
```

**Position**: Bottom of page (fixed)
**Behavior**: Reuses existing `handleButtonClick` function
**Conditional**: Only show if `footerEnabled` is true

---

## Admin Form (Extended)

### Location
`frontend/src/app/parametrizacao/whatsapp/page.tsx`

### New Form Fields Required

#### Group Image URL Field
```tsx
<div className="space-y-2">
  <label htmlFor="groupImageUrl" className="text-sm font-medium">
    Imagem do Grupo (URL)
  </label>
  <input
    id="groupImageUrl"
    type="url"
    placeholder="https://example.com/image.jpg"
    value={formData.groupImageUrl || ''}
    onChange={(e) => setFormData({ ...formData, groupImageUrl: e.target.value })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
  <p className="text-xs text-gray-500">
    Cole a URL de uma imagem hospedada externamente (HTTPS, formato: .jpg, .png, .gif, .webp)
  </p>
  {errors.groupImageUrl && (
    <p className="text-xs text-red-600">{errors.groupImageUrl}</p>
  )}
</div>
```

#### Participant Count Field
```tsx
<div className="space-y-2">
  <label htmlFor="participantCount" className="text-sm font-medium">
    Quantidade de Participantes
  </label>
  <input
    id="participantCount"
    type="number"
    min="0"
    max="999999"
    placeholder="247"
    value={formData.participantCount || ''}
    onChange={(e) => setFormData({
      ...formData,
      participantCount: e.target.value ? parseInt(e.target.value, 10) : undefined
    })}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
  />
  <p className="text-xs text-gray-500">
    Número de participantes a exibir (opcional, 0 a 999.999)
  </p>
  {errors.participantCount && (
    <p className="text-xs text-red-600">{errors.participantCount}</p>
  )}
</div>
```

#### Footer Enabled Toggle
```tsx
<div className="flex items-center space-x-2">
  <input
    id="footerEnabled"
    type="checkbox"
    checked={formData.footerEnabled || false}
    onChange={(e) => setFormData({ ...formData, footerEnabled: e.target.checked })}
    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
  />
  <label htmlFor="footerEnabled" className="text-sm font-medium">
    Exibir footer estilo WhatsApp
  </label>
</div>
<p className="text-xs text-gray-500 ml-6">
  Mostra um campo de texto e botão de envio na parte inferior da página
</p>
```

### Form Validation

```typescript
function validateForm(data: FormData): Errors {
  const errors: Errors = {};

  // Group Image URL validation
  if (data.groupImageUrl) {
    const urlValidation = validateGroupImageUrl(data.groupImageUrl);
    if (!urlValidation.isValid) {
      errors.groupImageUrl = urlValidation.error;
    }
  }

  // Participant Count validation
  if (data.participantCount !== undefined) {
    const countValidation = validateParticipantCount(data.participantCount);
    if (!countValidation.isValid) {
      errors.participantCount = countValidation.error;
    }
  }

  return errors;
}
```

### Form Submission

```typescript
async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  const errors = validateForm(formData);
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }

  // Sanitize inputs
  const sanitizedData = {
    ...formData,
    groupImageUrl: sanitizeGroupImageUrl(formData.groupImageUrl),
    participantCount: sanitizeParticipantCount(formData.participantCount),
    footerEnabled: formData.footerEnabled || false,
  };

  // Submit to server action
  await upsertWhatsAppPage(sanitizedData);
}
```

---

## Server Action (Extended)

### Location
`frontend/src/lib/repos/whatsapp-pages.ts`

### Function: `upsertWhatsAppPage`

**Changes Required**:
1. Accept new fields in `WhatsAppPageInput` type
2. Validate new fields with Zod schemas
3. Store new fields in WhatsAppPageRecord
4. Handle backward compatibility in migration

### Updated Type

```typescript
export type WhatsAppPageInput = {
  // ... existing fields ...

  // NEW FIELDS (Feature 018)
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled?: boolean;
};
```

### Updated Record Creation

```typescript
const record: WhatsAppPageRecord = {
  // ... existing fields ...

  // NEW FIELDS (Feature 018) - 2026-01-11
  groupImageUrl: parsed.groupImageUrl ?? existing?.groupImageUrl ?? undefined,
  participantCount: parsed.participantCount ?? existing?.participantCount ?? undefined,
  footerEnabled: parsed.footerEnabled ?? existing?.footerEnabled ?? false,

  createdAt: existing?.createdAt ?? now,
  updatedAt: now,
};
```

### Updated Migration

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

---

## Summary

### New Components
1. **WhatsAppFooter**: Standalone footer component (new file)

### Modified Components
1. **WhatsAppRedirectClient**: Extended to render new features
2. **Admin form**: Extended to include new form fields

### Modified Types
1. **WhatsAppPageRecord**: Added 3 new fields
2. **WhatsAppPageInput**: Added 3 new fields
3. **LegacyWhatsAppPageRecord**: Added optional new fields for migration

### Modified Functions
1. **upsertWhatsAppPage**: Handle new fields in create/update
2. **migrateRecord**: Add defaults for backward compatibility

### API Surface Changes
- **Zero breaking changes**: All new fields are optional with sensible defaults
- **Backward compatible**: Existing pages work without modification
- **Additive only**: No removed or changed existing fields
