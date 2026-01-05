# Tasks: WhatsApp Admin Tabs Organization

**Input**: Design documents from `/specs/010-whatsapp-admin-tabs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested - linting only (yarn lint)

**Organization**: Tasks organized by user story. This feature has 1 user story (P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (Next.js)
- Paths based on plan.md structure

---

## Phase 1: Setup (Dependencies)

**Purpose**: Install required dependencies for Tabs component

- [x] T001 Install @radix-ui/react-tabs dependency via `yarn add @radix-ui/react-tabs` in frontend/

---

## Phase 2: Foundational (UI Component)

**Purpose**: Create shadcn/ui Tabs component that will be used by the feature

**CRITICAL**: Must be complete before User Story 1 implementation

- [x] T002 Create Tabs component in frontend/src/components/ui/tabs.tsx with Tabs, TabsList, TabsTrigger, TabsContent exports

**Checkpoint**: Tabs component ready for use

---

## Phase 3: User Story 1 - Access General Tab for Core Page Settings (Priority: P1)

**Goal**: Reorganizar os 5 campos principais (Headline, URL Foto, Provas Sociais, Texto Botão, URL WhatsApp) em uma aba "Geral", mantendo demais seções inalteradas

**Independent Test**: Navegar até /parametrizacao/whatsapp e verificar que:
1. Aba "Geral" é exibida e selecionada por padrão
2. Os 5 campos aparecem dentro da aba
3. Seções Pixel/Eventos, Benefit Cards, Prova Social aparecem abaixo da aba (inalteradas)
4. Criar/editar páginas continua funcionando normalmente

### Implementation for User Story 1

- [x] T003 [US1] Import Tabs components in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T004 [US1] Wrap the 5 form fields (Headline, URL Foto, Provas Sociais, Texto Botão, URL WhatsApp) with Tabs component structure in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T005 [US1] Configure TabsTrigger with label "Geral" and default active state in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T006 [US1] Ensure remaining sections (Pixel/Eventos, Benefit Cards, Prova Social) stay outside Tabs in frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T007 [US1] Verify form submit handler continues working with new structure in frontend/src/app/parametrizacao/whatsapp/page.tsx

**Checkpoint**: User Story 1 complete - aba "Geral" funcional com todos os campos

---

## Phase 4: Polish & Validation

**Purpose**: Final validation and cleanup

- [x] T008 Run yarn lint to validate code quality
- [ ] T009 Manual verification: create a new WhatsApp page using the new interface
- [ ] T010 Manual verification: edit an existing WhatsApp page using the new interface

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (dependency installed)
- **User Story 1 (Phase 3)**: Depends on Phase 2 (Tabs component exists)
- **Polish (Phase 4)**: Depends on Phase 3 completion

### Task Dependencies

```
T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010
         ↓
   (Tabs component)
         ↓
   (Page modification - sequential within same file)
```

### Parallel Opportunities

- T009 and T010 can run in parallel (different test scenarios)

---

## Parallel Example: Phase 4 Validation

```bash
# Launch both validation tests together:
Task: "Manual verification: create a new WhatsApp page"
Task: "Manual verification: edit an existing WhatsApp page"
```

---

## Implementation Strategy

### MVP First (Single User Story)

1. Complete Phase 1: Setup (yarn add)
2. Complete Phase 2: Foundational (create tabs.tsx)
3. Complete Phase 3: User Story 1 (modify page.tsx)
4. **STOP and VALIDATE**: Test both create and edit flows
5. Complete Phase 4: Polish

### Estimated Scope

- **Total tasks**: 10
- **Files created**: 1 (tabs.tsx)
- **Files modified**: 1 (page.tsx)
- **Dependencies added**: 1 (@radix-ui/react-tabs)

---

## Notes

- All Phase 3 tasks (T003-T007) modify the same file - must be sequential
- Tabs component (T002) uses standard shadcn/ui patterns from quickstart.md
- No data model changes - purely visual reorganization
- Form behavior and submit handler remain unchanged
- Commit after each phase for easy rollback if needed
