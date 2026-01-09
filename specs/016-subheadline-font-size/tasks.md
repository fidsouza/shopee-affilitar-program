# Tasks: Subheadline Text with Font Size Control

**Input**: Design documents from `/specs/016-subheadline-font-size/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Não solicitados - testes manuais conforme plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` (monorepo frontend only)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: N/A - nenhuma configuração inicial necessária. Projeto já está configurado.

**Note**: Este projeto não requer fase de setup - todos os arquivos e dependências já existem.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Adicionar campo `subheadlineFontSize` ao schema e tipos que são pré-requisito para todas as user stories

**⚠️ CRITICAL**: Nenhuma user story pode ser implementada até esta fase estar completa

- [x] T001 [P] Adicionar campo `subheadlineFontSize` ao `whatsAppPageSchema` em `frontend/src/lib/validation.ts`
- [x] T002 [P] Adicionar `subheadlineFontSize: EmojiSize` ao tipo `WhatsAppPageRecord` em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T003 [P] Adicionar `subheadlineFontSize?: EmojiSize` ao tipo `LegacyWhatsAppPageRecord` em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T004 Atualizar função `migrateRecord()` para incluir default `subheadlineFontSize: raw.subheadlineFontSize ?? 'medium'` em `frontend/src/lib/repos/whatsapp-pages.ts`

**Checkpoint**: Schema e tipos atualizados - implementação das user stories pode começar

---

## Phase 3: User Story 1 - Configure Subheadline Text (Priority: P1) 🎯 MVP

**Goal**: Permitir que o administrador configure texto de subheadline na aba Geral do admin

**Independent Test**: Acessar `/parametrizacao/whatsapp`, criar/editar página, inserir texto no campo "Subheadline" e salvar

### Implementation for User Story 1

- [x] T005 [US1] Renomear label de "Provas Sociais (uma por linha)" para "Subheadline" em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (linha ~449)
- [x] T006 [US1] Atualizar placeholder do textarea para refletir novo propósito do campo em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T007 [US1] Verificar que o payload de submit já inclui `socialProofs` corretamente em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Admin permite configurar subheadline - texto é salvo corretamente

---

## Phase 4: User Story 2 - Select Font Size for Subheadline (Priority: P1)

**Goal**: Adicionar seletor de tamanho de fonte (pequeno/médio/grande) para o subheadline

**Independent Test**: No admin, selecionar cada tamanho de fonte e verificar que é salvo corretamente

### Implementation for User Story 2

- [x] T008 [US2] Adicionar state `subheadlineFontSize` ao form com default "medium" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T009 [US2] Adicionar UI de seleção de tamanho (3 botões: Pequeno/Médio/Grande) abaixo do campo Subheadline em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T010 [US2] Incluir `subheadlineFontSize` no payload de submit da função `handleSubmit` em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T011 [US2] Carregar valor existente de `subheadlineFontSize` ao editar página (useEffect de load) em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Admin permite selecionar e salvar tamanho de fonte do subheadline

---

## Phase 5: User Story 3 - Subheadline Appears on WhatsApp Redirect Page (Priority: P1)

**Goal**: Corrigir renderização do subheadline na página pública `/w/[slug]` - texto deve aparecer entre headline e botão CTA

**Independent Test**: Acessar `/w/[slug]` e verificar que subheadline aparece corretamente, independente de ter carrossel configurado

### Implementation for User Story 3

- [x] T012 [US3] Remover condição que oculta `socialProofs` quando carrossel existe (linha ~236) em `frontend/src/app/w/[slug]/client.tsx`
- [x] T013 [US3] Criar função helper `getSubheadlineFontClasses(size: EmojiSize)` que mapeia small/medium/large para classes Tailwind responsivas em `frontend/src/app/w/[slug]/client.tsx`
- [x] T014 [US3] Aplicar classes dinâmicas de tamanho de fonte baseado em `page.subheadlineFontSize` ao renderizar subheadline em `frontend/src/app/w/[slug]/client.tsx`
- [x] T015 [US3] Garantir que subheadline só é exibido quando há texto (após trim), não exibir espaço vazio em `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: Subheadline aparece na página pública com tamanho de fonte correto

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e edge cases

- [ ] T016 Testar renderização de emojis e caracteres especiais no subheadline em `/w/[slug]`
- [ ] T017 Testar responsividade do subheadline em mobile e desktop
- [ ] T018 Testar compatibilidade: página com subheadline + carrossel de provas sociais (ambos devem aparecer)
- [ ] T019 Testar compatibilidade: página antiga sem `subheadlineFontSize` (deve usar default "medium")
- [x] T020 Executar `yarn build` para verificar que não há erros de tipagem

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies - can start immediately - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2) completion - pode ser paralelo com US1
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2) completion - pode ser paralelo com US1/US2
- **Polish (Phase 6)**: Depends on ALL user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Modifica apenas admin form - independente
- **User Story 2 (P1)**: Modifica apenas admin form - pode ser paralelo com US1 (mesmo arquivo, mas seções diferentes)
- **User Story 3 (P1)**: Modifica apenas client.tsx - independente do admin, pode rodar em paralelo

### Within Each User Story

- Tasks devem ser executadas em sequência dentro de cada fase
- T001-T004 (Foundational) podem rodar em paralelo [P]

### Parallel Opportunities

- T001, T002, T003 podem rodar em paralelo (arquivos diferentes)
- User Story 1 e User Story 3 podem rodar em paralelo (arquivos diferentes)
- T016-T019 são testes manuais e podem rodar em qualquer ordem

---

## Parallel Example: Foundational Phase

```bash
# Launch foundational tasks in parallel (different files):
Task: "T001 - Add subheadlineFontSize to validation.ts"
Task: "T002 - Add to WhatsAppPageRecord type"
Task: "T003 - Add to LegacyWhatsAppPageRecord type"
# Wait for above, then:
Task: "T004 - Update migrateRecord function"
```

## Parallel Example: User Stories

```bash
# After Foundational phase, these can run in parallel:
# Developer A: User Story 1 + 2 (admin form changes)
# Developer B: User Story 3 (client.tsx changes)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 3)

1. Complete Phase 2: Foundational (T001-T004)
2. Complete Phase 3: User Story 1 (T005-T007) - Admin rename
3. Complete Phase 4: User Story 2 (T008-T011) - Font size selector
4. Complete Phase 5: User Story 3 (T012-T015) - Fix rendering
5. **STOP and VALIDATE**: Test all three stories
6. Complete Phase 6: Polish (T016-T020) - Final validation

### Recommended Order

Como todas as user stories são P1 e inter-relacionadas, recomenda-se:

1. **Foundational first** (T001-T004) - ~10 min
2. **Admin changes** (T005-T011) - ~15 min
3. **Client rendering** (T012-T015) - ~15 min
4. **Validation** (T016-T020) - ~10 min

**Tempo total estimado**: ~50 minutos

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Este projeto não possui testes automatizados - validação manual conforme quickstart.md
- Reutiliza `emojiSizeSchema` existente (small/medium/large)
- Campo `socialProofs` mantido para compatibilidade - apenas label renomeado
- Commit after each phase for safe rollback points
