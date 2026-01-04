# Tasks: Notificação de Prova Social

**Input**: Design documents from `/specs/007-social-proof-notification/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não solicitados - apenas linting (yarn lint)

**Organization**: Tasks são agrupadas por user story para permitir implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a task pertence (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Web app**: `frontend/src/` (Next.js App Router)
- Paths relativos a `frontend/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação de arquivos base e extensão de schemas existentes

- [x] T001 [P] Create social proof data file with Brazilian names and cities in `frontend/src/lib/social-proof-data.ts`
- [x] T002 [P] Extend Zod schema with `socialProofEnabled` and `socialProofInterval` fields in `frontend/src/lib/validation.ts`
- [x] T003 Extend `WhatsAppPageRecord` type and `LegacyWhatsAppPageRecord` type in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T004 Update `migrateRecord` function with default values for new fields in `frontend/src/lib/repos/whatsapp-pages.ts`

---

## Phase 2: Foundational (Notification Component)

**Purpose**: Criar o componente de notificação que será usado pela página WhatsApp

**⚠️ CRÍTICO**: Este componente deve estar pronto antes das integrações nas user stories

- [x] T005 Create `SocialProofNotification` component with animation and timer logic in `frontend/src/components/social-proof-notification.tsx`
- [x] T006 Implement random name/city generation with non-consecutive repetition prevention in `frontend/src/components/social-proof-notification.tsx`
- [x] T007 Add responsive styling for mobile and desktop in `frontend/src/components/social-proof-notification.tsx`

**Checkpoint**: Componente de notificação pronto - integração pode começar

---

## Phase 3: User Story 1 - Administrador habilita notificações (Priority: P1) 🎯 MVP

**Goal**: Administrador consegue habilitar/desabilitar notificações de prova social e configurar o intervalo no painel admin

**Independent Test**: Acessar `/parametrizacao/whatsapp`, editar uma página, verificar se toggle e input de intervalo estão presentes e salvam corretamente

### Implementation for User Story 1

- [x] T008 [US1] Add `socialProofEnabled` toggle field to form state in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T009 [US1] Add `socialProofInterval` number input field to form state in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T010 [US1] Add toggle UI component (checkbox/switch) for social proof in form section in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T011 [US1] Add interval input UI with validation (5-60s) in form section in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T012 [US1] Update form submission to include new fields in payload in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T013 [US1] Update `handleEdit` to populate new fields when editing existing page in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T014 [US1] Update `resetForm` to reset new fields to defaults in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T015 [US1] Show social proof status in pages list (enabled/disabled indicator) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Admin pode configurar social proof - User Story 1 completa e testável

---

## Phase 4: User Story 2 - Visitante visualiza notificações (Priority: P1) 🎯 MVP

**Goal**: Visitante vê notificação aparecer e desaparecer na página de WhatsApp quando habilitado

**Independent Test**: Acessar página `/w/[slug]` com social proof habilitado e verificar se notificação aparece após ~3s e desaparece após ~4s

### Implementation for User Story 2

- [x] T016 [US2] Import `SocialProofNotification` component in `frontend/src/app/w/[slug]/client.tsx`
- [x] T017 [US2] Add conditional rendering of notification based on `page.socialProofEnabled` in `frontend/src/app/w/[slug]/client.tsx`
- [x] T018 [US2] Pass `interval` prop from `page.socialProofInterval` to notification component in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: Visitante vê notificações - User Story 2 completa e testável

---

## Phase 5: User Story 3 - Exibição contínua de notificações (Priority: P2)

**Goal**: Notificações continuam aparecendo em loop enquanto visitante permanece na página

**Independent Test**: Permanecer na página por mais de um ciclo e verificar se novas notificações aparecem com nomes/cidades diferentes

### Implementation for User Story 3

- [x] T019 [US3] Implement notification loop with configurable interval in `frontend/src/components/social-proof-notification.tsx`
- [x] T020 [US3] Ensure cleanup of timers on component unmount in `frontend/src/components/social-proof-notification.tsx`
- [x] T021 [US3] Verify non-consecutive repetition works across multiple cycles in `frontend/src/components/social-proof-notification.tsx`

**Checkpoint**: Notificações em loop funcionando - User Story 3 completa e testável

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e ajustes de qualidade

- [x] T022 Run `yarn lint` and fix any linting errors
- [ ] T023 Manual test: Create new WhatsApp page with social proof disabled (verify default)
- [ ] T024 Manual test: Enable social proof and set interval to 10s, save and verify on `/w/[slug]`
- [ ] T025 Manual test: Verify notification appears after ~3s and disappears after ~4s
- [ ] T026 Manual test: Verify new notification appears after configured interval
- [ ] T027 Manual test: Verify names/cities don't repeat consecutively
- [ ] T028 Manual test: Test responsiveness on mobile viewport
- [ ] T029 Manual test: Disable social proof and verify notifications stop appearing

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente
- **Foundational (Phase 2)**: Depende de T001 (social-proof-data.ts) para imports
- **User Story 1 (Phase 3)**: Depende de T002-T004 (schema e tipos)
- **User Story 2 (Phase 4)**: Depende de T005-T007 (componente) e T002-T004 (tipos)
- **User Story 3 (Phase 5)**: Depende de T005-T007 (ajustes no componente existente)
- **Polish (Phase 6)**: Depende de todas as user stories completas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após Phase 1 - Não depende de outras stories
- **User Story 2 (P1)**: Pode começar após Phase 2 - Não depende de US1 (mas pode testar junto)
- **User Story 3 (P2)**: Depende de Phase 2 (loop é parte do componente base)

### Parallel Opportunities

```text
Phase 1 (Setup):
- T001 e T002 podem rodar em paralelo (arquivos diferentes)

Phase 2 (Foundational):
- T005, T006, T007 são no mesmo arquivo - sequencial

Phase 3 (User Story 1):
- T008-T015 são no mesmo arquivo - sequencial

Phase 4 (User Story 2):
- T016-T018 são no mesmo arquivo - sequencial
- MAS User Story 2 pode rodar em paralelo com User Story 1 (arquivos diferentes)
```

---

## Parallel Example: Phases 3 & 4

```bash
# Após Phase 2 completa, dois desenvolvedores podem trabalhar em paralelo:

# Developer A: User Story 1 (Admin Panel)
Task: "Add socialProofEnabled toggle to form in frontend/src/app/parametrizacao/whatsapp/page.tsx"

# Developer B: User Story 2 (WhatsApp Page)
Task: "Import and render SocialProofNotification in frontend/src/app/w/[slug]/client.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007)
3. Complete Phase 3: User Story 1 (T008-T015)
4. Complete Phase 4: User Story 2 (T016-T018)
5. **STOP and VALIDATE**: Testar admin toggle + notificação na página
6. Deploy se pronto

### Incremental Delivery

1. Setup + Foundational → Infraestrutura pronta
2. Add User Story 1 → Admin consegue configurar
3. Add User Story 2 → Visitante vê notificação (MVP completo!)
4. Add User Story 3 → Loop de notificações
5. Polish → Validação final

---

## Notes

- Todos os arquivos modificados são existentes, exceto `social-proof-data.ts` e `social-proof-notification.tsx`
- FormState do admin panel já tem padrão estabelecido - seguir mesmo formato
- Componente de notificação é client-side ("use client")
- Usar Tailwind CSS para animações (projeto já tem `tailwindcss-animate`)
- Testes são manuais conforme quickstart.md
