# Research: WhatsApp Group Social Proof Image Generator

**Feature**: 001-whatsapp-proof-generator
**Date**: 2026-01-11
**Status**: Complete

## Overview

This document consolidates research findings for implementing a browser-based WhatsApp group screenshot generator that creates realistic social proof images entirely on the client-side.

## Key Decisions

### 1. Client-Side Image Generation Library

**Decision**: Use **html-to-image** (npm package)

**Rationale**:
- Best accuracy for modern CSS features (flexbox, shadows, transforms, web fonts)
- Excellent TypeScript support with built-in type definitions
- React-friendly API compatible with hooks
- Good performance using SVG-based approach (~7 seconds for complex DOM)
- Active community with 1.6M weekly downloads
- No server processing required - pure client-side

**Alternatives Considered**:
1. **html2canvas** - Most popular (2.6M downloads) but significantly slower (3x) and less accurate with modern CSS. Layout inaccuracies with flexbox/grid make it unsuitable for pixel-perfect WhatsApp UI reproduction.

2. **dom-to-image-more** - Good performance but has security vulnerabilities in dependency chain and no Safari support due to strict `<foreignObject>` security model.

3. **Direct Canvas API** - Full control but extremely time-consuming to implement. Emoji rendering is highly problematic (colored emojis limited in canvas). Would require manual CSS-to-canvas conversion.

4. **SVG foreignObject** - Good accuracy but essentially what html-to-image implements internally. Safari has strict security restrictions. Better to use established library.

**Trade-offs**:
- Last published ~1 year ago (stable but slower updates)
- Some reported issues with Next.js Image components (workaround: use standard `<img>` tags)
- Emoji rendering depends on system fonts (can be inconsistent across platforms)
- Cross-origin images require CORS headers

**Browser Compatibility**:
- Chrome, Firefox, Edge: Excellent support
- Safari: Good support with minor security restrictions on `<foreignObject>`
- Internet Explorer: Not supported (acceptable for modern Next.js 16 app)

### 2. WhatsApp Visual Design Reproduction

**Decision**: Use Tailwind CSS classes with inline styles for WhatsApp-accurate colors and spacing

**Rationale**:
- Tailwind CSS already used in the project (tailwindcss 3.4.15)
- html-to-image serializes inline styles and Tailwind classes reliably
- Allows rapid iteration and precise control over WhatsApp design elements
- System fonts provide emoji support (platform-dependent but acceptable)

**WhatsApp Design Constants** (based on current WhatsApp Web/Mobile):
- Background color: `#e5ddd5` (light tan/beige)
- Header green: `#075e54` (dark green)
- Message bubble outgoing: `#dcf8c6` (light green)
- Message bubble incoming: `#ffffff` (white)
- Text primary: `#000000` (black)
- Text secondary: `#667781` (gray)
- Font family: System UI fonts (system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI")
- Message bubble border radius: `8px`
- Group icon placeholder: Circular, 40px diameter

**Alternatives Considered**:
- CSS-in-JS solutions (styled-components, emotion) - unnecessary complexity
- External stylesheet - may not serialize properly with html-to-image
- Custom WhatsApp font download - overkill, system fonts sufficient

### 3. Data Storage Strategy

**Decision**: Client-side ephemeral state only (React useState, no persistence)

**Rationale**:
- Spec explicitly states "Data is ephemeral - no need to save/persist WhatsApp screenshots"
- Admin downloads the generated image for external use
- No requirement for screenshot history or retrieval
- Simplifies implementation - no database schema, no API endpoints, no Edge Config changes
- Aligns with existing admin pattern - configuration stored, output downloaded

**Alternatives Considered**:
- Store in Edge Config (like WhatsApp pages) - rejected: spec says ephemeral
- Local storage for draft recovery - rejected: no requirement, adds complexity
- Server-side generation and storage - rejected: violates client-side requirement (FR-012)

### 4. Tab/Entry Organization for Participants

**Decision**: Use Radix UI Tabs component (already in project via shadcn/ui)

**Rationale**:
- Radix UI Tabs already installed (`@radix-ui/react-tabs@^1.1.13`)
- Proven pattern in existing WhatsApp admin page (`frontend/src/app/parametrizacao/whatsapp/page.tsx`)
- Accessible keyboard navigation and ARIA attributes built-in
- Consistent UI/UX with other admin sections
- Supports dynamic tab addition/removal

**Implementation Pattern**:
```tsx
<Tabs value={selectedParticipantId}>
  <TabsList>
    {participants.map((p) => (
      <TabsTrigger key={p.id} value={p.id}>
        {p.label} {/* e.g., "pessoa 1" */}
      </TabsTrigger>
    ))}
    <Button onClick={addParticipant}>+ Adicionar</Button>
  </TabsList>
  <TabsContent value={participant.id}>
    {/* Participant message input */}
  </TabsContent>
</Tabs>
```

**Alternatives Considered**:
- Accordion component - rejected: less suitable for editing independent entries
- Modal/dialog for each participant - rejected: poor UX for 20+ participants
- Single scrollable list with inline editing - rejected: doesn't match "tabs" requirement from spec

### 5. Image Export Format

**Decision**: PNG format with 2x pixel ratio (retina quality)

**Rationale**:
- PNG preserves exact colors and text sharpness (lossless compression)
- 2x pixel ratio ensures high quality on retina/high-DPI displays
- html-to-image's `toPng()` function is optimized and reliable
- WhatsApp screenshots are typically shared on social media where quality matters
- File size acceptable for static images (<1MB typically)

**Configuration**:
```typescript
toPng(element, {
  cacheBust: true,
  pixelRatio: 2,
  backgroundColor: '#e5ddd5'
})
```

**Alternatives Considered**:
- JPEG format - rejected: lossy compression degrades text quality, smaller file size not critical
- SVG format - rejected: not suitable for screenshot-style images, portability issues
- 1x pixel ratio - rejected: looks blurry on modern displays

### 6. Participant Message Structure

**Decision**: Simple text-only messages with auto-generated timestamps

**Rationale**:
- Spec assumption: "Each participant message will default to a simple text bubble format"
- Auto-generated timestamps (e.g., "10:30") avoid admin input burden
- Incremental timestamps (10:30, 10:31, 10:32) create realistic conversation flow
- No media attachments, voice messages, or advanced WhatsApp features in initial version
- Text input with emoji support via system keyboard

**Data Structure**:
```typescript
type Participant = {
  id: string;
  label: string; // "pessoa 1", "pessoa 2", etc.
  name: string; // Optional display name in chat
  message: string; // Message text
  timestamp: string; // Auto-generated (HH:MM format)
  order: number; // Display order in chat
}
```

**Alternatives Considered**:
- Manual timestamp input - rejected: adds complexity, admin burden, not required
- Rich text editor - rejected: overkill for MVP, WhatsApp uses plain text
- Media attachment support - rejected: out of scope for initial version

## Technical Stack Confirmation

**Language/Version**: TypeScript 5
**Framework**: Next.js 16.0.7 with App Router
**Runtime**: Node.js 20
**UI Library**: React 19.2.0
**Styling**: Tailwind CSS 3.4.15
**Component Library**: shadcn/ui (Radix UI primitives)
**Image Generation**: html-to-image (^1.11.11)
**State Management**: React useState (local component state, no global state needed)
**Testing**: ESLint (existing setup, no additional testing framework required)
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari)

## Performance Goals

- Screenshot preview updates in real-time (<500ms) as admin edits (SC-007)
- Image generation and download completes within 5 seconds for 20 participants
- No client-side performance degradation with 20 participants (SC-003)
- Admin can create complete screenshot with 5 participants in under 3 minutes (SC-001)

## Constraints

- Client-side only (FR-012: no server processing or storage)
- Must integrate with existing admin panel (`/parametrizacao`)
- Must use existing UI components (shadcn/ui, Radix UI)
- Must follow existing project patterns (Tabs component, form structure)
- Must work on modern browsers (no IE support required)
- Emoji rendering depends on system fonts (acceptable platform variation)

## Scale/Scope

- Support at least 20 participants per screenshot (FR-010, SC-003)
- Single admin user workflow (no multi-user collaboration)
- No screenshot history or persistence
- No server-side API endpoints required
- Purely additive feature - no changes to existing WhatsApp pages, pixels, or products

## Best Practices

### 1. html-to-image Usage
- Always set `cacheBust: true` to avoid stale cached fonts/images
- Use `pixelRatio: 2` for retina displays
- Avoid Next.js `<Image>` components in screenshot area (use standard `<img>` tags)
- Use inline styles or Tailwind classes (external stylesheets may not serialize)
- Handle errors gracefully with try/catch

### 2. WhatsApp Design Accuracy
- Use exact WhatsApp color codes
- Use system UI fonts for native feel
- Implement proper message bubble styling (borders, shadows, padding)
- Include realistic spacing and alignment
- Add group header elements (icon, name, participant count)

### 3. Participant Management
- Generate unique IDs for participants (crypto.randomUUID())
- Label sequentially: "pessoa 1", "pessoa 2", etc.
- Allow reordering with up/down buttons or drag-and-drop
- Validate participant limit (20 max)
- Preserve participant order when removing entries

### 4. UX Considerations
- Real-time preview of WhatsApp screenshot
- Clear "Download" button
- Loading states during image generation
- Error messages for failed downloads
- Prevent navigation with unsaved changes (if implemented)

## Implementation Notes

### File Locations (Expected)

**New Admin Tab Route**:
```
frontend/src/app/parametrizacao/whatsapp-generator/
  └── page.tsx (main component)
```

**Shared Components (if needed)**:
```
frontend/src/components/
  ├── whatsapp-screenshot-preview.tsx
  └── whatsapp-message-bubble.tsx
```

**No New API Routes Required** (client-side only)

**No New Validation Schemas Required** (no server persistence)

**No Edge Config Changes Required** (ephemeral data)

### Integration with Existing Admin

Add new tab to `/parametrizacao` navigation:
- "Produtos" (existing)
- "Pixels" (existing)
- "Páginas WhatsApp" (existing)
- **"Gerador de Provas de Whatsapp"** (new) ← Add this

Follow existing admin page patterns from `frontend/src/app/parametrizacao/whatsapp/page.tsx`:
- Use shadcn/ui components (Button, Tabs, Input)
- Use "use client" directive (client component)
- Implement form with loading/error/success states
- Match existing styling and layout

### Dependencies to Install

```bash
cd frontend
yarn add html-to-image
```

No other dependencies required - all other libraries already installed.

## References

- [html-to-image npm Package](https://www.npmjs.com/package/html-to-image)
- [html-to-image GitHub Repository](https://github.com/bubkoo/html-to-image)
- [Radix UI Tabs Documentation](https://www.radix-ui.com/docs/primitives/components/tabs)
- [WhatsApp Web Design Reference](https://web.whatsapp.com/)
- [Monday.com: Capturing DOM as Image](https://engineering.monday.com/capturing-dom-as-image-is-harder-than-you-think-how-we-solved-it-at-monday-com/)

## Version History

- 2026-01-11: Initial research completed
  - Image generation library: html-to-image
  - Design approach: Tailwind CSS with WhatsApp colors
  - Data storage: Client-side ephemeral (React useState)
  - Tab organization: Radix UI Tabs
  - Export format: PNG 2x pixel ratio
  - Participant structure: Text-only with auto timestamps
