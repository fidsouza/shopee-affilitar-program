# Quickstart Guide: WhatsApp Group Customization Features

**Feature**: 018-whatsapp-customization
**Date**: 2026-01-11
**Audience**: Developers implementing this feature

---

## Overview

This guide walks through implementing three customization features for WhatsApp group landing pages:
1. **Custom Group Image**: Upload/paste URL for group profile picture
2. **Participant Count**: Display custom participant count (e.g., "247 participantes")
3. **WhatsApp Footer**: Interactive footer with text input and send button

**Estimated implementation time**: 4-6 hours

---

## Prerequisites

- Node.js 20+
- Yarn package manager
- Next.js 16 knowledge
- TypeScript 5 experience
- Familiarity with Zod validation
- Access to codebase at `/frontend` directory

**No new dependencies required** - all features use existing packages.

---

## Implementation Checklist

### Phase 1: Data Model (1 hour)

- [ ] Update `lib/validation.ts`:
  - [ ] Add `groupImageUrlSchema`
  - [ ] Add `participantCountSchema`
  - [ ] Add `footerEnabledSchema`
  - [ ] Extend `whatsAppPageSchema` with new fields

- [ ] Update `lib/repos/whatsapp-pages.ts`:
  - [ ] Add new fields to `WhatsAppPageRecord` type
  - [ ] Add new fields to `LegacyWhatsAppPageRecord` type
  - [ ] Update `migrateRecord()` function with defaults
  - [ ] Update `upsertWhatsAppPage()` to handle new fields

### Phase 2: WhatsApp Footer Component (1 hour)

- [ ] Create `components/whatsapp-footer.tsx`:
  - [ ] Create component with input + send button
  - [ ] Add `onSendClick` prop
  - [ ] Style with Tailwind (green theme)
  - [ ] Add keyboard handling (Enter key)
  - [ ] Test responsiveness (mobile/desktop)

### Phase 3: Display Logic (1.5 hours)

- [ ] Update `app/w/[slug]/client.tsx`:
  - [ ] Import new `WhatsAppFooter` component
  - [ ] Add group image rendering (if `groupImageUrl` set)
  - [ ] Add participant count rendering (if `participantCount` set)
  - [ ] Add footer rendering (if `footerEnabled` true)
  - [ ] Position elements correctly in layout

### Phase 4: Admin Form (1.5 hours)

- [ ] Update `app/parametrizacao/whatsapp/page.tsx`:
  - [ ] Add group image URL input field
  - [ ] Add participant count number input
  - [ ] Add footer enabled checkbox
  - [ ] Add validation error displays
  - [ ] Add helper text for each field
  - [ ] Wire up form state handling

### Phase 5: Testing & Polish (1 hour)

- [ ] Manual testing:
  - [ ] Create new page with all features enabled
  - [ ] Update existing page with new features
  - [ ] Test validation (invalid URLs, negative counts)
  - [ ] Test backward compatibility (existing pages)
  - [ ] Test mobile responsiveness
  - [ ] Test footer interactions

- [ ] Cleanup:
  - [ ] Run ESLint: `yarn lint`
  - [ ] Fix any linting errors
  - [ ] Build project: `yarn build`
  - [ ] Fix any build errors

---

## Step-by-Step Implementation

### Step 1: Update Validation Schemas

**File**: `frontend/src/lib/validation.ts`

Add these schemas after existing schemas:

```typescript
// Group Image URL validation - Feature 018 (2026-01-11)
export const groupImageUrlSchema = z
  .string()
  .url("URL inválida")
  .regex(
    /^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
    "URL deve ser HTTPS e apontar para uma imagem válida (.jpg, .png, .gif, .webp)"
  )
  .max(2048, "URL deve ter no máximo 2048 caracteres")
  .optional();

// Participant Count validation - Feature 018 (2026-01-11)
export const participantCountSchema = z
  .number({
    invalid_type_error: "Quantidade deve ser um número",
  })
  .int("Quantidade deve ser um número inteiro")
  .min(0, "Quantidade deve ser maior ou igual a 0")
  .max(999999, "Quantidade deve ser menor que 1.000.000")
  .optional();

// Footer Enabled validation - Feature 018 (2026-01-11)
export const footerEnabledSchema = z.boolean().default(false);
```

Extend the `whatsAppPageSchema` (find existing schema and add):

```typescript
export const whatsAppPageSchema = z.object({
  // ... existing fields ...

  // NEW FIELDS - Feature 018 (2026-01-11)
  groupImageUrl: groupImageUrlSchema,
  participantCount: participantCountSchema,
  footerEnabled: footerEnabledSchema,
});
```

---

### Step 2: Update Data Repository

**File**: `frontend/src/lib/repos/whatsapp-pages.ts`

**A. Update WhatsAppPageRecord type** (around line 25):

```typescript
export type WhatsAppPageRecord = Omit<WhatsAppPageInput, /* ... */> & {
  // ... existing fields ...

  // NEW FIELDS - Feature 018 (2026-01-11)
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled: boolean;

  createdAt: string;
  updatedAt: string;
};
```

**B. Update LegacyWhatsAppPageRecord type** (around line 65):

```typescript
type LegacyWhatsAppPageRecord = Omit<
  WhatsAppPageRecord,
  'events' | 'redirectEvent' | /* ... */ | 'groupImageUrl' | 'participantCount' | 'footerEnabled'
> & {
  // ... existing optional fields ...

  // Feature 018 - optional for backward compatibility (2026-01-11)
  groupImageUrl?: string;
  participantCount?: number;
  footerEnabled?: boolean;
};
```

**C. Update migrateRecord function** (around line 100):

```typescript
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  let migrated = { ...record } as WhatsAppPageRecord;

  // ... existing migrations ...

  // Add default values for Feature 018 fields (backward compatibility - 2026-01-11)
  migrated.groupImageUrl = record.groupImageUrl ?? undefined;
  migrated.participantCount = record.participantCount ?? undefined;
  migrated.footerEnabled = record.footerEnabled ?? false;

  return migrated;
}
```

**D. Update upsertWhatsAppPage function** (around line 250):

```typescript
const record: WhatsAppPageRecord = {
  // ... existing fields ...

  // Feature 018 fields (2026-01-11)
  groupImageUrl: parsed.groupImageUrl ?? existing?.groupImageUrl ?? undefined,
  participantCount: parsed.participantCount ?? existing?.participantCount ?? undefined,
  footerEnabled: parsed.footerEnabled ?? existing?.footerEnabled ?? false,

  createdAt: existing?.createdAt ?? now,
  updatedAt: now,
};
```

---

### Step 3: Create WhatsApp Footer Component

**File**: `frontend/src/components/whatsapp-footer.tsx` (NEW FILE)

```typescript
"use client";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";

interface WhatsAppFooterProps {
  onSendClick: () => void;
  placeholder?: string;
  className?: string;
}

export function WhatsAppFooter({
  onSendClick,
  placeholder = "Digite uma mensagem...",
  className = "",
}: WhatsAppFooterProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSendClick();
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 ${className}`}
    >
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-green-500 transition-colors"
          aria-label="Digite uma mensagem"
        />
        <button
          onClick={onSendClick}
          className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600 active:scale-95 transition-all shadow-md"
          aria-label="Enviar mensagem"
        >
          <SendHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
```

---

### Step 4: Update WhatsApp Redirect Client

**File**: `frontend/src/app/w/[slug]/client.tsx`

**A. Import WhatsAppFooter** (at top):

```typescript
import { WhatsAppFooter } from "@/components/whatsapp-footer";
```

**B. Add group image rendering** (before headline, around line 234):

```tsx
{/* Group Image - Feature 018 (2026-01-11) */}
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

{/* Headline */}
<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
  {page.headline}
</h1>
```

**C. Add participant count** (after headline, before subheadline, around line 248):

```tsx
{/* Headline */}
<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
  {page.headline}
</h1>

{/* Participant Count - Feature 018 (2026-01-11) */}
{page.participantCount !== undefined && page.participantCount > 0 && (
  <p className="text-sm text-gray-500 mt-1">
    {page.participantCount.toLocaleString("pt-BR")} participantes
  </p>
)}

{/* Subheadline */}
```

**D. Add footer** (at end of main element, before closing `</main>`, around line 415):

```tsx
      {/* Custom Footer - Added 2026-01-07 */}
      <PageFooter text={page.footerText} />

      {/* WhatsApp-Style Footer - Feature 018 (2026-01-11) */}
      {page.footerEnabled && (
        <WhatsAppFooter onSendClick={handleButtonClick} />
      )}
    </main>
  );
}
```

---

### Step 5: Update Admin Form

**File**: `frontend/src/app/parametrizacao/whatsapp/page.tsx`

Find the form section and add these fields in an appropriate location (e.g., after the header image section):

```tsx
{/* Group Image URL - Feature 018 (2026-01-11) */}
<div className="space-y-2">
  <label htmlFor="groupImageUrl" className="text-sm font-medium text-gray-700">
    Imagem do Grupo (URL)
  </label>
  <input
    id="groupImageUrl"
    type="url"
    placeholder="https://example.com/image.jpg"
    value={formData.groupImageUrl || ""}
    onChange={(e) =>
      setFormData({ ...formData, groupImageUrl: e.target.value })
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
  />
  <p className="text-xs text-gray-500">
    Cole a URL de uma imagem hospedada externamente (HTTPS, formato: .jpg, .png, .gif, .webp)
  </p>
</div>

{/* Participant Count - Feature 018 (2026-01-11) */}
<div className="space-y-2">
  <label htmlFor="participantCount" className="text-sm font-medium text-gray-700">
    Quantidade de Participantes
  </label>
  <input
    id="participantCount"
    type="number"
    min="0"
    max="999999"
    placeholder="247"
    value={formData.participantCount || ""}
    onChange={(e) =>
      setFormData({
        ...formData,
        participantCount: e.target.value ? parseInt(e.target.value, 10) : undefined,
      })
    }
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
  />
  <p className="text-xs text-gray-500">
    Número de participantes a exibir (opcional, 0 a 999.999)
  </p>
</div>

{/* Footer Enabled - Feature 018 (2026-01-11) */}
<div className="flex items-center space-x-2">
  <input
    id="footerEnabled"
    type="checkbox"
    checked={formData.footerEnabled || false}
    onChange={(e) =>
      setFormData({ ...formData, footerEnabled: e.target.checked })
    }
    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
  />
  <label htmlFor="footerEnabled" className="text-sm font-medium text-gray-700">
    Exibir footer estilo WhatsApp
  </label>
</div>
<p className="text-xs text-gray-500 ml-6">
  Mostra um campo de texto e botão de envio na parte inferior da página
</p>
```

---

## Testing Guide

### Test Case 1: Group Image Display

1. Go to `/parametrizacao/whatsapp`
2. Create/edit a page
3. Paste image URL: `https://picsum.photos/200`
4. Save and visit the page
5. ✅ Verify: Circular image appears at top
6. ✅ Verify: Image has green border
7. ✅ Verify: Image loads correctly

**Edge cases**:
- Invalid URL (not HTTPS): Should show validation error
- Non-image URL (e.g., .pdf): Should show validation error
- Broken image link: Browser shows broken image icon (acceptable)

### Test Case 2: Participant Count

1. Edit the same page
2. Set participant count: 247
3. Save and visit the page
4. ✅ Verify: "247 participantes" appears below headline
5. ✅ Verify: Text is gray and smaller than headline
6. Set count to 0
7. ✅ Verify: Participant count disappears (not shown)
8. Clear the field (empty)
9. ✅ Verify: Participant count disappears

**Edge cases**:
- Negative number: Should show validation error
- Decimal (1.5): Should show validation error
- Very large (1,000,000): Should show validation error

### Test Case 3: WhatsApp Footer

1. Edit the same page
2. Check "Exibir footer estilo WhatsApp"
3. Save and visit the page
4. ✅ Verify: Footer appears at bottom
5. ✅ Verify: Input field is visible with placeholder
6. ✅ Verify: Green send button is visible
7. Click input field
8. ✅ Verify: Input receives focus
9. Type some text
10. ✅ Verify: Text appears in input
11. Click send button
12. ✅ Verify: Redirects to WhatsApp
13. Reload page, focus input, press Enter
14. ✅ Verify: Also redirects to WhatsApp

**Edge cases**:
- Mobile view: Footer should stay at bottom
- Small screen (<320px): Footer should scale down
- Long text input: Should scroll horizontally

### Test Case 4: Backward Compatibility

1. Visit an existing page (created before this feature)
2. ✅ Verify: Page displays normally without errors
3. ✅ Verify: No group image shown (field not set)
4. ✅ Verify: No participant count shown (field not set)
5. ✅ Verify: No footer shown (disabled by default)
6. Edit this old page in admin
7. ✅ Verify: New fields are present but empty/unchecked
8. ✅ Verify: Can save without filling new fields

### Test Case 5: All Features Together

1. Create a new page with all features:
   - Group image URL: `https://picsum.photos/200`
   - Participant count: 1247
   - Footer enabled: checked
2. Save and visit
3. ✅ Verify: All three features display correctly
4. ✅ Verify: Layout is not broken
5. ✅ Verify: Features don't interfere with existing elements
6. ✅ Verify: Mobile responsiveness works

---

## Troubleshooting

### Issue: Build fails with TypeScript errors

**Solution**: Ensure all type definitions are updated:
- Check `WhatsAppPageRecord` has new fields
- Check `LegacyWhatsAppPageRecord` has optional new fields
- Run `yarn build` to see specific errors

### Issue: Validation errors on save

**Solution**: Check Zod schemas are correctly added:
- Verify `groupImageUrlSchema` is in `validation.ts`
- Verify `whatsAppPageSchema` includes new fields
- Check field names match exactly

### Issue: Footer not displaying

**Solution**:
- Verify `footerEnabled` is `true` in data
- Check import: `import { WhatsAppFooter } from "@/components/whatsapp-footer"`
- Verify conditional: `{page.footerEnabled && <WhatsAppFooter />}`

### Issue: Group image not showing

**Solution**:
- Check URL is valid HTTPS image
- Verify `groupImageUrl` field is set in data
- Check browser console for image load errors
- Verify conditional rendering: `{page.groupImageUrl && <img />}`

### Issue: Participant count not showing

**Solution**:
- Verify count is > 0
- Check conditional: `{page.participantCount && page.participantCount > 0}`
- Ensure field is number type, not string

---

## Deployment Checklist

Before deploying:

- [ ] All tests pass (manual testing completed)
- [ ] ESLint passes: `yarn lint`
- [ ] Build succeeds: `yarn build`
- [ ] Backward compatibility verified (existing pages work)
- [ ] Mobile responsiveness tested
- [ ] Code reviewed (optional)

Deployment steps:

1. Commit changes to `018-whatsapp-customization` branch
2. Push to remote: `git push origin 018-whatsapp-customization`
3. Deploy to staging/preview environment
4. Test all features on staging
5. Merge to main branch
6. Deploy to production
7. Monitor logs for errors

---

## Quick Reference

### Files Modified

1. `lib/validation.ts` - Add Zod schemas
2. `lib/repos/whatsapp-pages.ts` - Update types and repo logic
3. `app/w/[slug]/client.tsx` - Add rendering logic
4. `app/parametrizacao/whatsapp/page.tsx` - Add form fields

### Files Created

1. `components/whatsapp-footer.tsx` - New footer component

### Key Decisions

- **Image storage**: External URLs (paste URL, no uploads)
- **Participant display**: Simple text below headline
- **Footer design**: Themed green variation (not exact WhatsApp replica)
- **Backward compatibility**: All fields optional with defaults

---

## Next Steps

After implementation:

1. Create pull request with changes
2. Request code review
3. Address review feedback
4. Merge to main branch
5. Monitor production for issues
6. Update CLAUDE.md if needed
7. Consider future enhancements:
   - Image upload functionality
   - Advanced footer customization
   - Participant count auto-sync with WhatsApp API (if available)

---

## Support

For questions or issues:

1. Review `spec.md` for requirements
2. Review `research.md` for design decisions
3. Review `data-model.md` for data structures
4. Check `/contracts` for type definitions
5. Consult `plan.md` for overall architecture
