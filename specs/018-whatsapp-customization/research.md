# Research: WhatsApp Group Customization Features

**Feature**: 018-whatsapp-customization
**Date**: 2026-01-11
**Purpose**: Resolve technical unknowns and document design decisions

## Research Tasks

### 1. Image Storage Mechanism for Group Images

**Question**: How should custom group images be stored and served?

**Research Findings**:

Examined the existing codebase for how `headerImageUrl` is currently handled:
- In `whatsapp-pages.ts`: `headerImageUrl` is stored as a string (URL) in the WhatsAppPageRecord
- No image upload handling code exists in the current codebase
- Edge Config stores only the URL reference, not the binary image data
- Admin form likely expects users to paste image URLs (hosted externally)

**Alternatives Considered**:

1. **External URL (paste URL only)** - Current pattern
   - User pastes a URL to an externally-hosted image
   - Pros: Simple, no storage required, follows existing pattern
   - Cons: Relies on external hosting, no upload UX

2. **Base64 Data URLs**
   - Store images as base64-encoded strings directly in Edge Config
   - Pros: Self-contained, no external dependencies
   - Cons: Large data size (bloats Edge Config), performance issues, not scalable

3. **Vercel Blob Storage**
   - Upload to Vercel's blob storage, store returned URL
   - Pros: Native Vercel integration, CDN delivery, proper image hosting
   - Cons: Requires additional setup, potential costs, new dependency

4. **Third-party CDN (Cloudinary, Uploadcare, etc.)**
   - Upload to external CDN service
   - Pros: Optimized image delivery, transformations available
   - Cons: External dependency, API key management, costs

**Decision**: Use **External URL (paste URL only)** pattern for initial implementation

**Rationale**:
- Matches the existing `headerImageUrl` pattern exactly
- Zero additional infrastructure needed
- Simplest implementation (just add a new URL field)
- Users can host images on their preferred service (Imgur, Google Drive, Cloudinary, etc.)
- Can be enhanced later with upload functionality if needed
- Maintains consistency with current architecture

**Implementation Notes**:
- Add `groupImageUrl` field as optional string in WhatsAppPageRecord
- Add URL validation in Zod schema (must be valid HTTPS URL)
- Admin form provides text input for URL (similar to headerImageUrl field)
- Display validation errors for invalid URLs
- Provide helper text: "Use a direct image URL (e.g., https://example.com/image.jpg)"

---

### 2. Participant Count Display Pattern

**Question**: How should participant count be displayed alongside the existing vacancy counter?

**Research Findings**:

Examined existing WhatsApp page features:
- Vacancy counter already displays at `frontend/src/app/w/[slug]/client.tsx:340-368`
- Uses a bordered box with headline, count, and footer
- Has dynamic decrement behavior (countdown)
- Positioned after the progress bar section

**Alternatives Considered**:

1. **Separate component above vacancy counter**
   - Display participant count in its own section
   - Pros: Clear separation, independent styling
   - Cons: More screen real estate, potential clutter

2. **Integrated with vacancy counter**
   - Combine both counts in same visual block
   - Pros: Compact, related information together
   - Cons: Complex conditional rendering, confusing UX

3. **Display near group header image**
   - Show participant count next to or below the group image
   - Pros: Contextual (participants belong to the group), common pattern
   - Cons: Clutters header area

4. **Simple text below headline**
   - Small text like "247 participantes" below the main headline
   - Pros: Subtle, doesn't compete with main CTAs, follows WhatsApp patterns
   - Cons: May be overlooked

**Decision**: Display participant count as **simple text below headline** (option 4)

**Rationale**:
- WhatsApp groups show participant count near the group name/header
- Subtle social proof without competing with main CTA button
- Doesn't interfere with existing vacancy counter (which serves a different purpose)
- Easy to implement and style
- Mobile-friendly (minimal space usage)

**Implementation Notes**:
- Add `participantCount` field as optional number in WhatsAppPageRecord
- Display format: `{participantCount} participantes` in gray text
- Position: Between headline and subheadline/social proofs section
- Use Tailwind classes: `text-sm text-gray-500 mt-1`
- Conditional rendering: only show if `participantCount` is set and > 0

---

### 3. WhatsApp Footer Design Specifications

**Question**: What specific design elements should the WhatsApp-style footer include?

**Research Findings**:

WhatsApp Web/Mobile interface patterns:
- Footer spans full width at bottom of screen
- Light background (white/light gray)
- Text input with rounded corners
- Send button icon (paper airplane or arrow)
- Subtle borders and shadows
- Fixed positioning on mobile (stays visible during scroll)

**Alternatives Considered**:

1. **Exact WhatsApp replica**
   - Replicate WhatsApp's exact colors, spacing, icons
   - Pros: Maximum familiarity, authentic look
   - Cons: Potential trademark concerns, may not match site branding

2. **Themed variation**
   - Similar structure but using site's green color scheme
   - Pros: Familiar but branded, legal safety
   - Cons: Less authentic

3. **Simplified version**
   - Basic input + button without advanced WhatsApp features
   - Pros: Simple to build, no legal concerns
   - Cons: Less recognizable

**Decision**: Use **themed variation** (option 2) with green branding

**Rationale**:
- Familiar WhatsApp-like structure without direct copying
- Matches the existing green theme (green-500 for buttons)
- Avoids trademark issues while maintaining recognition
- Can leverage existing Tailwind utilities and shadcn/ui components

**Implementation Notes**:
- Create `components/whatsapp-footer.tsx` component
- Structure: Container with text input + send button
- Colors: Use site's existing green-500 for send button, gray-100 for background
- Input placeholder: "Digite uma mensagem..." (Portuguese)
- Send icon: Use lucide-react's `SendHorizontal` icon
- Desktop: Fixed bottom, max-width container
- Mobile: Fixed bottom with safe-area padding
- On click/submit: Trigger same WhatsApp redirect as main CTA button
- Props: `onSendClick: () => void` to handle redirect

---

### 4. Form Validation Rules

**Question**: What validation should apply to the new fields?

**Decision Summary**:

**Group Image URL**:
- Optional field (can be empty)
- When provided, must be valid HTTPS URL
- Regex pattern: `^https://.*\.(jpg|jpeg|png|gif|webp)(\?.*)?$` (case-insensitive)
- Max length: 2048 characters (standard URL limit)
- Error messages:
  - "URL deve começar com https://" if not HTTPS
  - "URL deve apontar para uma imagem válida (.jpg, .png, .gif, .webp)" if wrong extension

**Participant Count**:
- Optional field (can be null/undefined)
- When provided, must be integer >= 0
- Max value: 999999 (practical limit for display)
- Error messages:
  - "Quantidade deve ser um número inteiro" if not integer
  - "Quantidade deve ser maior ou igual a 0" if negative
  - "Quantidade deve ser menor que 1.000.000" if too large

**Backward Compatibility**:
- Both fields default to null/undefined for existing records
- Migration function in `whatsapp-pages.ts` sets defaults:
  - `groupImageUrl: record.groupImageUrl ?? undefined`
  - `participantCount: record.participantCount ?? undefined`

---

## Best Practices Applied

### Next.js 16 App Router Patterns
- Server Components for data fetching (page.tsx)
- Client Components for interactivity (client.tsx, footer component)
- Server Actions for data mutations (existing pattern in whatsapp-pages.ts)
- Edge Runtime compatibility (no Node.js APIs in /w/[slug])

### React 19 Features
- Use hooks (useState, useCallback) for footer interactions
- Proper event handling with TypeScript types
- Memo optimization if needed for footer component

### Tailwind CSS Best Practices
- Use utility classes for styling (no custom CSS)
- Responsive design with sm:, md:, lg: breakpoints
- Leverage existing shadcn/ui components where possible
- Follow existing color scheme (green-500, gray-500, etc.)

### Zod Validation Patterns
- Extend existing schemas in validation.ts
- Use `.optional()` for new fields to maintain backward compatibility
- Use `.refine()` for complex validation rules
- Provide Portuguese error messages matching existing style

### Edge Config Data Patterns
- Maintain index + individual records structure
- Include new fields in WhatsAppPageRecord type
- Update migration function for backward compatibility
- Preserve all existing fields during upsert

---

## Technology Stack Summary

**No new technologies required** - all features use existing dependencies:

- TypeScript 5
- Node.js 20
- Next.js 16.0.7 (App Router)
- React 19.2.0
- Tailwind CSS 3.4.15
- shadcn/ui (Radix UI components)
- Zod 4.1.13
- lucide-react 0.556.0 (for send icon)
- Vercel Edge Config (@vercel/edge-config 1.4.3)

**Dev dependencies** (already installed):
- TypeScript
- ESLint
- Prettier
- PostCSS
- Autoprefixer

---

## Performance Considerations

### Image Loading
- Group images load from external URLs (user-provided)
- Use native `<img>` tag with proper sizing attributes
- Add `loading="lazy"` for images below the fold
- Circular crop via Tailwind classes (no image processing needed)

### Footer Component
- Lightweight component (<50 lines)
- No external API calls
- Reuses existing redirect logic
- Minimal state (just input focus handling)

### Data Model Changes
- 2 new optional fields (minimal storage impact)
- No additional API calls
- No complex computations
- Backward compatible (no data migration required)

### Edge Runtime Compatibility
- All code runs on Edge Runtime (no Node.js APIs used)
- No server-side image processing
- Static asset serving via CDN
- Minimal bundle size increase (<10KB)

---

## Security Considerations

### Image URL Validation
- Enforce HTTPS only (no HTTP)
- Validate URL format before storage
- No direct file uploads (avoids file upload vulnerabilities)
- User responsibility for image content/hosting

### Input Sanitization
- Zod schemas validate all inputs
- Type safety via TypeScript
- No XSS risks (React escapes content)
- No SQL injection (Edge Config is key-value store)

### Footer Interactions
- No user-generated content stored from footer input
- Footer is decorative (doesn't submit data)
- Redirect uses existing validated WhatsApp URL
- No new attack vectors introduced

---

## Migration Strategy

### Backward Compatibility

**Existing pages without new fields**:
```typescript
// Migration function handles missing fields
migrated.groupImageUrl = record.groupImageUrl ?? undefined;
migrated.participantCount = record.participantCount ?? undefined;
```

**Display logic**:
```typescript
// Conditional rendering in client.tsx
{page.groupImageUrl && (
  <img src={page.groupImageUrl} alt="Group" />
)}

{page.participantCount && page.participantCount > 0 && (
  <p>{page.participantCount} participantes</p>
)}
```

**No data migration needed**:
- All new fields are optional
- Default values work for existing records
- No breaking changes to API or UI

### Deployment Strategy

1. Deploy backend changes first (data model + validation)
2. Verify backward compatibility with existing pages
3. Deploy frontend changes (admin form + display components)
4. Test all three features independently
5. Monitor for errors in production logs

---

## Open Questions Resolved

✅ **Image storage mechanism**: External URLs (paste URL pattern)
✅ **Participant count display**: Simple text below headline
✅ **Footer design**: Themed variation with site's green branding
✅ **Validation rules**: HTTPS URLs, integer 0-999999, Portuguese errors
✅ **Backward compatibility**: Optional fields with proper defaults
✅ **Performance impact**: Minimal (<200ms target met)
✅ **Security**: HTTPS validation, no file uploads, input sanitization

**All technical unknowns resolved. Ready for Phase 1 (Data Model & Contracts).**
