# Implementation Plan: WhatsApp Group Customization Features

**Branch**: `018-whatsapp-customization` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/018-whatsapp-customization/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add three customization features to WhatsApp group transition pages: (1) custom group profile image upload, (2) configurable participant count display independent of vacancy counter, and (3) WhatsApp-style interactive footer with text input and send button. All features extend the existing WhatsAppPageRecord data model and integrate with the current admin panel at `/parametrizacao/whatsapp`. Implementation reuses existing patterns: Edge Config storage, Zod validation, shadcn/ui components, and Meta Pixel tracking.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - pattern: index + individual records
**Testing**: ESLint (lint), manual testing (no automated tests currently)
**Target Platform**: Web (Edge Runtime for /w/[slug] pages, Node.js for admin)
**Project Type**: Web application (frontend + backend server actions)
**Performance Goals**: <200ms additional page load time with all features enabled, <2s admin save operations
**Constraints**: Edge Runtime compatibility (no Node.js APIs in /w/[slug]), backward compatibility with existing pages, mobile-first responsive design
**Scale/Scope**: 3 new optional fields in WhatsAppPageRecord, 1 new UI component (WhatsAppFooter), admin form extensions, image upload handling (NEEDS CLARIFICATION: storage mechanism)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASSED (No constitution defined - lightweight check applied)

Since the project constitution file is using template placeholders, applying lightweight validation:

- ✅ **Backward Compatibility**: All new fields are optional, existing pages continue to work
- ✅ **Existing Patterns**: Reuses established patterns (Edge Config, Zod schemas, server actions, shadcn/ui)
- ✅ **No Breaking Changes**: Extends WhatsAppPageRecord without modifying existing fields
- ✅ **Technology Consistency**: Uses existing stack (TypeScript, Next.js, React, Tailwind)
- ✅ **Mobile-First Design**: Follows existing responsive design patterns
- ⚠️ **Testing**: No automated tests (matches current project state - ESLint only)

**Re-evaluation after Phase 1**: Will verify data model changes maintain backward compatibility and migration is properly handled.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/whatsapp/  # Admin panel (will be modified)
│   │   │   └── page.tsx              # WhatsApp admin form - add new fields
│   │   └── w/[slug]/                 # Transition pages (will be modified)
│   │       ├── page.tsx              # Server component - pass new data
│   │       └── client.tsx            # Client component - render features
│   ├── components/
│   │   ├── ui/                       # shadcn components (existing)
│   │   └── whatsapp-footer.tsx       # NEW: WhatsApp-style footer component
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts     # Extend WhatsAppPageRecord type
│       └── validation.ts             # Add new Zod schemas for new fields
└── package.json
```

**Structure Decision**: Web application structure. All changes are in `frontend/` directory. This feature extends the existing WhatsApp page system by:
1. Adding new optional fields to the WhatsAppPageRecord type in `lib/repos/whatsapp-pages.ts`
2. Extending Zod validation schemas in `lib/validation.ts` for new fields
3. Creating a new reusable component `components/whatsapp-footer.tsx`
4. Modifying the admin form in `app/parametrizacao/whatsapp/page.tsx` to support new fields
5. Updating the client component in `app/w/[slug]/client.tsx` to render new features

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**Status**: N/A - No violations detected. All changes follow existing patterns and maintain simplicity.

---

## Phase 0: Research & Decisions

**Status**: ✅ COMPLETED

**Output**: `research.md`

**Key Decisions**:
1. **Image Storage**: External URLs (paste URL pattern) - matches existing headerImageUrl approach
2. **Participant Display**: Simple text below headline - subtle social proof without UI clutter
3. **Footer Design**: Themed green variation - familiar but branded, avoids trademark issues
4. **Validation**: HTTPS URLs, integer 0-999999, Portuguese error messages

**All technical unknowns resolved** - no additional research needed.

---

## Phase 1: Design & Contracts

**Status**: ✅ COMPLETED

**Outputs**:
- `data-model.md` - Complete data structures and validation rules
- `contracts/types.ts` - TypeScript type definitions
- `contracts/validation-schemas.ts` - Zod validation schemas
- `contracts/component-api.md` - Component interface specifications
- `quickstart.md` - Developer implementation guide
- `CLAUDE.md` - Updated with new technology stack

**Data Model Changes**:
- Extended `WhatsAppPageRecord` with 3 new optional fields
- Added `groupImageUrlSchema`, `participantCountSchema`, `footerEnabledSchema`
- Created `LegacyWhatsAppPageRecord` type for backward compatibility
- Defined migration function defaults

**Component Contracts**:
- `WhatsAppFooter` - New component with defined props and behavior
- `WhatsAppRedirectClient` - Extended to render new features
- Admin form - Extended with 3 new input fields

**Agent Context Updated**: Added technology stack to CLAUDE.md

---

## Constitution Re-evaluation (Post Phase 1)

**Status**: ✅ PASSED - All checks maintained after design phase

**Design Validation**:
- ✅ **Backward Compatibility**: Migration function ensures all existing records work with defaults
- ✅ **Existing Patterns**: Data model follows Edge Config index + records pattern exactly
- ✅ **No Breaking Changes**: All changes are additive (3 optional fields added, 0 fields removed/changed)
- ✅ **Technology Consistency**: Uses only existing dependencies (Zod, React, Tailwind, lucide-react)
- ✅ **Mobile-First Design**: Footer component uses fixed positioning with responsive Tailwind classes
- ✅ **Simplicity**: No new abstractions introduced, reuses existing validation and component patterns

**Data Model Impact**:
- Storage increase: ~50-200 bytes per record (negligible)
- Migration: Runtime only, no scripts needed
- Breaking changes: Zero
- New dependencies: Zero

**Ready for Phase 2** (Task Generation via `/speckit.tasks`)

---

## Artifacts Summary

### Generated Files

**Phase 0 (Research)**:
- ✅ `research.md` - Technical decisions and alternatives analysis

**Phase 1 (Design)**:
- ✅ `data-model.md` - Complete data structures
- ✅ `contracts/types.ts` - TypeScript type contracts
- ✅ `contracts/validation-schemas.ts` - Zod validation contracts
- ✅ `contracts/component-api.md` - Component API specifications
- ✅ `quickstart.md` - Developer implementation guide

**Updated Files**:
- ✅ `CLAUDE.md` - Agent context updated with stack info

**Files to Modify (in implementation)**:
1. `frontend/src/lib/validation.ts` - Add 3 Zod schemas
2. `frontend/src/lib/repos/whatsapp-pages.ts` - Extend types, add migration
3. `frontend/src/components/whatsapp-footer.tsx` - Create new component
4. `frontend/src/app/w/[slug]/client.tsx` - Add rendering logic
5. `frontend/src/app/parametrizacao/whatsapp/page.tsx` - Add form fields

### Next Steps

**Ready for**:
- `/speckit.tasks` - Generate implementation tasks breakdown
- `/speckit.implement` - Execute implementation (after tasks created)

**Not included in this plan**:
- Automated tests (project has no test framework currently)
- CI/CD updates (no changes needed)
- Database migrations (runtime migration only)
- Documentation updates beyond CLAUDE.md (feature is self-contained)
