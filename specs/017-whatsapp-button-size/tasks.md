# Tasks: Configuração de Tamanho do Botão WhatsApp

**Input**: Design documents from `/specs/017-whatsapp-button-size/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Não solicitado - apenas testes manuais conforme plan.md

**Organization**: Tasks agrupadas por user story para implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story relacionada (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Web app**: `frontend/src/` (Next.js monorepo)
- Baseado na estrutura definida em plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Não há setup adicional necessário - projeto já configurado

✅ Projeto existente com todas as dependências instaladas

**Checkpoint**: Setup não necessário - prosseguir para Phase 2

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Adicionar campo `buttonSize` ao schema Zod e ao tipo WhatsAppPageRecord

**⚠️ CRITICAL**: Estas tarefas devem ser completadas antes de qualquer user story

- [x] T001 [P] Add `buttonSize` field to Zod schema in `frontend/src/lib/validation.ts` - add `buttonSize: emojiSizeSchema.default("medium")` after `buttonText` field in `whatsAppPageSchema`
- [x] T002 [P] Add `buttonSize` field to `WhatsAppPageRecord` type in `frontend/src/lib/repos/whatsapp-pages.ts` - add `buttonSize: EmojiSize;` to main type
- [x] T003 Add `buttonSize` to `LegacyWhatsAppPageRecord` type in `frontend/src/lib/repos/whatsapp-pages.ts` - add `buttonSize?: EmojiSize;` for backward compatibility
- [x] T004 Add migration logic in `migrateRecord()` function in `frontend/src/lib/repos/whatsapp-pages.ts` - add `migrated.buttonSize = record.buttonSize ?? "medium";`
- [x] T005 Add `buttonSize` to `upsertWhatsAppPage()` record construction in `frontend/src/lib/repos/whatsapp-pages.ts` - add `buttonSize: parsed.buttonSize ?? existing?.buttonSize ?? "medium",`

**Checkpoint**: Foundation ready - campo buttonSize disponível para uso nas user stories

---

## Phase 3: User Story 1 - Ajustar Tamanho do Botão no Admin (Priority: P1) 🎯 MVP

**Goal**: Administrador pode selecionar tamanho do botão (pequeno/médio/grande) com preview em tempo real

**Independent Test**: Acessar /parametrizacao/whatsapp, alterar tamanho do botão e verificar que preview atualiza instantaneamente

### Implementation for User Story 1

- [x] T006 [US1] Add `BUTTON_SIZE_CLASSES` constant mapping in `frontend/src/app/parametrizacao/whatsapp/page.tsx` - create mapping `{ small: "px-6 py-3 text-base", medium: "px-8 py-4 text-lg", large: "px-10 py-5 text-xl" }`
- [x] T007 [US1] Add `buttonSize` state to form state in `frontend/src/app/parametrizacao/whatsapp/page.tsx` - initialize with `page.buttonSize ?? "medium"`
- [x] T008 [US1] Add RadioGroup selector for button size in "Geral" tab in `frontend/src/app/parametrizacao/whatsapp/page.tsx` - position after buttonText field with labels "Pequeno", "Médio", "Grande"
- [x] T009 [US1] Add button preview component in `frontend/src/app/parametrizacao/whatsapp/page.tsx` - render styled button using BUTTON_SIZE_CLASSES[buttonSize] with WhatsApp icon and current buttonText
- [x] T010 [US1] Add `buttonSize` to form submission payload in `frontend/src/app/parametrizacao/whatsapp/page.tsx` - include in POST /api/whatsapp body

**Checkpoint**: User Story 1 completa - admin pode configurar tamanho com preview em tempo real

---

## Phase 4: User Story 2 - Visualizar Botão na Página Pública (Priority: P2)

**Goal**: Usuário final visualiza botão com tamanho configurado na página /w/[slug]

**Independent Test**: Acessar /w/[slug] configurada e verificar que botão aparece com tamanho correto

### Implementation for User Story 2

- [x] T011 [US2] Add `BUTTON_SIZE_CLASSES` constant mapping in `frontend/src/app/w/[slug]/client.tsx` - create mapping identical to admin `{ small: "px-6 py-3 text-base", medium: "px-8 py-4 text-lg", large: "px-10 py-5 text-xl" }`
- [x] T012 [US2] Apply dynamic button size classes to CTA button in `frontend/src/app/w/[slug]/client.tsx` - replace hardcoded `px-8 py-4 text-lg` with `${BUTTON_SIZE_CLASSES[page.buttonSize ?? "medium"]}`

**Checkpoint**: User Story 2 completa - página pública renderiza botão com tamanho configurado

---

## Phase 5: User Story 3 - Valor Padrão para Páginas Existentes (Priority: P3)

**Goal**: Páginas existentes funcionam com valor padrão "médio" sem reconfiguração

**Independent Test**: Acessar página existente sem configuração e verificar botão com tamanho médio

### Implementation for User Story 3

✅ **Já implementado na Phase 2 (Foundational)**

As tarefas T003, T004 e T005 garantem:
- Tipo legacy aceita buttonSize opcional
- Migração aplica default "medium" para registros sem buttonSize
- Upsert preserva valor existente ou aplica default

**Checkpoint**: User Story 3 completa - compatibilidade retroativa garantida

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final e limpeza

- [x] T013 Validate all three button sizes render correctly in admin preview in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T014 Validate button maintains hover/active animations across all sizes in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T015 Test responsive behavior on mobile viewport for all button sizes
- [ ] T016 Run quickstart.md validation scenarios manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Não necessário
- **Foundational (Phase 2)**: Pode iniciar imediatamente - BLOCKS user stories
- **User Story 1 (Phase 3)**: Depende de Phase 2 completa
- **User Story 2 (Phase 4)**: Depende de Phase 2 completa
- **User Story 3 (Phase 5)**: ✅ Já coberta por Phase 2
- **Polish (Phase 6)**: Depende de US1 e US2 completas

### User Story Dependencies

- **User Story 1 (P1)**: Depende de Phase 2 - Independente de outras stories
- **User Story 2 (P2)**: Depende de Phase 2 - Independente de outras stories
- **User Story 3 (P3)**: ✅ Automaticamente coberta pela Phase 2

### Within Each User Story

- Constantes antes de estados
- Estados antes de componentes UI
- Componentes antes de integrações

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T001 e T002 podem rodar em paralelo (arquivos diferentes)
- T003, T004, T005 são sequenciais (mesmo arquivo)

**User Stories**:
- US1 e US2 podem ser implementadas em paralelo após Phase 2
- Dentro de US1: T006 e T007 são paralelos, T008/T009/T010 são sequenciais

---

## Parallel Example: Phase 2 + User Stories

```bash
# Phase 2 - Rodar T001 e T002 em paralelo:
Task: "Add buttonSize to validation.ts"
Task: "Add buttonSize to WhatsAppPageRecord type"

# Após Phase 2 completa - User Stories em paralelo:
# Developer A: User Story 1 (admin)
Task: "Add BUTTON_SIZE_CLASSES to admin page.tsx"
Task: "Add buttonSize state and RadioGroup"

# Developer B: User Story 2 (public page)
Task: "Add BUTTON_SIZE_CLASSES to client.tsx"
Task: "Apply dynamic button size classes"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001-T005)
2. Complete Phase 3: User Story 1 (T006-T010)
3. **STOP and VALIDATE**: Testar preview no admin funciona
4. Deploy/demo se desejado

### Incremental Delivery

1. Complete Foundational → Schema + tipos prontos
2. Add User Story 1 → Testar admin → Deploy (MVP!)
3. Add User Story 2 → Testar página pública → Deploy
4. Run Polish → Validação final

### Single Developer Strategy

Ordem recomendada:
1. T001 → T002 (paralelos)
2. T003 → T004 → T005 (sequenciais)
3. T006 → T007 (paralelos)
4. T008 → T009 → T010 (sequenciais)
5. T011 → T012 (sequenciais)
6. T013 → T014 → T015 → T016 (validações)

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tasks** | 16 |
| **Phase 2 (Foundational)** | 5 tasks |
| **User Story 1 (Admin)** | 5 tasks |
| **User Story 2 (Public Page)** | 2 tasks |
| **User Story 3 (Backward Compat)** | 0 tasks (covered by Phase 2) |
| **Polish** | 4 tasks |
| **Parallel Opportunities** | 4 (T001+T002, T006+T007, US1+US2) |
| **MVP Scope** | Phase 2 + US1 (10 tasks) |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story é independentemente testável
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story
- Evitar: tasks vagas, conflitos no mesmo arquivo, dependências cross-story
