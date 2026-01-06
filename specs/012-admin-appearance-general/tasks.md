# Tasks: Aparência Global na Aba Geral e Remoção de Bordas

**Input**: Design documents from `/specs/012-admin-appearance-general/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Tests**: Não solicitados nesta feature - apenas validação visual e lint

**Organization**: Tasks são agrupadas por user story para permitir implementação e testes independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: Qual user story a task pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos nas descrições

## Path Conventions

- **Web app (frontend only)**: `frontend/src/app/parametrizacao/`

---

## Phase 1: Setup

**Purpose**: Nenhuma configuração necessária - feature é refatoração de código existente

**Checkpoint**: Pronto para implementação - não há setup necessário

---

## Phase 2: Foundational

**Purpose**: Não há tarefas foundacionais blocking - cada user story pode ser implementada independentemente

**Checkpoint**: Pronto para implementação de user stories

---

## Phase 3: User Story 1 - Configurar Aparência Global na Aba Geral (Priority: P1)

**Goal**: Mover campos de Aparência Global (Texto de Redirecionamento, Cor de Fundo, toggle de Borda) e preview para dentro da aba "Geral"

**Independent Test**: Acessar `/parametrizacao/whatsapp`, clicar na aba "Geral" e verificar que os campos de Aparência Global estão presentes e funcionais

### Implementation for User Story 1

- [X] T001 [US1] Identificar e extrair seção de Aparência Global (linhas ~321-450) em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T002 [US1] Mover campos de Aparência Global (input Texto de Redirecionamento, input Cor de Fundo, toggle Borda) para dentro de `<TabsContent value="geral">` em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T003 [US1] Mover seção de preview de aparência para dentro da aba Geral em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T004 [US1] Mover botão "Salvar Aparência" para dentro da aba Geral em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T005 [US1] Remover a seção separada de Aparência Global que existia fora das abas em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T006 [US1] Verificar que validações existentes (max 100 chars, formato hex) continuam funcionando em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Campos de Aparência Global acessíveis exclusivamente na aba "Geral", preview funcional, salvamento operando

---

## Phase 4: User Story 2 - Interface Visual Limpa sem Bordas Duplicadas (Priority: P1)

**Goal**: Remover bordas duplicadas de containers e items em todas as páginas admin (WhatsApp, Products, Pixels)

**Independent Test**: Verificar visualmente que não há bordas duplicadas em `/parametrizacao/whatsapp`, `/parametrizacao/products`, `/parametrizacao/pixels`

### Implementation for User Story 2 - WhatsApp

- [X] T007 [P] [US2] Remover `border` e `shadow-sm` do container do formulário com tabs em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (linha ~452: `rounded-lg border bg-card p-4 shadow-sm` → `rounded-lg bg-card p-4`)
- [X] T008 [P] [US2] Remover `border` e `shadow-sm` do container da lista de páginas em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (linha ~841)
- [X] T009 [P] [US2] Remover `border` das seções de Benefit Cards na aba Gatilhos em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (`rounded-md border bg-accent/30 p-4` → `rounded-md bg-accent/30 p-4`)
- [X] T010 [P] [US2] Remover `border` das seções de Social Proof na aba Gatilhos em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T011 [P] [US2] Remover `border` dos items individuais de Benefit Cards em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T012 [P] [US2] Remover `border` dos items da lista de páginas WhatsApp em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

### Implementation for User Story 2 - Products

- [X] T013 [P] [US2] Remover `border` e `shadow-sm` do container do formulário de produtos em `frontend/src/app/parametrizacao/products/page.tsx` (linha ~169)
- [X] T014 [P] [US2] Remover `border` e `shadow-sm` do container da lista de produtos em `frontend/src/app/parametrizacao/products/page.tsx` (linha ~265)
- [X] T015 [P] [US2] Remover `border` dos items `<li>` da lista de produtos em `frontend/src/app/parametrizacao/products/page.tsx` (linha ~279)

### Implementation for User Story 2 - Pixels

- [X] T016 [P] [US2] Remover `border` e `shadow-sm` do container do formulário de pixels em `frontend/src/app/parametrizacao/pixels/page.tsx` (linha ~142)
- [X] T017 [P] [US2] Remover `border` e `shadow-sm` do container da lista de pixels em `frontend/src/app/parametrizacao/pixels/page.tsx` (linha ~210)
- [X] T018 [P] [US2] Remover `border` dos items `<li>` da lista de pixels em `frontend/src/app/parametrizacao/pixels/page.tsx` (linha ~227)

**Checkpoint**: Nenhuma borda duplicada visível em qualquer página admin

---

## Phase 5: User Story 3 - Preview de Aparência Integrado (Priority: P2)

**Goal**: Garantir que o preview de aparência funciona corretamente em tempo real dentro da aba Geral

**Independent Test**: Editar campos de aparência e verificar que preview reflete mudanças imediatamente

### Implementation for User Story 3

- [X] T019 [US3] Verificar que preview responde a mudanças no Texto de Redirecionamento em tempo real em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T020 [US3] Verificar que preview responde a mudanças na Cor de Fundo em tempo real em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T021 [US3] Verificar que preview responde a mudanças no toggle de Borda em tempo real em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [X] T022 [US3] Ajustar layout do preview para grid responsivo (2 colunas desktop, 1 coluna mobile) se necessário em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Preview funcional e responsivo dentro da aba Geral

---

## Phase 6: Polish & Validation

**Purpose**: Validação final e garantia de qualidade

- [X] T023 Executar `yarn lint` e corrigir quaisquer erros em `frontend/`
- [X] T024 Executar `yarn build` e verificar build sem erros em `frontend/`
- [ ] T025 Validação visual: verificar borda do layout wrapper (`<main>`) preservada em `frontend/src/app/parametrizacao/layout.tsx`
- [ ] T026 Validação visual: verificar bordas de inputs de formulário preservadas em todas as páginas
- [ ] T027 Teste funcional: criar/editar/salvar configuração de aparência global
- [ ] T028 Teste funcional: criar/editar/excluir produto na página Products
- [ ] T029 Teste funcional: criar/editar/excluir pixel na página Pixels

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: N/A - não há setup
- **Foundational (Phase 2)**: N/A - não há blocking tasks
- **User Story 1 (Phase 3)**: Sem dependências - pode começar imediatamente
- **User Story 2 (Phase 4)**: Sem dependências - pode rodar em paralelo com US1
- **User Story 3 (Phase 5)**: Depende de US1 (preview precisa estar na aba Geral)
- **Polish (Phase 6)**: Depende de todas as user stories

### User Story Dependencies

- **User Story 1 (P1)**: Independente - modifica apenas estrutura da aba Geral
- **User Story 2 (P1)**: Independente - remove bordas (pode rodar em paralelo com US1)
- **User Story 3 (P2)**: Depende de US1 - verifica funcionalidade do preview após movimentação

### Within Each User Story

- US1: Tasks T001-T006 são sequenciais (mesmo arquivo, mesma seção)
- US2: Tasks T007-T018 são paralelas (arquivos diferentes marcados com [P])
- US3: Tasks T019-T022 são sequenciais (verificações no mesmo arquivo)

### Parallel Opportunities

**User Story 2 - Todas as páginas podem ser modificadas em paralelo:**

```bash
# Parallel execution - 3 arquivos diferentes:
Task T013-T015: Products page (frontend/src/app/parametrizacao/products/page.tsx)
Task T016-T018: Pixels page (frontend/src/app/parametrizacao/pixels/page.tsx)
Task T007-T012: WhatsApp page (frontend/src/app/parametrizacao/whatsapp/page.tsx)
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 3: User Story 1 (mover Aparência Global)
2. Complete Phase 4: User Story 2 (remover bordas)
3. **STOP and VALIDATE**: Verificar visualmente todas as páginas
4. Run `yarn lint` e `yarn build`

### Recommended Execution Order

1. **T001-T006** (US1): Mover Aparência Global para aba Geral
2. **T007-T018** (US2) [PARALLEL]: Remover bordas de todas as páginas
3. **T019-T022** (US3): Verificar preview funcional
4. **T023-T029**: Validação e polish

### Single Developer Strategy

1. US1 completo → validar → commit
2. US2 WhatsApp → US2 Products → US2 Pixels → validar → commit
3. US3 → validar → commit
4. Polish → final commit

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- US1 e US2 são ambas P1 (mesma prioridade), podem ser implementadas em qualquer ordem
- US3 depende de US1 estar completa
- Todas as mudanças são em arquivos .tsx existentes
- Não criar novos arquivos
- Preservar funcionalidades existentes (validações, persistência)
