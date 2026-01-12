# Tasks: WhatsApp Group Social Proof Image Generator

**Input**: Design documents from `/specs/001-whatsapp-proof-generator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No automated tests requested - feature uses existing ESLint checks only. Manual testing checklist included in plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/app/`, `frontend/src/components/`, `frontend/src/lib/`
- This is a Next.js 16 frontend-only feature with no backend changes

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and prepare project structure

- [x] T001 Install html-to-image dependency in frontend/package.json via yarn
- [x] T002 [P] Create feature directory structure at frontend/src/app/parametrizacao/whatsapp-generator/
- [x] T003 [P] Verify existing shadcn/ui components (Button, Tabs) are available in frontend/src/components/ui/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create TypeScript interfaces for WhatsAppScreenshot and Participant in frontend/src/app/parametrizacao/whatsapp-generator/types.ts
- [x] T005 [P] Implement generateTimestamp helper function in frontend/src/app/parametrizacao/whatsapp-generator/types.ts
- [x] T006 [P] Implement generateFilename helper function in frontend/src/app/parametrizacao/whatsapp-generator/types.ts
- [x] T007 Create base page component structure at frontend/src/app/parametrizacao/whatsapp-generator/page.tsx with "use client" directive

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create WhatsApp Group Screenshot with Group Name (Priority: P1) 🎯 MVP

**Goal**: Admin can navigate to new tab, enter group name, and see WhatsApp-style header preview

**Independent Test**: Navigate to /parametrizacao/whatsapp-generator, enter "Grupo VIP Shopee" in group name field, verify WhatsApp header appears with green background (#075e54), group name displayed, and participant count shown

### Implementation for User Story 1

- [x] T008 [P] [US1] Implement group name state management (useState) in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T009 [P] [US1] Create group name input field with label and placeholder in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T010 [US1] Implement WhatsApp header preview component with green background, group icon placeholder, group name display, and participant count
- [x] T011 [US1] Add real-time preview update when group name changes (controlled input pattern)
- [x] T012 [US1] Apply WhatsApp visual styling: #075e54 header background, white text, system-ui font family, correct spacing
- [x] T013 [US1] Add validation for group name (max 100 characters) with character counter
- [x] T014 [US1] Create screenshotRef using useRef for html-to-image capture target

**Checkpoint**: User Story 1 complete - admin can create WhatsApp header preview with group name

---

## Phase 4: User Story 2 - Add Multiple Participant Messages (Priority: P2)

**Goal**: Admin can add multiple participants with messages and see them in WhatsApp chat format

**Independent Test**: Create group with name, click "Adicionar pessoa" twice, enter names and messages for "pessoa 1" and "pessoa 2", verify both messages appear in WhatsApp chat preview with correct styling, timestamps, and order

### Implementation for User Story 2

- [x] T015 [P] [US2] Implement participants state management (useState<Participant[]>) in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T016 [P] [US2] Implement selectedParticipantId state for tab selection in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T017 [US2] Create addParticipant function with crypto.randomUUID(), auto-generated label, timestamp, and order in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T018 [US2] Implement Tabs component with TabsList and TabsTrigger for each participant in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T019 [US2] Create participant form within TabsContent: name input (optional, max 50 chars) and message textarea (required, max 500 chars)
- [x] T020 [US2] Implement updateParticipant function to handle name and message changes in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T021 [US2] Create WhatsApp message bubble component in preview: white background, rounded corners, participant name (if provided), message text, timestamp
- [x] T022 [US2] Render all participants' messages in chat preview area with correct order (based on order field)
- [x] T023 [US2] Apply WhatsApp message styling: #ffffff bubble background, shadow, proper padding, 80% max-width, left alignment
- [x] T024 [US2] Add "Adicionar pessoa" button with disable logic at 20 participants maximum
- [x] T025 [US2] Add empty state message in preview when no participants exist
- [x] T026 [US2] Ensure timestamps are auto-generated and incremental (10:30, 10:31, 10:32, etc.)

**Checkpoint**: User Stories 1 AND 2 complete - admin can create full WhatsApp group chat with multiple messages

---

## Phase 5: User Story 3 - Remove and Reorder Participants (Priority: P3)

**Goal**: Admin can remove participants and reorder messages to craft compelling social proof

**Independent Test**: Create 3 participants, click remove on "pessoa 2", verify "pessoa 3" becomes "pessoa 2" and chat updates. Create 3 new participants, use up/down arrows to reorder, verify message order changes in preview

### Implementation for User Story 3

- [ ] T027 [P] [US3] Implement removeParticipant function with renumbering logic in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [ ] T028 [P] [US3] Add "Remover" button in each participant's TabsContent in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [ ] T029 [US3] Implement selectedParticipantId update when removing currently selected participant
- [ ] T030 [US3] Implement moveParticipant function (direction: 'up' | 'down') with order recalculation in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [ ] T031 [US3] Add up/down arrow buttons in participant form with disabled states at boundaries
- [ ] T032 [US3] Update timestamps after reordering to maintain sequential flow
- [ ] T033 [US3] Ensure preview updates immediately when participants are removed or reordered

**Checkpoint**: User Stories 1, 2, AND 3 complete - admin has full participant management capabilities

---

## Phase 6: User Story 4 - Download WhatsApp Screenshot (Priority: P1)

**Goal**: Admin can export generated screenshot as high-quality PNG image

**Independent Test**: Create complete screenshot with group name and 2+ participants, click "Download" button, verify PNG file downloads with filename "whatsapp-[group-name]-[date].png" and image matches preview exactly

### Implementation for User Story 4

- [x] T034 [P] [US4] Import toPng from html-to-image library in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T035 [P] [US4] Implement error and success state management (useState) in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T036 [US4] Create downloadScreenshot async function with useCallback hook in frontend/src/app/parametrizacao/whatsapp-generator/page.tsx
- [x] T037 [US4] Add validation before download: group name required, at least 1 participant with message
- [x] T038 [US4] Implement html-to-image toPng call with options: cacheBust: true, pixelRatio: 2, backgroundColor: '#e5ddd5'
- [x] T039 [US4] Generate filename using generateFilename helper (whatsapp-[sanitized-group-name]-[date].png)
- [x] T040 [US4] Create download link element with dataUrl, trigger click, and cleanup
- [x] T041 [US4] Add error handling with try-catch and setError for user feedback
- [x] T042 [US4] Add success message with setTimeout auto-clear after 3 seconds
- [x] T043 [US4] Create "Download Screenshot" button with disabled state during generation
- [x] T044 [US4] Display error and success messages in UI with appropriate styling (destructive/green)

**Checkpoint**: All core user stories complete - full WhatsApp screenshot generator is functional

---

## Phase 7: Integration & Navigation

**Purpose**: Integrate generator into admin panel navigation

- [x] T045 Add "Gerador de Provas de Whatsapp" navigation link to frontend/src/app/parametrizacao/ layout or navigation component
- [x] T046 Ensure navigation link appears after "Páginas WhatsApp" in admin menu
- [x] T047 Test navigation flow: click link, verify page loads correctly, verify back navigation works

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Refinements and edge case handling

- [ ] T048 [P] Add WhatsApp chat background (#e5ddd5) to preview container
- [ ] T049 [P] Add responsive layout: two-column on desktop (editor | preview), single-column on mobile
- [ ] T050 [P] Implement page header with title "Gerador de Provas de Whatsapp" and description
- [ ] T051 [P] Add character counters for group name (100), participant name (50), message (500)
- [ ] T052 Handle edge case: extremely long group name (truncate in header if needed)
- [ ] T053 Handle edge case: special characters and emojis in group name and messages (test rendering)
- [ ] T054 Handle edge case: empty participant messages (show validation, prevent empty bubbles)
- [ ] T055 Add loading state during screenshot generation (disable button, show spinner)
- [ ] T056 Test with 20 participants to verify performance (<5s generation time)
- [ ] T057 Test browser compatibility: Chrome, Firefox, Safari (verify emoji rendering)
- [ ] T058 Run ESLint checks: yarn lint in frontend/ directory
- [ ] T059 Manual testing per quickstart.md checklist (navigation, input, preview, download, quality)
- [ ] T060 Visual regression test: compare generated screenshot to real WhatsApp Web side-by-side

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories CAN proceed in parallel (if multiple developers)
  - OR sequentially in priority order: US1 (P1) → US2 (P2) → US3 (P3) → US4 (P1)
  - **Recommended MVP**: US1 + US2 + US4 (skip US3 initially if time-constrained)
- **Integration (Phase 7)**: Depends on at least US1 completion (navigation needs page to link to)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Enhances US2 but independently testable
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Requires preview from US1/US2 but independently testable

**Note**: While US2 builds on US1's preview component, and US4 requires a preview to download, each story is designed to be independently testable. You can test US2 by creating participants without US1 being complete (just hardcode a group name). Similarly, US4 can be tested by creating a mock preview element.

### Within Each User Story

- State management before UI components
- Input fields before preview components
- Preview components before download functionality
- Validation before user actions
- Core implementation before edge case handling

### Parallel Opportunities

- **Phase 1 (Setup)**: All 3 tasks can run in parallel
- **Phase 2 (Foundational)**: T005 and T006 can run in parallel (helper functions), T004 and T007 sequential
- **Phase 3 (US1)**: T008, T009, T013, T014 can run in parallel (different concerns)
- **Phase 4 (US2)**: T015, T016 can run in parallel (state setup)
- **Phase 5 (US3)**: T027, T028 can run in parallel (different functions)
- **Phase 6 (US4)**: T034, T035 can run in parallel (imports and state)
- **Phase 8 (Polish)**: T048, T049, T050, T051 can all run in parallel (independent enhancements)

**Maximum Parallelization**: With 4 developers after Foundational phase completes:
- Developer A: US1 (Phase 3)
- Developer B: US2 (Phase 4)
- Developer C: US3 (Phase 5)
- Developer D: US4 (Phase 6)

Then all converge for Integration (Phase 7) and Polish (Phase 8).

---

## Parallel Example: User Story 1

```bash
# Launch parallel tasks for US1 after foundational phase:
# All independent, different concerns:
Task T008: "Implement group name state management in page.tsx"
Task T009: "Create group name input field in page.tsx"
Task T013: "Add validation for group name with character counter"
Task T014: "Create screenshotRef using useRef"

# Sequential dependency:
# T010 (WhatsApp header component) needs T008 (state) to be complete
# T011 (real-time update) needs T009 (input) and T010 (preview) to be complete
# T012 (styling) needs T010 (component structure) to be complete
```

---

## Parallel Example: User Story 2

```bash
# Launch parallel tasks for US2:
Task T015: "Implement participants state management"
Task T016: "Implement selectedParticipantId state"

# After state setup complete, can parallelize:
Task T017: "Create addParticipant function"
Task T018: "Implement Tabs component structure"

# Message bubble styling can be done in parallel with form:
Task T019: "Create participant form (TabsContent)"
Task T021: "Create WhatsApp message bubble component"
Task T023: "Apply WhatsApp message styling"
```

---

## Implementation Strategy

### MVP First (Minimum Viable Product)

**Recommended MVP Scope**: User Stories 1 + 2 + 4 (skip US3 for initial release)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - CRITICAL
3. Complete Phase 3: User Story 1 (T008-T014) - Basic header preview
4. Complete Phase 4: User Story 2 (T015-T026) - Add participants and messages
5. Complete Phase 6: User Story 4 (T034-T044) - Download functionality
6. Complete Phase 7: Integration (T045-T047) - Add to admin nav
7. **STOP and VALIDATE**: Test complete workflow end-to-end
8. Deploy MVP - admins can now create WhatsApp screenshots (without reordering)
9. Later: Add Phase 5 (User Story 3) for reordering capability

**Why skip US3 initially?**
- US3 (remove/reorder) is nice-to-have, not essential for core functionality
- Admins can still create effective social proof without reordering
- Reduces MVP scope by 7 tasks (T027-T033)
- Can be added as v1.1 feature after MVP validation

### Incremental Delivery

1. **Foundation** (Phases 1-2): Setup + Foundational → Can't test yet, but foundation is ready
2. **MVP v1.0** (US1 + US2 + US4): Admin can create and download screenshots → Deploy and demo
3. **Enhancement v1.1** (US3): Add remove/reorder → Deploy update
4. **Polish v1.2** (Phase 8): Edge cases, performance, visual refinements → Deploy update

Each version delivers working, valuable functionality.

### Parallel Team Strategy

With 2 developers (recommended for MVP):

1. **Both**: Complete Setup + Foundational together (Phases 1-2)
2. Once Foundational is done:
   - **Developer A**: User Story 1 (Phase 3) - Header and group name
   - **Developer B**: User Story 2 (Phase 4) - Participants and messages
3. **Both**: User Story 4 (Phase 6) - Download functionality (depends on US1+US2 preview)
4. **Developer A**: Integration (Phase 7)
5. **Both**: Polish (Phase 8) - split edge cases

With 4 developers (maximum parallelization):

1. **All**: Setup + Foundational (Phases 1-2)
2. **After foundational**:
   - **Developer A**: US1 (Phase 3)
   - **Developer B**: US2 (Phase 4)
   - **Developer C**: US3 (Phase 5)
   - **Developer D**: US4 (Phase 6)
3. **All converge**: Integration (Phase 7) + Polish (Phase 8)

---

## Task Count Summary

- **Total Tasks**: 60
- **Setup (Phase 1)**: 3 tasks
- **Foundational (Phase 2)**: 4 tasks
- **User Story 1 (Phase 3)**: 7 tasks
- **User Story 2 (Phase 4)**: 12 tasks
- **User Story 3 (Phase 5)**: 7 tasks
- **User Story 4 (Phase 6)**: 11 tasks
- **Integration (Phase 7)**: 3 tasks
- **Polish (Phase 8)**: 13 tasks

**Parallel Opportunities**: 19 tasks marked [P] (can run concurrently with other tasks)

**MVP Scope**: 40 tasks (excludes US3's 7 tasks and some polish tasks)

---

## Independent Test Criteria by User Story

### User Story 1 Test
- [ ] Navigate to /parametrizacao/whatsapp-generator
- [ ] Empty generator interface appears
- [ ] Enter "Grupo VIP Shopee" in group name field
- [ ] WhatsApp header appears with green background (#075e54)
- [ ] Group name "Grupo VIP Shopee" displays in header
- [ ] Participant count shows "0 participantes"
- [ ] Header includes circular group icon placeholder
- [ ] Font is system-ui or similar
- [ ] Preview updates in real-time as group name changes

### User Story 2 Test
- [ ] Click "Adicionar pessoa" button
- [ ] New tab appears labeled "pessoa 1"
- [ ] Form appears with name and message inputs
- [ ] Enter name "Maria" and message "Acabei de entrar!"
- [ ] Message bubble appears in preview with white background
- [ ] Message shows participant name "Maria" and text
- [ ] Timestamp "10:30" appears on message
- [ ] Click "Adicionar pessoa" again
- [ ] New tab "pessoa 2" appears
- [ ] Enter name "João" and message "Bem-vinda!"
- [ ] Second message appears below first in preview
- [ ] Timestamp "10:31" appears on second message
- [ ] Switch between tabs to edit each participant
- [ ] Preview shows both messages in correct order

### User Story 3 Test
- [ ] Create 3 participants with messages
- [ ] Click remove on "pessoa 2"
- [ ] "pessoa 3" becomes "pessoa 2" in tab label
- [ ] Preview updates to show 2 messages
- [ ] Create 3 new participants
- [ ] Click up arrow on "pessoa 2"
- [ ] "pessoa 2" and "pessoa 1" swap positions
- [ ] Preview shows messages in new order
- [ ] Timestamps update to maintain sequence

### User Story 4 Test
- [ ] Create group with name "Grupo Teste"
- [ ] Add 2 participants with messages
- [ ] Click "Download Screenshot" button
- [ ] PNG file downloads to device
- [ ] Filename is "whatsapp-grupo-teste-2026-01-11.png"
- [ ] Open downloaded image
- [ ] Image matches preview exactly
- [ ] Image is high quality (no blurriness on retina display)
- [ ] Success message appears after download
- [ ] Image can be used on landing page

---

## Notes

- [P] tasks = different files or independent concerns, no blocking dependencies
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No automated tests requested - manual testing via quickstart.md checklist
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **CRITICAL**: Use standard `<img>` tags in preview, NOT Next.js Image component (html-to-image incompatibility)
- All file paths are absolute based on repository root
- Feature is purely frontend - no backend API changes
