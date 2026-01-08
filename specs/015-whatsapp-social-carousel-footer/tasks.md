# Tasks: WhatsApp Social Proof Carousel & Custom Footer

**Input**: Design documents from `/specs/015-whatsapp-social-carousel-footer/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested - no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (Next.js App Router structure)
- Components: `frontend/src/components/`
- Pages: `frontend/src/app/`
- Library: `frontend/src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Data layer extension - schemas and types needed by all user stories

- [x] T001 Add SocialProofTextItem Zod schema in `frontend/src/lib/validation.ts`
- [x] T002 Add SocialProofImageItem Zod schema in `frontend/src/lib/validation.ts`
- [x] T003 Add socialProofItemSchema discriminated union in `frontend/src/lib/validation.ts`
- [x] T004 Add carousel fields (socialProofCarouselItems, carouselAutoPlay, carouselInterval) to whatsAppPageSchema in `frontend/src/lib/validation.ts`
- [x] T005 Add footerText field to whatsAppPageSchema in `frontend/src/lib/validation.ts`
- [x] T006 Export SocialProofItem, SocialProofTextItem, SocialProofImageItem types from `frontend/src/lib/validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Repository layer updates that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Update WhatsAppPageRecord type with socialProofCarouselItems, carouselAutoPlay, carouselInterval, footerText fields in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T008 Update LegacyWhatsAppPageRecord type with optional new fields in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T009 Update migrateRecord function to handle new fields with defaults in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T010 Update upsertWhatsAppPage function to persist new fields in `frontend/src/lib/repos/whatsapp-pages.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1+3 - Text Social Proof + Carousel Navigation (Priority: P1) 🎯 MVP

**Goal**: Admin pode criar provas sociais de texto e visitantes podem navegar pelo carrossel

**Independent Test**: Criar uma prova social de texto no admin, acessar `/w/[slug]` e verificar que o carrossel exibe e permite navegação

### Implementation for User Story 1+3

- [x] T011 [P] [US1] Create SocialProofCarousel component shell in `frontend/src/components/social-proof-carousel.tsx`
- [x] T012 [P] [US3] Implement carousel state management (currentIndex, navigation) in `frontend/src/components/social-proof-carousel.tsx`
- [x] T013 [US3] Implement prev/next navigation buttons with loop logic in `frontend/src/components/social-proof-carousel.tsx`
- [x] T014 [US3] Implement dot indicators for carousel position in `frontend/src/components/social-proof-carousel.tsx`
- [x] T015 [US3] Implement touch swipe navigation (onTouchStart, onTouchMove, onTouchEnd) in `frontend/src/components/social-proof-carousel.tsx`
- [x] T016 [US3] Implement auto-play functionality with useEffect and setInterval in `frontend/src/components/social-proof-carousel.tsx`
- [x] T017 [US3] Add CSS transitions for smooth slide animations in `frontend/src/components/social-proof-carousel.tsx`
- [x] T018 [US1] Implement TextProofCard subcomponent (description, author, city) in `frontend/src/components/social-proof-carousel.tsx`
- [x] T019 [US1] Add admin form section for creating text-based social proofs in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T020 [US1] Add social proof list display with type indicator in admin in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T021 [US1] Implement edit functionality for text social proofs in admin in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T022 [US1] Implement delete functionality for social proofs in admin in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T023 Integrate SocialProofCarousel component in WhatsApp page in `frontend/src/app/w/[slug]/client.tsx`
- [x] T024 Pass socialProofCarouselItems, carouselAutoPlay, carouselInterval props to client component in `frontend/src/app/w/[slug]/page.tsx`

**Checkpoint**: At this point, text-based social proofs work end-to-end with full carousel navigation

---

## Phase 4: User Story 2 - Image Social Proofs (Priority: P2)

**Goal**: Admin pode adicionar provas sociais em formato de imagem

**Independent Test**: Adicionar uma URL de imagem no admin e verificar exibição no carrossel

### Implementation for User Story 2

- [x] T025 [P] [US2] Implement ImageProofCard subcomponent with responsive image in `frontend/src/components/social-proof-carousel.tsx`
- [x] T026 [US2] Add image error state handling with placeholder in ImageProofCard in `frontend/src/components/social-proof-carousel.tsx`
- [x] T027 [US2] Add admin form toggle between text and image type in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T028 [US2] Add conditional form fields based on selected type (text fields vs image URL) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T029 [US2] Add image URL validation (HTTPS) feedback in admin form in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T030 [US2] Update social proof list to show thumbnail preview for image type in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Image-based social proofs now work alongside text proofs

---

## Phase 5: User Story 4 - Custom Footer (Priority: P2)

**Goal**: Admin pode configurar footer personalizado para a página

**Independent Test**: Adicionar texto de footer no admin e verificar exibição no final da página `/w/[slug]`

### Implementation for User Story 4

- [x] T031 [P] [US4] Create PageFooter component in `frontend/src/components/page-footer.tsx`
- [x] T032 [US4] Implement conditional render (only if footerText is not null/empty) in `frontend/src/components/page-footer.tsx`
- [x] T033 [US4] Add multiline support with whitespace-pre-wrap in `frontend/src/components/page-footer.tsx`
- [x] T034 [US4] Add footer textarea field with character counter in admin in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T035 [US4] Integrate PageFooter component as last element in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: Custom footer feature is complete

---

## Phase 6: User Story 5 - Social Proof Reordering (Priority: P3)

**Goal**: Admin pode reordenar provas sociais para controlar ordem no carrossel

**Independent Test**: Reordenar provas no admin e verificar nova ordem no carrossel

### Implementation for User Story 5

- [x] T036 [US5] Add move up/down buttons to each social proof item in list in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T037 [US5] Implement moveItem function to reorder array in state in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T038 [US5] Ensure reordered array persists on save in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: All user stories are now independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T039 [P] Add carousel auto-play toggle in admin settings in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T040 [P] Add carousel interval slider (3-15s) in admin settings in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T041 Add edge case handling: single item (no nav buttons) in `frontend/src/components/social-proof-carousel.tsx`
- [x] T042 Add edge case handling: empty carousel (render nothing) in `frontend/src/components/social-proof-carousel.tsx`
- [x] T043 Add carousel preview in admin panel in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T044 Run ESLint and fix any errors with `yarn lint`
- [ ] T045 Manual testing: verify all acceptance scenarios from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1+3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories - **MVP**
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on carousel component from US1+3
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of carousel stories
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Requires list UI from US1

### Within Each User Story

- Models/types before components
- Components before integration
- Admin UI for data entry before public page rendering
- Core implementation before polish

### Parallel Opportunities

- T001-T006: All Setup tasks can run in parallel (same file but independent sections)
- T011, T012: Carousel shell and state can be parallelized
- T025, T031: Image card and Footer component are independent
- US4 (Footer) can run completely in parallel with US2 (Images) and US5 (Reordering)

---

## Parallel Example: MVP (Phase 3)

```bash
# Launch carousel component creation:
Task: "Create SocialProofCarousel component shell in frontend/src/components/social-proof-carousel.tsx"
Task: "Implement carousel state management in frontend/src/components/social-proof-carousel.tsx"

# After carousel base is ready, can parallelize:
Task: "Implement TextProofCard subcomponent in frontend/src/components/social-proof-carousel.tsx"
Task: "Add admin form section for text social proofs in frontend/src/app/parametrizacao/whatsapp/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1+3 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T010)
3. Complete Phase 3: User Story 1+3 (T011-T024)
4. **STOP and VALIDATE**: Test text proofs + carousel navigation independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1+3 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Images) → Test independently → Deploy/Demo
4. Add User Story 4 (Footer) → Test independently → Deploy/Demo
5. Add User Story 5 (Reordering) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1+3 (carousel + text proofs)
   - Developer B: User Story 4 (footer - independent)
3. After MVP:
   - Developer A: User Story 2 (images)
   - Developer B: User Story 5 (reordering)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US1 and US3 are combined as they are tightly coupled (text proofs need carousel, carousel needs content)
