# Tasks: WhatsApp Benefit Cards Personalizáveis

**Input**: Design documents from `/specs/005-whatsapp-benefit-cards/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não solicitados na especificação. Apenas lint check via `yarn lint`.

**Organization**: Tasks organizadas por user story para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story pertence (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Frontend**: `frontend/src/`
- Projeto web application com Next.js 16 App Router

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extensão de schemas e tipos existentes

- [x] T001 [P] Add benefitCardSchema and emojiSizeSchema to `frontend/src/lib/validation.ts`
- [x] T002 [P] Add BenefitCard and EmojiSize type exports to `frontend/src/lib/validation.ts`
- [x] T003 Extend whatsAppPageSchema with benefitCards and emojiSize fields in `frontend/src/lib/validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extensão do tipo e repositório que DEVE estar pronta antes das user stories

**⚠️ CRITICAL**: User stories dependem desta fase

- [x] T004 Extend WhatsAppPageRecord type with benefitCards and emojiSize in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T005 Update upsertWhatsAppPage function to handle benefitCards and emojiSize in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T006 Add backward compatibility logic for existing pages without benefitCards in `frontend/src/lib/repos/whatsapp-pages.ts`

**Checkpoint**: Foundation ready - implementação das user stories pode começar

---

## Phase 3: User Story 1 - Configurar Benefit Cards no Admin (Priority: P1) 🎯 MVP

**Goal**: Administrador pode adicionar, remover e reordenar benefit cards no formulário de página WhatsApp

**Independent Test**: Acessar `/parametrizacao/whatsapp`, criar/editar página, adicionar cards, salvar e verificar persistência

### Implementation for User Story 1

- [x] T007 [US1] Add benefitCards and emojiSize to FormState type in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T008 [US1] Add benefitCards and emojiSize to initialForm defaults in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T009 [US1] Create BenefitCardEditor component section for adding new cards in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T010 [US1] Implement add benefit card handler (max 8 validation) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T011 [US1] Implement remove benefit card handler in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T012 [US1] Implement move up/down handlers for card reordering in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T013 [US1] Add emoji size selector (small/medium/large dropdown) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T014 [US1] Update handleSubmit to include benefitCards and emojiSize in payload in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T015 [US1] Update handleEdit to populate benefitCards and emojiSize from page data in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T016 [US1] Add visual preview of benefit cards in form section in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: User Story 1 funcional - admin pode gerenciar benefit cards

---

## Phase 4: User Story 2 - Exibir Benefit Cards na Página de Redirect (Priority: P1)

**Goal**: Visitante vê benefit cards em grid responsivo na página `/w/[slug]`

**Independent Test**: Acessar `/w/[slug]` com cards configurados e verificar exibição responsiva

### Implementation for User Story 2

- [x] T017 [US2] Define emoji size CSS classes mapping (text-2xl/4xl/6xl) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T018 [US2] Create BenefitCardsGrid component for displaying cards in `frontend/src/app/w/[slug]/client.tsx`
- [x] T019 [US2] Implement responsive grid layout (1 col mobile, 2 tablet, 4 desktop) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T020 [US2] Render benefit card with emoji, title, and optional description in `frontend/src/app/w/[slug]/client.tsx`
- [x] T021 [US2] Apply emojiSize class to emoji display in `frontend/src/app/w/[slug]/client.tsx`
- [x] T022 [US2] Add conditional rendering - hide section when benefitCards is empty in `frontend/src/app/w/[slug]/client.tsx`
- [x] T023 [US2] Position benefit cards section between headline/socialProofs and CTA button in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: User Stories 1 AND 2 funcionais - admin configura, visitante visualiza

---

## Phase 5: User Story 3 - Editar Benefit Cards Existentes (Priority: P2)

**Goal**: Administrador pode modificar cards existentes inline no formulário

**Independent Test**: Editar página existente, alterar card, salvar, recarregar e verificar alteração

### Implementation for User Story 3

- [x] T024 [US3] Add inline editing inputs for each card (emoji, title, description) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T025 [US3] Implement update handler for individual card fields in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T026 [US3] Add validation feedback for card fields (required emoji/title, max lengths) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Todas as user stories funcionais

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e melhorias

- [x] T027 [P] Run yarn lint and fix any TypeScript/ESLint errors
- [x] T028 [P] Run yarn build to verify production build succeeds
- [x] T029 Test edge cases: empty cards, max 8 cards, long emoji (2 chars), max length title/description
- [x] T030 Verify backward compatibility: existing pages without benefitCards still work
- [x] T031 Test responsive layout on mobile (320px), tablet (768px), desktop (1920px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEIA user stories
- **User Stories (Phase 3-5)**: Todas dependem de Phase 2
  - US1 e US2 podem rodar em paralelo (arquivos diferentes)
  - US3 depende de US1 (edição inline no mesmo arquivo do form)
- **Polish (Phase 6)**: Depende de todas user stories

### User Story Dependencies

- **User Story 1 (P1)**: Após Phase 2 - sem dependências de outras stories
- **User Story 2 (P1)**: Após Phase 2 - sem dependências de outras stories, arquivo diferente de US1
- **User Story 3 (P2)**: Após Phase 2, mesmo arquivo que US1 - melhor executar após US1

### Parallel Opportunities

- T001 e T002 podem rodar em paralelo (mesmo arquivo, mas seções independentes)
- US1 (admin form) e US2 (redirect page) podem rodar em paralelo - arquivos diferentes
- T027 e T028 podem rodar em paralelo

---

## Parallel Example: User Stories 1 & 2

```bash
# Após Phase 2, lançar ambas em paralelo:
# Developer A: User Story 1
Task: "Add benefitCards to FormState in frontend/src/app/parametrizacao/whatsapp/page.tsx"
# Developer B: User Story 2
Task: "Create BenefitCardsGrid in frontend/src/app/w/[slug]/client.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T016)
4. Complete Phase 4: User Story 2 (T017-T023)
5. **STOP and VALIDATE**: Testar fluxo completo admin → redirect
6. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → Tipos e validação prontos
2. User Story 1 → Admin pode configurar cards → Deploy
3. User Story 2 → Visitante vê cards → Deploy (feature completa para usuário)
4. User Story 3 → Edição inline → Deploy (UX melhorada)
5. Polish → Qualidade final

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story pode ser completada e testada independentemente
- Commit após cada task ou grupo lógico
- Pare em qualquer checkpoint para validar story
- Evitar: tasks vagas, conflitos no mesmo arquivo, dependências entre stories
