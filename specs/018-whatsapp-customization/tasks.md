# Tasks: WhatsApp Group Customization Features

**Input**: Design documents from `/specs/018-whatsapp-customization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This project does not have automated tests. Manual testing will be performed using the acceptance scenarios from spec.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: All changes in `frontend/` directory
- TypeScript/React/Next.js project structure
- Paths are absolute from repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and prepare for implementation

- [X] T001 Verify Next.js 16.0.7, React 19, TypeScript 5, and Zod 4.1 are installed in frontend/package.json
- [X] T002 Verify current working branch is 018-whatsapp-customization
- [X] T003 [P] Run ESLint to ensure clean baseline: `cd frontend && yarn lint`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation schemas and type extensions that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add groupImageUrlSchema to frontend/src/lib/validation.ts
- [X] T005 [P] Add participantCountSchema to frontend/src/lib/validation.ts
- [X] T006 [P] Add footerEnabledSchema to frontend/src/lib/validation.ts
- [X] T007 Extend whatsAppPageSchema with new fields (groupImageUrl, participantCount, footerEnabled) in frontend/src/lib/validation.ts
- [X] T008 Add groupImageUrl, participantCount, footerEnabled fields to WhatsAppPageRecord type in frontend/src/lib/repos/whatsapp-pages.ts
- [X] T009 Add groupImageUrl, participantCount, footerEnabled optional fields to LegacyWhatsAppPageRecord type in frontend/src/lib/repos/whatsapp-pages.ts
- [X] T010 Update migrateRecord function to set defaults for new fields (groupImageUrl: undefined, participantCount: undefined, footerEnabled: false) in frontend/src/lib/repos/whatsapp-pages.ts
- [X] T011 Update upsertWhatsAppPage function to handle new fields with fallback to existing values in frontend/src/lib/repos/whatsapp-pages.ts
- [X] T012 Run build to verify type changes compile: `cd frontend && yarn build`

**Checkpoint**: Foundation ready - all type definitions and validation schemas are in place. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Custom Group Image Configuration (Priority: P1) 🎯 MVP

**Goal**: Enable admins to configure a custom group image that displays as a circular header profile picture on WhatsApp transition pages

**Independent Test**:
1. Admin pastes image URL in admin form at `/parametrizacao/whatsapp`
2. Save the page
3. Visit `/w/[slug]` and verify circular group image displays at top of page
4. Test validation: paste invalid URL (non-HTTPS or non-image) and verify error message
5. Clear the URL field, save, and verify image no longer displays

### Implementation for User Story 1

- [ ] T013 [P] [US1] Add group image URL input field to admin form in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T014 [P] [US1] Add validation error display for groupImageUrl field in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T015 [P] [US1] Add helper text explaining URL requirements (HTTPS, .jpg/.png/.gif/.webp) in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T016 [US1] Wire up groupImageUrl form field to form state in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T017 [US1] Add groupImageUrl rendering logic (circular image with green border) in frontend/src/app/w/[slug]/client.tsx before headline
- [ ] T018 [US1] Add conditional rendering to only show image if groupImageUrl is defined in frontend/src/app/w/[slug]/client.tsx
- [ ] T019 [US1] Apply Tailwind CSS classes for circular shape (h-24 w-24 rounded-full border-4 border-green-500) in frontend/src/app/w/[slug]/client.tsx

**Checkpoint**: User Story 1 complete. Admin can configure group images, and they display correctly on transition pages. Test all acceptance scenarios before proceeding.

---

## Phase 4: User Story 2 - Custom Participant Count Field (Priority: P1)

**Goal**: Enable admins to set a custom participant count that displays independently from the vacancy counter

**Independent Test**:
1. Admin sets participant count to 247 in admin form at `/parametrizacao/whatsapp`
2. Save the page
3. Visit `/w/[slug]` and verify "247 participantes" displays below headline
4. Test with count = 0: verify no display (conditional rendering)
5. Test with empty field: verify no display
6. Test validation: negative number should show error, decimal should show error, number > 999999 should show error
7. Enable vacancy counter and verify both display independently without interference

### Implementation for User Story 2

- [ ] T020 [P] [US2] Add participant count number input field to admin form in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T021 [P] [US2] Add validation error display for participantCount field in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T022 [P] [US2] Add helper text explaining valid range (0 to 999,999) in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T023 [US2] Wire up participantCount form field to form state (with parseInt handling) in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T024 [US2] Add participantCount rendering logic in frontend/src/app/w/[slug]/client.tsx between headline and subheadline
- [ ] T025 [US2] Add conditional rendering to only show if participantCount > 0 in frontend/src/app/w/[slug]/client.tsx
- [ ] T026 [US2] Format participant count with toLocaleString('pt-BR') for thousands separator in frontend/src/app/w/[slug]/client.tsx
- [ ] T027 [US2] Apply Tailwind CSS classes for styling (text-sm text-gray-500 mt-1) in frontend/src/app/w/[slug]/client.tsx

**Checkpoint**: User Story 2 complete. Admin can set participant counts, and they display correctly with proper formatting. Both US1 and US2 should work independently.

---

## Phase 5: User Story 3 - WhatsApp-Style Interactive Footer (Priority: P2)

**Goal**: Add a WhatsApp-style footer with text input and send button that triggers WhatsApp redirect

**Independent Test**:
1. Admin checks "Exibir footer estilo WhatsApp" in admin form at `/parametrizacao/whatsapp`
2. Save the page
3. Visit `/w/[slug]` on desktop and verify footer appears at bottom with input and send button
4. Click input field and verify it receives focus
5. Type text in input and verify it appears
6. Click send button and verify redirect to WhatsApp URL
7. Reload page, focus input, press Enter key and verify redirect to WhatsApp URL
8. Test on mobile: verify footer stays fixed at bottom, remains accessible
9. Test with footer disabled: verify no footer displays

### Implementation for User Story 3

- [ ] T028 [P] [US3] Create WhatsAppFooter component in frontend/src/components/whatsapp-footer.tsx
- [ ] T029 [P] [US3] Add WhatsAppFooterProps interface (onSendClick, placeholder, className) in frontend/src/components/whatsapp-footer.tsx
- [ ] T030 [US3] Implement input field with state management in frontend/src/components/whatsapp-footer.tsx
- [ ] T031 [US3] Implement send button with SendHorizontal icon from lucide-react in frontend/src/components/whatsapp-footer.tsx
- [ ] T032 [US3] Add Enter key handler to trigger onSendClick in frontend/src/components/whatsapp-footer.tsx
- [ ] T033 [US3] Apply Tailwind CSS for fixed bottom positioning and responsive layout in frontend/src/components/whatsapp-footer.tsx
- [ ] T034 [US3] Apply green theme colors (bg-green-500, hover:bg-green-600) matching site design in frontend/src/components/whatsapp-footer.tsx
- [ ] T035 [P] [US3] Add footer enabled checkbox to admin form in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T036 [P] [US3] Add helper text explaining footer functionality in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T037 [US3] Wire up footerEnabled checkbox to form state in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [ ] T038 [US3] Import WhatsAppFooter component in frontend/src/app/w/[slug]/client.tsx
- [ ] T039 [US3] Add WhatsAppFooter rendering with conditional (only if footerEnabled) at end of main element in frontend/src/app/w/[slug]/client.tsx
- [ ] T040 [US3] Pass handleButtonClick as onSendClick prop to reuse existing redirect logic in frontend/src/app/w/[slug]/client.tsx

**Checkpoint**: All three user stories complete. Each should be independently functional. Test all features together to ensure no conflicts.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup across all features

- [ ] T041 [P] Test backward compatibility: visit existing WhatsApp pages (created before this feature) and verify they work without errors
- [ ] T042 [P] Test all features enabled simultaneously: group image + participant count + footer on same page
- [ ] T043 Test mobile responsiveness: verify all features work on screens 320px-768px-1024px widths
- [ ] T044 Test edge cases from spec.md: very large image URLs, count = 0, count > 999999, invalid URLs, negative counts
- [ ] T045 Test validation error messages are in Portuguese and match design (HTTPS requirement, image format requirement, number range)
- [ ] T046 [P] Run ESLint and fix any linting errors: `cd frontend && yarn lint`
- [ ] T047 Run production build and verify no errors: `cd frontend && yarn build`
- [ ] T048 Manual performance test: verify page load time increase is < 200ms with all features enabled
- [ ] T049 [P] Update CLAUDE.md if any additional patterns or learnings emerged during implementation (optional)
- [ ] T050 Review quickstart.md and verify all implementation steps were followed correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P1 → P2)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories, independent from US1
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories, independent from US1/US2

**Independence Verified**: Each user story modifies different parts of the UI and can be tested separately:
- US1: Group image display (top of page)
- US2: Participant count display (between headline and subheadline)
- US3: Footer component (bottom of page)

### Within Each User Story

**User Story 1 (Group Image)**:
- T013-T015 can run in parallel (all modify admin form, different sections)
- T016 must complete before T017-T019 (form state needed for display logic)
- T017-T019 sequential (same file modifications)

**User Story 2 (Participant Count)**:
- T020-T022 can run in parallel (all modify admin form, different sections)
- T023 must complete before T024-T027 (form state needed for display logic)
- T024-T027 sequential (same file modifications)

**User Story 3 (Footer)**:
- T028-T034 sequential (creating single component file)
- T035-T037 can run in parallel with T028-T034 (different files)
- T038-T040 sequential after T028 completes (need component to import)

### Parallel Opportunities

**Within Foundational Phase**:
- T005-T006 can run in parallel (different schemas in same file, but simple additions)
- After T004-T007 complete, T008-T011 can proceed

**Across User Stories** (if multiple developers):
- Once Phase 2 completes, all three user stories can start simultaneously:
  - Developer A: US1 (T013-T019)
  - Developer B: US2 (T020-T027)
  - Developer C: US3 (T028-T040)

**Within Polish Phase**:
- T041-T042, T046, T049-T050 can run in parallel (different concerns)

---

## Parallel Example: Foundational Phase

```bash
# After T004 completes, launch these together:
Task T005: "Add participantCountSchema to frontend/src/lib/validation.ts"
Task T006: "Add footerEnabledSchema to frontend/src/lib/validation.ts"
```

## Parallel Example: User Story 1

```bash
# Launch admin form tasks together:
Task T013: "Add group image URL input field to admin form"
Task T014: "Add validation error display for groupImageUrl"
Task T015: "Add helper text explaining URL requirements"
```

## Parallel Example: User Story 3

```bash
# Work on component and admin form simultaneously:
Developer A:
Task T028-T034: "Create and implement WhatsAppFooter component"

Developer B (in parallel):
Task T035: "Add footer enabled checkbox to admin form"
Task T036: "Add helper text explaining footer functionality"
Task T037: "Wire up footerEnabled checkbox to form state"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

Both User Story 1 and User Story 2 are Priority P1 and provide core value:

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T012) - CRITICAL blocker
3. Complete Phase 3: User Story 1 (T013-T019) - Group images
4. Complete Phase 4: User Story 2 (T020-T027) - Participant count
5. **STOP and VALIDATE**: Test both US1 and US2 independently
6. Run basic polish tasks (T041-T047)
7. Deploy/demo MVP with two core features

**MVP Scope**: Group image + Participant count (29 tasks total)

### Full Feature Delivery

1. Complete MVP (Phases 1-4)
2. Add Phase 5: User Story 3 (T028-T040) - WhatsApp footer
3. Complete Phase 6: Full polish (T041-T050)
4. Deploy complete feature set

**Full Scope**: All three features (50 tasks total)

### Parallel Team Strategy

With 3 developers available:

1. **Team completes Foundational together** (Phases 1-2, T001-T012)
2. **Once T012 (build verification) passes**:
   - Developer A: User Story 1 (T013-T019) - 7 tasks
   - Developer B: User Story 2 (T020-T027) - 8 tasks
   - Developer C: User Story 3 (T028-T040) - 13 tasks
3. **Converge for Polish** (Phase 6, T041-T050)
4. All stories integrate cleanly (no conflicts - different UI sections)

**Estimated Time**:
- Setup + Foundational: 1-2 hours (team effort)
- User Stories (parallel): 1.5-2 hours each (6 hours total if sequential, 2 hours if parallel)
- Polish: 1 hour (team effort)
- **Total: 4-6 hours sequential, 4-5 hours with 3 developers in parallel**

---

## Notes

- **No automated tests**: This project uses ESLint only. All testing is manual per acceptance scenarios in spec.md
- **[P] marker**: Indicates tasks that can run in parallel (different files or independent sections)
- **[Story] label**: Maps each task to its user story for traceability
- **File paths**: All paths are absolute from repository root
- **Backward compatibility**: T041 verifies existing pages work without modification
- **Edge Runtime**: All code must be Edge Runtime compatible (no Node.js APIs in /w/[slug])
- **Mobile-first**: T043 verifies responsive design on all screen sizes
- **Performance**: T048 validates <200ms load time increase requirement
- **Validation**: All error messages must be in Portuguese (T045)
- **Build verification**: T012 and T047 ensure TypeScript compilation succeeds

---

## Success Metrics

Based on spec.md success criteria:

- **SC-001**: Admin form completion < 30 seconds (verify during T041-T042)
- **SC-002**: Images display on mobile/tablet/desktop (verify during T043)
- **SC-003**: Participant count updates without >2s delay (verify during T042)
- **SC-004**: Footer works in Chrome/Safari/Firefox/Edge (verify during T043)
- **SC-005**: Footer redirect 99%+ success rate (verify during T042)
- **SC-006**: Page load time < 200ms increase (verify during T048)
- **SC-007**: Image upload (URL paste) 95%+ success (verify during T041)
- **SC-008**: Admin form < 3 minutes completion (verify during T041-T042)

All metrics should be validated during Phase 6 (Polish) testing.
