# Tasks: Toggle de Redirect com Eventos Separados

**Input**: Design documents from `/specs/013-redirect-toggle/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não foram solicitados testes automatizados. Validação via testes manuais com Meta Pixel Helper.

**Organization**: Tasks agrupadas por user story para implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: Qual user story a task pertence (US1, US2, US3)
- Caminhos exatos dos arquivos incluídos nas descrições

## Path Conventions

- **Web app (Next.js)**: `frontend/src/`
- **Lib**: `frontend/src/lib/`
- **App Router**: `frontend/src/app/`

---

## Phase 1: Setup (Não Aplicável)

**Purpose**: Projeto já inicializado - feature adiciona a infraestrutura existente.

*Nenhuma task de setup necessária - projeto já configurado.*

---

## Phase 2: Foundational (Data Layer)

**Purpose**: Atualização do schema de validação e tipos que DEVEM estar completos antes de qualquer user story.

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase estar completa.

- [x] T001 [P] Adicionar campo `redirectEnabled` ao schema Zod em `frontend/src/lib/validation.ts`
- [x] T002 [P] Adicionar campo `buttonEvent` ao schema Zod em `frontend/src/lib/validation.ts`
- [x] T003 Atualizar tipo `WhatsAppPageRecord` com novos campos em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T004 Atualizar tipo `LegacyWhatsAppPageRecord` para migration em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T005 Implementar migração de `redirectEnabled` na função `migrateRecord` em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T006 Implementar migração de `buttonEvent` na função `migrateRecord` em `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T007 Atualizar função `upsertWhatsAppPage` para persistir novos campos em `frontend/src/lib/repos/whatsapp-pages.ts`

**Checkpoint**: Data layer completo - implementação das user stories pode começar.

---

## Phase 3: User Story 1 - Desabilitar Redirect Automático (Priority: P1) 🎯 MVP

**Goal**: Permitir que o administrador desabilite o redirect automático, ocultando countdown e barra de progresso.

**Independent Test**: Criar página WhatsApp com redirect desabilitado e verificar que countdown não aparece, mas botão funciona.

### Implementation for User Story 1

- [x] T008 [US1] Adicionar prop `redirectEnabled` ao tipo `Props` do componente em `frontend/src/app/w/[slug]/client.tsx`
- [x] T009 [US1] Condicionar renderização do countdown baseado em `redirectEnabled` em `frontend/src/app/w/[slug]/client.tsx`
- [x] T010 [US1] Condicionar renderização da barra de progresso baseado em `redirectEnabled` em `frontend/src/app/w/[slug]/client.tsx`
- [x] T011 [US1] Desabilitar timer de countdown quando `redirectEnabled === false` em `frontend/src/app/w/[slug]/client.tsx`
- [x] T012 [US1] Passar `page.redirectEnabled` do server component para client em `frontend/src/app/w/[slug]/page.tsx`

**Checkpoint**: User Story 1 funcional - páginas podem ter redirect desabilitado.

---

## Phase 4: User Story 2 - Configurar Evento do Botão (Priority: P2)

**Goal**: Permitir configurar evento de pixel específico para clique no botão, separado do evento de redirect.

**Independent Test**: Configurar eventos diferentes para botão e redirect, verificar no Meta Pixel Helper que cada ação dispara o evento correto.

### Implementation for User Story 2

- [x] T013 [US2] Criar função `handleButtonClick` separada de `handleRedirect` em `frontend/src/app/w/[slug]/client.tsx`
- [x] T014 [US2] Implementar lógica de disparo do `buttonEvent` (ou fallback para `redirectEvent`) no clique em `frontend/src/app/w/[slug]/client.tsx`
- [x] T015 [US2] Atualizar `onClick` do botão CTA para usar `handleButtonClick` em `frontend/src/app/w/[slug]/client.tsx`
- [x] T016 [US2] Gerar `buttonEventId` separado para deduplicação em `frontend/src/app/w/[slug]/page.tsx`
- [x] T017 [US2] Passar `buttonEventId` e `page.buttonEvent` do server para client em `frontend/src/app/w/[slug]/page.tsx`
- [x] T018 [US2] Atualizar chamada à API de tracking para usar evento correto no clique do botão em `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: User Stories 1 e 2 funcionais - redirect toggle e eventos separados implementados.

---

## Phase 5: User Story 3 - Compatibilidade com Configuração Atual (Priority: P3)

**Goal**: Garantir que páginas existentes mantêm comportamento idêntico (backward compatibility).

**Independent Test**: Acessar páginas existentes antes e depois da atualização e verificar comportamento idêntico.

### Implementation for User Story 3 (Admin UI)

- [x] T019 [US3] Adicionar `redirectEnabled` ao tipo `FormState` em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T020 [US3] Adicionar `buttonEvent` ao tipo `FormState` em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T021 [US3] Definir valores default em `initialForm` (redirectEnabled: true, buttonEvent: "") em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T022 [US3] Adicionar toggle de redirect na aba "Pixel" abaixo do campo "Tempo de Redirect" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T023 [US3] Adicionar dropdown de evento do botão ao lado do "Evento de Redirect" na aba "Pixel" em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T024 [US3] Condicionar visibilidade do campo "Tempo de Redirect" baseado em `redirectEnabled` em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T025 [US3] Atualizar `handleSubmit` para incluir novos campos no payload em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T026 [US3] Atualizar `handleEdit` para popular novos campos ao editar página em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [x] T027 [US3] Atualizar exibição na lista de páginas para mostrar status de redirect em `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Todas as user stories funcionais e testáveis independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories.

- [x] T028 [P] Adicionar label explicativo abaixo do toggle de redirect em `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T029 Executar validação manual seguindo quickstart.md (7 passos de teste)
- [x] T030 Verificar que build não apresenta erros de tipo com `yarn build`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: Sem dependências - inicia imediatamente
- **User Story 1 (Phase 3)**: Depende de Phase 2 completa
- **User Story 2 (Phase 4)**: Depende de Phase 2 completa (pode parallelizar com US1)
- **User Story 3 (Phase 5)**: Depende de Phases 2, 3 e 4 (Admin UI precisa dos campos funcionando)
- **Polish (Phase 6)**: Depende de todas as user stories completas

### User Story Dependencies

- **User Story 1 (P1)**: Apenas Foundation - independente de outras stories
- **User Story 2 (P2)**: Apenas Foundation - pode ser implementada em paralelo com US1
- **User Story 3 (P3)**: Depende de US1 e US2 para UI refletir campos funcionais

### Within Each Phase

**Foundational (Phase 2)**:
- T001 e T002 podem rodar em paralelo (mesmo arquivo, mas campos independentes)
- T003-T007 devem ser sequenciais (dependências de tipo)

**User Story 1 (Phase 3)**:
- T008-T011 são sequenciais (mesmo componente, lógica dependente)
- T012 pode rodar após T008 (arquivos diferentes)

**User Story 2 (Phase 4)**:
- T013-T018 são sequenciais (lógica interdependente no mesmo componente)

**User Story 3 (Phase 5)**:
- T019-T021 podem rodar em paralelo (tipos e defaults)
- T022-T027 são sequenciais (UI e lógica interdependente)

### Parallel Opportunities

```bash
# Foundational - campos de validação em paralelo:
Task: T001 "Adicionar campo redirectEnabled ao schema Zod"
Task: T002 "Adicionar campo buttonEvent ao schema Zod"

# Após Foundation - User Stories 1 e 2 em paralelo:
# Developer A: US1 (T008-T012)
# Developer B: US2 (T013-T018)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational
2. Complete Phase 3: User Story 1
3. **STOP and VALIDATE**: Testar toggle de redirect independentemente
4. Deploy se necessário (MVP funcional)

### Incremental Delivery

1. Foundation → Data layer pronto
2. Add US1 → Toggle de redirect funcional → Deploy/Demo (MVP!)
3. Add US2 → Eventos separados → Deploy/Demo
4. Add US3 → Admin UI completo → Deploy/Demo
5. Polish → Validação final

### Single Developer Strategy

1. Complete Foundation (T001-T007)
2. Complete US1 (T008-T012) - testar
3. Complete US2 (T013-T018) - testar
4. Complete US3 (T019-T027) - testar
5. Polish (T028-T030)

---

## Summary

| Fase | Tasks | Arquivos |
|------|-------|----------|
| Foundational | 7 | validation.ts, whatsapp-pages.ts |
| User Story 1 | 5 | client.tsx, page.tsx |
| User Story 2 | 6 | client.tsx, page.tsx |
| User Story 3 | 9 | parametrizacao/whatsapp/page.tsx |
| Polish | 3 | parametrizacao/whatsapp/page.tsx |
| **Total** | **30** | **4 arquivos** |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story é independentemente completável e testável
- Commit após cada task ou grupo lógico
- Pare em qualquer checkpoint para validar story independentemente
- Evite: tasks vagas, conflitos no mesmo arquivo, dependências cruzadas que quebram independência
