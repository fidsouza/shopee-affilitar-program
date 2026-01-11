# Implementation Plan: WhatsApp Group Social Proof Image Generator

**Branch**: `001-whatsapp-proof-generator` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-whatsapp-proof-generator/spec.md`

## Summary

Implement a client-side WhatsApp group screenshot generator that allows admin users to create realistic social proof images. The feature provides a new admin tab "Gerador de Provas de Whatsapp" where admins can enter a group name, add multiple participant messages (pessoa 1, pessoa 2, etc.), see a real-time WhatsApp-styled preview, and download the generated screenshot as a PNG image.

**Technical Approach**: Use html-to-image library to capture DOM elements as images entirely in the browser (no server processing). Leverage Tailwind CSS to accurately reproduce WhatsApp's visual design. Store data ephemerally in React component state with no persistence to Edge Config or database.

## Technical Context

**Language/Version**: TypeScript 5
**Primary Dependencies**: Next.js 16.0.7, React 19.2.0, Tailwind CSS 3.4.15, shadcn/ui (Radix UI), **html-to-image** (new dependency)
**Storage**: N/A (ephemeral client-side state only - no persistence)
**Testing**: ESLint (existing lint checks, no new testing framework)
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari) - client-side web application
**Project Type**: Web application (Next.js frontend)
**Performance Goals**: Screenshot preview updates <500ms, image generation <5s for 20 participants, admin creates complete screenshot in <3 minutes
**Constraints**: Client-side only (no server processing), must integrate with existing /parametrizacao admin panel, use existing UI components (shadcn/ui)
**Scale/Scope**: Support 20 participants per screenshot, single-user workflow, no persistence, purely additive feature

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitution File Status**: The project uses a template constitution file (`.specify/memory/constitution.md`) with placeholder content. No specific project principles have been ratified yet.

Since no active constitution exists, we proceed with **industry best practices**:

### ✓ Best Practice Compliance

| Practice | Status | Notes |
|----------|--------|-------|
| Client-side feature isolation | ✓ PASS | Feature is entirely self-contained in new admin route |
| No breaking changes | ✓ PASS | Purely additive - no modifications to existing features |
| Use existing dependencies | ✓ PASS | Only adds html-to-image, leverages existing Tailwind, shadcn/ui |
| Follow established patterns | ✓ PASS | Matches existing admin page structure (whatsapp/page.tsx) |
| TypeScript type safety | ✓ PASS | Full TypeScript implementation with interfaces |
| Accessibility | ✓ PASS | Uses Radix UI Tabs with built-in ARIA attributes |
| Performance conscious | ✓ PASS | Client-side generation avoids server load, 2x pixel ratio for quality |
| Security | ✓ PASS | No user-uploaded files to server, no XSS risk (admin-only feature) |

**Result**: No constitution violations. Proceeding with implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-whatsapp-proof-generator/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output - image generation library research
├── data-model.md        # Phase 1 output - TypeScript interfaces & state management
├── quickstart.md        # Phase 1 output - Developer implementation guide
├── contracts/           # Phase 1 output - API contracts (none needed - client-side only)
│   └── README.md        # Documents that no API endpoints are required
├── checklists/
│   └── requirements.md  # Specification quality validation
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan - created by /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── (root)/                          # Existing: Landing page
│   │   ├── parametrizacao/                  # Existing: Admin dashboard
│   │   │   ├── products/                    # Existing: Product CRUD
│   │   │   ├── pixels/                      # Existing: Pixel configuration
│   │   │   ├── whatsapp/                    # Existing: WhatsApp pages
│   │   │   └── whatsapp-generator/          # NEW: WhatsApp screenshot generator
│   │   │       ├── page.tsx                 # Main generator component
│   │   │       └── types.ts                 # TypeScript interfaces (optional)
│   │   ├── t/[slug]/                        # Existing: Transition pages
│   │   ├── w/[slug]/                        # Existing: WhatsApp redirect pages
│   │   └── api/                             # Existing: REST endpoints (NO CHANGES)
│   ├── components/
│   │   ├── ui/                              # Existing: shadcn components (reused)
│   │   └── whatsapp-screenshot/             # NEW (optional): Reusable components
│   │       ├── preview.tsx                  # WhatsApp preview component
│   │       └── message-bubble.tsx           # Message bubble component
│   └── lib/
│       ├── repos/                           # Existing: Server actions (NO CHANGES)
│       ├── hooks/                           # Existing: React hooks
│       ├── edge-config.ts                   # Existing: Edge Config wrapper (NO CHANGES)
│       ├── conversion-api.ts                # Existing: Meta Conversion API (NO CHANGES)
│       └── validation.ts                    # Existing: Zod schemas (NO CHANGES)
├── package.json                             # UPDATE: Add html-to-image dependency
└── yarn.lock                                # AUTO-UPDATED by yarn

specs/
└── 001-whatsapp-proof-generator/            # NEW: Feature documentation (this directory)
```

**Structure Decision**:

This feature follows the **web application** pattern established by the existing Next.js 16 project. All new code lives in `frontend/src/app/parametrizacao/whatsapp-generator/`.

**Key Points**:
- **New admin route**: `/parametrizacao/whatsapp-generator` (single page.tsx component)
- **Reuses existing UI components**: Button, Tabs from shadcn/ui
- **Optional component extraction**: WhatsApp preview and message bubbles could be extracted to `/components/whatsapp-screenshot/` if reused elsewhere
- **No API changes**: No new `/api` routes (client-side only feature)
- **No lib changes**: No new server actions, repos, or Edge Config modifications
- **Isolated feature**: Can be developed, tested, and deployed independently

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. This section is not applicable.

## Phase 0: Outline & Research

**Status**: ✓ COMPLETED

### Research Tasks

1. **Client-Side Image Generation Library**
   - Researched: html2canvas, html-to-image, dom-to-image-more, direct Canvas API, SVG foreignObject
   - **Decision**: html-to-image (best CSS accuracy, TypeScript support, React-friendly, good performance)
   - **Rationale**: See [research.md](./research.md) for detailed comparison

2. **WhatsApp Visual Design Reproduction**
   - **Decision**: Tailwind CSS with inline styles for WhatsApp color constants
   - **Colors**: `#e5ddd5` (background), `#075e54` (header green), `#ffffff` (incoming bubble), `#dcf8c6` (outgoing bubble)
   - **Fonts**: System UI fonts (system-ui, -apple-system, BlinkMacSystemFont)

3. **Data Storage Strategy**
   - **Decision**: Client-side ephemeral state only (React useState)
   - **Rationale**: Spec explicitly states no persistence needed (FR-012, Assumptions section)

4. **Tab Organization for Participants**
   - **Decision**: Radix UI Tabs component (already installed via shadcn/ui)
   - **Rationale**: Proven pattern in existing whatsapp/page.tsx, accessible, supports dynamic tabs

5. **Image Export Format**
   - **Decision**: PNG with 2x pixel ratio (retina quality)
   - **Rationale**: Lossless compression preserves text sharpness, high-DPI support

### Research Output

- **File**: [research.md](./research.md)
- **Decisions Documented**: 6 key technical decisions with rationale and alternatives considered
- **No NEEDS CLARIFICATION markers**: All technical unknowns resolved through research

## Phase 1: Design & Contracts

**Status**: ✓ COMPLETED

### Data Model

**Output**: [data-model.md](./data-model.md)

**Key Entities**:

1. **WhatsAppScreenshot** (root entity)
   - groupName: string (max 100 chars, required)
   - participants: Participant[] (max 20 items)
   - createdAt: Date (for filename generation)
   - groupIconUrl?: string (optional HTTPS URL)

2. **Participant** (message entry)
   - id: string (UUID via crypto.randomUUID())
   - label: string (auto-generated: "pessoa 1", "pessoa 2", ...)
   - name: string (optional display name, max 50 chars)
   - message: string (required, max 500 chars)
   - timestamp: string (auto-generated HH:MM format)
   - order: number (0-19, determines display sequence)

**State Management**: React useState for ephemeral component state (no Redux, no global state)

**Validation Rules**: Documented in data-model.md with TypeScript validation functions

**No Persistence Layer**: Intentionally no Edge Config, database, or local storage

### API Contracts

**Output**: [contracts/README.md](./contracts/README.md)

**Key Finding**: No API endpoints required

**Rationale**:
- FR-012: "System MUST generate the image entirely on the client-side"
- Spec Assumptions: "Data is ephemeral - no need to save/persist WhatsApp screenshots"
- Image generation: html-to-image library (browser-based, no server processing)
- Image download: Direct browser blob URL download

**Browser APIs Used**:
- html-to-image: `toPng(element, options)` for image generation
- Crypto API: `crypto.randomUUID()` for participant IDs
- File Download API: `<a>` element with `download` attribute and blob data URL

### Quickstart Guide

**Output**: [quickstart.md](./quickstart.md)

**Contents**:
- Setup instructions (install html-to-image dependency)
- Step-by-step implementation guide with code samples
- Complete page.tsx component structure
- Customization examples (reordering, group icon, enhanced styling)
- Common issues & solutions (emojis, Next.js Image compatibility, screenshot quality)
- Performance tips (debouncing, lazy loading, memo)

**Target Audience**: Developers implementing this feature

### Agent Context Update

**Output**: Updated `CLAUDE.md` with new technologies from this plan

**Command Executed**: `.specify/scripts/bash/update-agent-context.sh claude`

**Changes**:
- Added html-to-image library to technology stack
- Documented WhatsApp generator route in project structure
- Preserved existing manual additions between markers

## Phase 2: Task Breakdown

**Status**: NOT STARTED (this command only goes to Phase 1)

**Next Command**: `/speckit.tasks` (generates tasks.md with dependency-ordered implementation tasks)

**Expected Tasks** (preview - not official until /speckit.tasks runs):
1. Install html-to-image dependency (yarn add)
2. Create new admin route: `frontend/src/app/parametrizacao/whatsapp-generator/page.tsx`
3. Implement group name input field and preview header
4. Implement participant management (add, remove, edit, tabs)
5. Implement WhatsApp message preview component
6. Implement screenshot download with html-to-image
7. Add navigation link to /parametrizacao admin panel
8. Test screenshot generation across browsers (Chrome, Firefox, Safari)
9. Validate participant limits (20 max)
10. Handle edge cases (long group names, emojis, special characters)

## Implementation Notes

### Critical Success Factors

1. **Visual Accuracy** (SC-002): Screenshot must be "visually indistinguishable from real WhatsApp"
   - Use exact WhatsApp color codes
   - Match font styles (system-ui family)
   - Accurate spacing, borders, shadows
   - Test against real WhatsApp Web screenshots

2. **Performance** (SC-007): Preview updates <500ms
   - Minimize re-renders with React.memo or useMemo
   - Debounce text input if needed
   - Keep DOM simple in preview area

3. **Image Quality** (SC-004): "100% visual fidelity to preview"
   - Always use pixelRatio: 2 in toPng options
   - Set cacheBust: true to avoid stale resources
   - Use standard `<img>` tags (not Next.js Image) in preview

4. **User Experience** (SC-001): Create complete screenshot in <3 minutes
   - Auto-generate timestamps (don't ask admin)
   - Pre-fill participant labels (pessoa 1, pessoa 2, ...)
   - Provide clear validation messages
   - Instant preview feedback

### Integration with Existing Admin

**Pattern to Follow**: Analyze `frontend/src/app/parametrizacao/whatsapp/page.tsx` (existing WhatsApp admin)

**Reuse**:
- "use client" directive (client component)
- Form state pattern (useState for loading, error, success)
- shadcn/ui components (Button, Tabs)
- Layout structure (space-y-6, rounded-lg bg-card p-4)
- Error/success message display pattern

**Add to Navigation**:
- Location: `/parametrizacao` layout or navigation component
- Label: "Gerador de Provas de Whatsapp"
- Order: After "Páginas WhatsApp" (fourth tab)

### Dependency Installation

```bash
cd frontend
yarn add html-to-image
```

**Version**: Use latest stable (currently v1.11.11)

**No peer dependency issues**: html-to-image works standalone with React 19

### Development Workflow

1. **Create branch** (already done): `001-whatsapp-proof-generator`
2. **Install dependency**: `yarn add html-to-image`
3. **Create page component**: `frontend/src/app/parametrizacao/whatsapp-generator/page.tsx`
4. **Implement core features**:
   - Group name input
   - Participant tabs (add, edit, remove)
   - WhatsApp preview (header + messages)
   - Download button (html-to-image integration)
5. **Add navigation link**: Update parametrizacao layout/nav
6. **Test locally**: `yarn dev` → navigate to `/parametrizacao/whatsapp-generator`
7. **Test screenshot quality**: Download and compare to real WhatsApp
8. **Test edge cases**: Long names, emojis, 20 participants, empty fields
9. **Lint check**: `yarn lint` (no errors)
10. **Create commit**: Follow project commit message style
11. **Optional**: Create PR for review

### Testing Strategy

**No automated tests required** (project uses lint-only testing)

**Manual Testing Checklist**:
- [ ] Group name input updates preview header in real-time
- [ ] Add participant button creates new tab with auto-generated label
- [ ] Remove participant renumbers remaining participants
- [ ] Participant tabs are selectable and independently editable
- [ ] Message bubbles appear in preview with correct styling
- [ ] Timestamps are auto-generated and sequential
- [ ] Download button generates PNG file
- [ ] Downloaded screenshot matches preview visually
- [ ] Screenshot maintains quality on retina displays
- [ ] Browser compatibility (Chrome, Firefox, Safari)
- [ ] Emoji rendering works (system-dependent but functional)
- [ ] Special characters in group name don't break layout
- [ ] Participant limit enforced (20 max)
- [ ] Error messages display for invalid input
- [ ] Success message displays after download

**Performance Testing**:
- [ ] Preview updates <500ms when typing
- [ ] 20 participants don't cause UI lag
- [ ] Screenshot generation completes <5s for 20 participants

**Visual Regression**:
- [ ] Compare generated screenshot to real WhatsApp Web screenshot side-by-side
- [ ] Colors match exactly (use color picker tool)
- [ ] Fonts and spacing match
- [ ] Message bubbles have correct border radius and shadows

### Potential Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Emoji rendering inconsistency across platforms | Medium | Document expected behavior, use system fonts, test on target platforms |
| Screenshot quality degradation on export | High | Use pixelRatio: 2, cacheBust: true, test across browsers |
| Performance issues with 20 participants | Medium | Profile with React DevTools, optimize re-renders, lazy load html-to-image |
| WhatsApp design changes over time | Low | Based on stable design patterns, easy to update Tailwind classes |
| html-to-image Safari compatibility | Low | Library supports Safari with minor restrictions, test early |
| Next.js Image component conflicts | Low | Use standard `<img>` tags in preview area, documented in quickstart |

### Accessibility Considerations

- **Keyboard Navigation**: Radix UI Tabs provides built-in keyboard support (Arrow keys, Tab, Enter)
- **Screen Readers**: ARIA attributes from Radix UI (role="tab", aria-selected, aria-controls)
- **Focus Management**: Tab focus ring on inputs and buttons
- **Labels**: All form inputs have associated `<label>` elements
- **Error Messages**: Use `aria-describedby` for input validation errors
- **Color Contrast**: Preview uses WhatsApp's colors (sufficient contrast for non-functional preview)

**Note**: Preview area is not intended for interactive use - it's a visual representation only. Download button and form inputs are fully accessible.

### Future Enhancements (Out of Scope for MVP)

These are NOT part of the current implementation but documented for future consideration:

1. **Drag-and-drop reordering**: Replace up/down buttons with drag handles (React DnD or dnd-kit)
2. **Preset templates**: Common participant configurations (e.g., "5 happy customers")
3. **Message formatting**: Bold, italic, strikethrough (like WhatsApp Web)
4. **Media attachments**: Image thumbnails, voice message icons (decorative only)
5. **Custom timestamps**: Allow admin to override auto-generated times
6. **Export to multiple formats**: JPEG, WebP, SVG
7. **Screenshot history**: Save generated screenshots to Edge Config for later retrieval
8. **Batch generation**: Create multiple screenshots with different participant sets
9. **A/B testing**: Generate variants with different message orders
10. **Integration with WhatsApp pages**: Pre-fill from existing page configuration

## References

- **Feature Spec**: [spec.md](./spec.md)
- **Research**: [research.md](./research.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/README.md](./contracts/README.md)
- **Quickstart**: [quickstart.md](./quickstart.md)
- **html-to-image**: https://github.com/bubkoo/html-to-image
- **Radix UI Tabs**: https://www.radix-ui.com/docs/primitives/components/tabs
- **WhatsApp Web**: https://web.whatsapp.com/

## Version History

- 2026-01-11: Implementation plan created
  - Phase 0: Research completed (html-to-image library selected)
  - Phase 1: Data model, contracts, quickstart generated
  - Phase 1: Agent context updated
  - Constitution check: PASSED (no violations)
  - Ready for Phase 2: Task breakdown (/speckit.tasks command)
