# Tasks: Delete existing products from edge/pixel configs

**Input**: Design documents from `/specs/002-delete-products/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment, tooling, and baseline quality gates

- [X] T001 Review spec and plan at `specs/002-delete-products/spec.md` and `specs/002-delete-products/plan.md` to align scope and priorities
- [X] T002 Validate dependencies are installed per `frontend/package.json` (npm install if needed) in `frontend/`
- [X] T003 [P] Run baseline quality gates (`npm test && npm run lint`) from `frontend/` to ensure clean starting point

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared validation and confirmation utility leveraged by all stories

- [X] T004 Align delete-related validation/state rules from `specs/002-delete-products/data-model.md` in `frontend/src/lib/validation.ts` (ensure productId required, irreversible status)
- [X] T005 [P] Create shared confirmation hook/utility for destructive actions in `frontend/src/lib/hooks/useConfirmDelete.ts` to be reused by product and pixel pages

---

## Phase 3: User Story 1 - Remove product from edge configuration list (Priority: P1) 🎯 MVP

**Goal**: Operators can delete a product from edge configuration with confirmation and see immediate list/config update

**Independent Test**: Trigger delete on a product in `frontend/src/app/admin/products/page.tsx`, confirm; product disappears from list and edge config export, other products unaffected. On failure, error shown and item remains.

### Implementation

### Implementation

- [X] T006 [P] [US1] Implement product delete operation with success/failure telemetry in `frontend/src/lib/repos/products.ts` and `frontend/src/app/api/products/[id]/route.ts`
- [X] T007 [US1] Wire delete control with confirmation flow for edge products in `frontend/src/app/admin/products/page.tsx` using `useConfirmDelete`
- [X] T008 [P] [US1] Handle success/error/empty-state UI updates and list refresh in `frontend/src/app/admin/products/page.tsx`
- [X] T009 [US1] Add delete action logging/metrics for edge removals in `frontend/src/lib/logging.ts` to measure latency and outcomes

---

## Phase 4: User Story 2 - Remove product from pixel tracking setup (Priority: P2)

**Goal**: Operators can delete a product from pixel tracking so no further events fire for that product

**Independent Test**: Delete a product in `frontend/src/app/admin/pixels/page.tsx`; entry disappears from pixel config output, no new events for that product, errors leave list unchanged.

### Implementation

### Implementation

- [X] T010 [P] [US2] Implement pixel delete operation with permission/error handling in `frontend/src/lib/repos/pixels.ts` and `frontend/src/app/api/pixels/[id]/route.ts`
- [X] T011 [US2] Wire delete control with confirmation flow for pixel products in `frontend/src/app/admin/pixels/page.tsx` using `useConfirmDelete`
- [X] T012 [P] [US2] Refresh pixel list state and derived counts after delete, ensuring no stale entries remain, in `frontend/src/app/admin/pixels/page.tsx`
- [X] T013 [US2] Add delete logging/metrics for pixel removals in `frontend/src/lib/logging.ts` to verify success/failure rates

---

## Phase 5: User Story 3 - Prevent accidental deletions (Priority: P3)

**Goal**: Provide reassurance and safe cancellation to avoid unintended removals

**Independent Test**: Initiate delete on product/pixel, cancel in confirmation; focus returns to trigger; no config changes. Offline/timeout keeps item intact with retry messaging.

### Implementation

### Implementation

- [X] T014 [P] [US3] Build accessible shared delete confirmation component (labels, focus trap, keyboard) in `frontend/src/components/delete-confirmation.tsx` leveraging `useConfirmDelete`
- [X] T015 [US3] Apply confirmation/cancel flow to both product and pixel pages (`frontend/src/app/admin/products/page.tsx`, `frontend/src/app/admin/pixels/page.tsx`) ensuring focus restoration after cancel
- [X] T016 [P] [US3] Add offline/timeout error handling and retry affordance for delete actions in `frontend/src/app/admin/products/page.tsx` and `frontend/src/app/admin/pixels/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T017 [P] Update quickstart verification steps with delete flows in `specs/002-delete-products/quickstart.md`
- [X] T018 Validate performance/observability against budgets (UI <2s, backend p95 <300ms) and document metrics hooks in `frontend/src/lib/logging.ts`
- [X] T019 Re-run full quality gates (`npm test && npm run lint`) from `frontend/` after implementation and capture results

---

## Dependencies & Execution Order

- Setup (Phase 1) → Foundational (Phase 2) → US1 (Phase 3) → US2 (Phase 4) → US3 (Phase 5) → Polish (Phase 6)
- User Story priority order: P1 (US1) → P2 (US2) → P3 (US3); US2 can start after shared hook (T005) even if US1 UI is in progress, but edge delete client (T006) is independent of pixel client (T010).

## Parallel Opportunities

- Marked with [P]: T003, T005, T006, T008, T010, T012, T014, T016, T017 can run in parallel when dependencies are satisfied (distinct files).
- US1 vs US2 implementation can proceed in parallel after foundational hook (T005) since edge/pixel clients touch separate paths.

## Implementation Strategy (MVP First)

- Deliver MVP by completing US1 (Phase 3) to provide edge product deletion with confirmation and correct error handling.
- Follow with US2 to cover pixel removal, then US3 for enhanced safety/UX.
- Polish to finalize docs, performance checks, and quality gates.
