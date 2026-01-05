# Tasks: Abas de Gatilhos e Pixel para WhatsApp

**Input**: Design documents from `/specs/011-whatsapp-tabs/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Não solicitados na especificação. Apenas testes manuais serão realizados.

**Organization**: Tasks organizadas por user story para permitir implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: Qual user story a tarefa pertence (US1, US2, US3)
- Inclui caminhos exatos dos arquivos nas descrições

## Path Conventions

- **Web app**: `frontend/src/`
- Target file: `frontend/src/app/parametrizacao/whatsapp/page.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Não há setup necessário - feature modifica apenas um arquivo existente

- [x] T001 Verificar que o branch 011-whatsapp-tabs está ativo e o ambiente de desenvolvimento funciona com `yarn dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Nenhuma tarefa foundational necessária - componente Tabs já existe e está em uso

**⚠️ NOTA**: Esta feature é uma reorganização de UI. O componente Tabs, modelo de dados e API já existem.

**Checkpoint**: Foundation ready - implementação das user stories pode começar

---

## Phase 3: User Story 3 - Reorganização Visual das Abas (Priority: P2) 🎯 MVP

**Goal**: Criar a estrutura de três abas: "Geral", "Gatilhos", "Pixel"

**Independent Test**: Verificar que as três abas aparecem e que alternar entre elas preserva os dados do formulário

**Justificativa de ordem**: Embora seja P2, esta história é pré-requisito para US1 e US2 pois cria a estrutura de abas que as outras histórias utilizam.

### Implementation for User Story 3

- [x] T002 [US3] Adicionar TabsTrigger "Gatilhos" e "Pixel" ao TabsList em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (linha ~455-457)

- [x] T003 [US3] Criar TabsContent vazio para value="gatilhos" em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (após linha ~519)

- [x] T004 [US3] Criar TabsContent vazio para value="pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx` (após TabsContent gatilhos)

- [ ] T005 [US3] Testar manualmente que as três abas aparecem e alternar entre elas não causa erros

**Checkpoint**: Estrutura de 3 abas criada - US1 e US2 podem começar em paralelo

---

## Phase 4: User Story 1 - Configurar Gatilhos de Conversão (Priority: P1)

**Goal**: Mover Benefit Cards e Social Proof para a aba "Gatilhos"

**Independent Test**: Navegar até aba "Gatilhos", configurar benefit cards e social proof, salvar e verificar que aparecem na página pública

### Implementation for User Story 1

- [x] T006 [US1] Mover seção Benefit Cards (linhas ~624-778) para dentro do TabsContent value="gatilhos" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T007 [US1] Mover seção Social Proof Notifications (linhas ~780-818) para dentro do TabsContent value="gatilhos" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T008 [US1] Ajustar espaçamento e classes CSS para manter layout consistente dentro da aba "Gatilhos"

- [ ] T009 [US1] Testar manualmente: criar página, configurar benefit cards na aba Gatilhos, salvar e verificar na página pública /w/[slug]

- [ ] T010 [US1] Testar manualmente: habilitar social proof com intervalo personalizado, salvar e verificar notificações na página pública

**Checkpoint**: User Story 1 completa - aba Gatilhos funcional com Benefit Cards e Social Proof

---

## Phase 5: User Story 2 - Configurar Rastreamento de Pixel (Priority: P1)

**Goal**: Mover configurações de Pixel para a aba "Pixel"

**Independent Test**: Navegar até aba "Pixel", selecionar pixel, configurar eventos e delay, salvar e verificar que eventos disparam corretamente

### Implementation for User Story 2

- [x] T011 [US2] Mover dropdown de Pixel (linhas ~522-537) para dentro do TabsContent value="pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T012 [US2] Mover dropdown de Evento de Redirect (linhas ~539-554) para dentro do TabsContent value="pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T013 [US2] Mover checkboxes de Eventos ao Carregar (linhas ~557-585) para dentro do TabsContent value="pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T014 [US2] Mover input de Tempo de Redirect (linhas ~587-598) para dentro do TabsContent value="pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T015 [US2] Ajustar layout da aba Pixel para organização visual adequada (grid 2 colunas para Pixel + Evento Redirect, full width para checkboxes e delay)

- [ ] T016 [US2] Testar manualmente: selecionar pixel, configurar eventos ao carregar, definir evento de redirect e delay, salvar

- [ ] T017 [US2] Testar manualmente: acessar página pública e verificar no console do browser que eventos do Meta Pixel são disparados

**Checkpoint**: User Story 2 completa - aba Pixel funcional com todas as configurações de rastreamento

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verificação final e ajustes

- [x] T018 Verificar que campo Status permanece fora das abas, visível abaixo do componente Tabs em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [x] T019 Verificar que mensagens de erro/sucesso e botões de submit permanecem fora das abas em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

- [ ] T020 Teste de regressão: editar página existente e verificar que todos os campos carregam corretamente nas respectivas abas

- [ ] T021 Teste de regressão: criar nova página preenchendo todas as abas e verificar que salva corretamente

- [ ] T022 Verificar responsividade das abas em telas menores (mobile/tablet)

- [ ] T023 Run quickstart.md validation - seguir todos os passos de verificação

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Verificação básica do ambiente
- **Foundational (Phase 2)**: Nada a fazer - tudo já existe
- **User Story 3 (Phase 3)**: Cria estrutura de abas - BLOQUEIA US1 e US2
- **User Story 1 (Phase 4)**: Depende de US3 (estrutura de abas)
- **User Story 2 (Phase 5)**: Depende de US3 (estrutura de abas)
- **Polish (Phase 6)**: Depende de todas as user stories

### User Story Dependencies

```
          ┌──────────────────┐
          │     Setup        │
          │    (Phase 1)     │
          └────────┬─────────┘
                   │
          ┌────────▼─────────┐
          │  User Story 3    │
          │ (Estrutura Abas) │
          │    Phase 3       │
          └────────┬─────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼───────┐       ┌───────▼──────┐
│ User Story 1 │       │ User Story 2 │
│  (Gatilhos)  │       │   (Pixel)    │
│   Phase 4    │       │   Phase 5    │
└──────┬───────┘       └───────┬──────┘
       │                       │
       └───────────┬───────────┘
                   │
          ┌────────▼─────────┐
          │     Polish       │
          │    (Phase 6)     │
          └──────────────────┘
```

### Parallel Opportunities

**Após Phase 3 (User Story 3):**
- User Story 1 (T006-T010) e User Story 2 (T011-T017) podem ser implementadas em paralelo
- Ambas modificam o mesmo arquivo, mas em seções diferentes (TabsContent diferentes)

**Dentro de cada User Story:**
- Tarefas de mover elementos (T006-T007, T011-T014) podem ser feitas sequencialmente para evitar conflitos de merge

---

## Parallel Example: User Stories 1 e 2

```bash
# Após completar User Story 3 (T002-T005):

# Developer A - User Story 1:
Task: "T006 Mover seção Benefit Cards para TabsContent gatilhos"
Task: "T007 Mover seção Social Proof para TabsContent gatilhos"
...

# Developer B - User Story 2 (em paralelo):
Task: "T011 Mover dropdown de Pixel para TabsContent pixel"
Task: "T012 Mover dropdown de Evento de Redirect para TabsContent pixel"
...
```

---

## Implementation Strategy

### MVP First (User Story 3 + User Story 1)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 3: User Story 3 - criar estrutura de abas (T002-T005)
3. Complete Phase 4: User Story 1 - aba Gatilhos (T006-T010)
4. **STOP and VALIDATE**: Testar criação/edição de páginas com Gatilhos
5. Deploy/demo se pronto

### Incremental Delivery

1. Complete US3 → Estrutura de 3 abas visível
2. Add US1 → Aba Gatilhos funcional → Test → Deploy
3. Add US2 → Aba Pixel funcional → Test → Deploy
4. Polish → Verificações finais → Deploy final

### Single Developer Strategy

Recomendado para esta feature (modifica apenas 1 arquivo):

1. T001: Verificar ambiente
2. T002-T005: Criar estrutura de abas
3. T006-T010: Implementar aba Gatilhos
4. T011-T017: Implementar aba Pixel
5. T018-T023: Polish e verificações

---

## Notes

- Todas as tarefas modificam o mesmo arquivo: `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- Não há criação de novos arquivos
- Não há alterações no modelo de dados ou API
- Testes são manuais (não há framework de testes configurado)
- Commit após cada task ou grupo lógico para facilitar rollback se necessário
