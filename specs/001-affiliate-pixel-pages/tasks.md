# Tasks: Affiliate Pixel Redirect Pages

**Input**: Design documents from `/specs/001-affiliate-pixel-pages/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are deferred for MVP per user request.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Constitution Alignment**: Include lint/format gates, UX states and accessibility, and performance budget checks. Stop-and-ask protocol: if any implementation doubt arises, halt and ask for clarification; use MCP (Perplexity, Context7) for research before proceeding.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

 - [X] T001 Initialize Next.js App Router project with Yarn/TypeScript in `frontend/`
 - [X] T002 Add Vite sandbox config for components in `frontend/vite.config.ts`
 - [X] T003 Install/configure shadcn/ui with theme tokens in `frontend/components/` and `frontend/tailwind.config.ts`
 - [X] T004 Configure ESLint/Prettier with Node 20/TypeScript rules in `frontend/.eslintrc.*` and `frontend/.prettierrc*`
 - [X] T005 Add environment templates for Edge Config and Meta tokens in `frontend/.env.local.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T006 Create Meta event enum/constants and shared types in `frontend/lib/meta-events.ts`
- [X] T007 Implement Edge Config client helper (read/write) in `frontend/lib/edge-config.ts`
- [X] T008 Add validation schemas for pixel and product payloads in `frontend/lib/validation.ts`
- [X] T009 Scaffold admin layout with persistent side menu items in `frontend/app/(admin)/layout.tsx`
- [X] T010 Document stop-and-ask protocol + MCP (Perplexity, Context7) usage steps in `frontend/DEV_NOTES.md`
- [X] T011 Add lightweight logging utility for edge/admin flows in `frontend/lib/logging.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Configure default pixel tracking (Priority: P1) 🎯 MVP

**Goal**: Admin can register a Facebook Pixel with default Meta events, mark default, and see it suggested in product creation.

**Independent Test**: Save a pixel ID with a default event set and confirm it is stored and automatically suggested on product creation.

### Implementation for User Story 1

- [X] T012 [US1] Implement pixel Edge Config repository (CRUD, default enforcement) in `frontend/lib/repos/pixels.ts`
- [X] T013 [US1] Implement pixel API route (list/upsert) in `frontend/app/api/pixels/route.ts`
- [X] T014 [US1] Build pixel admin page with form (pixelId, label, default flag, default events) in `frontend/app/(admin)/pixels/page.tsx`
- [X] T015 [US1] Add pixel list UI with default indicator and inline validation messages in `frontend/app/(admin)/pixels/page.tsx`
- [X] T016 [US1] Wire default pixel preselection hook for product form consumption in `frontend/lib/hooks/use-default-pixel.ts`

**Checkpoint**: User Story 1 independently functional

---

## Phase 4: User Story 2 - Create affiliate redirect page (Priority: P2)

**Goal**: Admin can create/edit product links with affiliate URL, choose events, pick pixel (default or specific), set active/inactive, and view/share link.

**Independent Test**: Create a product with affiliate URL, selected events, pixel, and active status; verify it appears in the list with a shareable link and correct state.

### Implementation for User Story 2

- [X] T017 [US2] Implement product Edge Config repository (CRUD, slug generation) in `frontend/lib/repos/products.ts`
- [X] T018 [US2] Implement product API route (list/upsert) in `frontend/app/api/products/route.ts`
- [X] T019 [US2] Build product form page (title, affiliateUrl, pixel selection, events multi-select, status toggle) in `frontend/app/(admin)/products/page.tsx`
- [X] T020 [P] [US2] Add product list UI with status badges, pixel/event tags, and copyable transition link in `frontend/app/(admin)/products/page.tsx`
- [X] T021 [US2] Enforce affiliate URL validation (allowed domains, https) and active-state guards in `frontend/lib/validation.ts`

**Checkpoint**: User Story 2 independently functional

---

## Phase 5: User Story 3 - Visitor redirection with tracking (Priority: P3)

**Goal**: Transition link fires selected events via browser pixel + Conversion API with dedup, then redirects to affiliate URL within budget; inactive links show unavailable state and do not fire events.

**Independent Test**: Open transition link, verify configured events are received (pixel + CAPI) and visitor reaches affiliate URL within target time.

### Implementation for User Story 3

- [X] T022 [US3] Implement edge transition route fetching product/pixel config with inactive handling in `frontend/app/t/[slug]/page.tsx`
- [X] T023 [P] [US3] Add Conversion API helper with event_id dedup and timeout in `frontend/lib/conversion-api.ts`
- [X] T024 [US3] Implement client-side event firing + redirect with duplicate guards in `frontend/app/t/[slug]/client.tsx`
- [X] T025 [US3] Render inactive/unavailable state (no events) with accessible messaging in `frontend/app/t/[slug]/page.tsx`
- [X] T026 [US3] Log tracking results and failures to edge logs for observability in `frontend/lib/logging.ts`

**Checkpoint**: User Story 3 independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 Run manual acceptance against spec scenarios (pixels, products, transition) following `specs/001-affiliate-pixel-pages/spec.md`
- [ ] T028 Validate UX/accessibility (focus order, aria labels, empty/loading/error states) in `frontend/app/(admin)/**/*.tsx`
- [ ] T029 Validate performance budgets (transition start ≤2s, redirect ≤3s, admin lists ≤2s) and log timings in `frontend/lib/logging.ts`
- [ ] T030 Verify MCP usage notes and stop-and-ask protocol are visible to contributors in `frontend/DEV_NOTES.md`
- [ ] T031 Update quickstart steps with any new commands in `specs/001-affiliate-pixel-pages/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion; proceed in priority order P1 → P2 → P3
- **Polish (Phase 6)**: Depends on targeted user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Phase 2; no other story dependencies
- **User Story 2 (P2)**: Starts after Phase 2; consumes default pixel from US1 but remains independently testable
- **User Story 3 (P3)**: Starts after Phase 2; uses product/pixel data from US1/US2; implementable once repositories are in place

### Parallel Opportunities

- Phase 1 tasks T002–T005 can run in parallel after T001 scaffolds the project.
- Phase 2 tasks T006–T011 can run in parallel once directories exist.
- US2 list UI (T020) can proceed in parallel with form wiring (T019).
- US3 Conversion API helper (T023) can be built in parallel with transition route UI (T022/T024).

### Parallel Example: User Story 2

```bash
# In parallel:
- [P] T020 Build product list UI in frontend/app/(admin)/products/page.tsx
- [P] T021 Enforce affiliate URL validation in frontend/lib/validation.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Manual check per US1 independent test; if doubts arise, stop and ask using MCP (Perplexity/Context7)
5. Deploy/demo if ready

### Incremental Delivery

1. Foundation ready → add US1 → validate → deploy
2. Add US2 → validate → deploy
3. Add US3 → validate → deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. After Foundation:
   - Dev A: US1 (pixels)
   - Dev B: US2 (products)
   - Dev C: US3 (transition)
3. Integrate and validate each story independently.
