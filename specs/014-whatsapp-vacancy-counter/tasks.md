# Tasks: WhatsApp Vacancy Counter

**Input**: Design documents from `/specs/014-whatsapp-vacancy-counter/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Não solicitados - projeto usa apenas ESLint para linting.

**Organization**: Tasks organizadas por user story para permitir implementação e teste independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: Qual user story a task pertence (US1, US2, US3)
- Paths exatos incluídos nas descrições

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Não necessário - projeto já existe e está configurado.

*Esta feature é uma extensão de funcionalidade existente. Nenhuma configuração inicial necessária.*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada de dados e validação que DEVE estar completa antes de qualquer user story.

**⚠️ CRITICAL**: Nenhuma implementação de UI pode começar até esta fase estar completa.

- [x] T001 [P] Adicionar campos vacancy* ao schema whatsAppPageSchema em frontend/src/lib/validation.ts
- [x] T002 [P] Atualizar type WhatsAppPageRecord com campos vacancy* em frontend/src/lib/repos/whatsapp-pages.ts
- [x] T003 [P] Atualizar type LegacyWhatsAppPageRecord com campos vacancy* opcionais em frontend/src/lib/repos/whatsapp-pages.ts
- [x] T004 Atualizar função migrateRecord com defaults para campos vacancy* em frontend/src/lib/repos/whatsapp-pages.ts
- [x] T005 Atualizar função upsertWhatsAppPage com campos vacancy* em frontend/src/lib/repos/whatsapp-pages.ts

**Checkpoint**: Camada de dados pronta - implementação de UI pode começar.

---

## Phase 3: User Story 1 - Administrador Habilita Contador (Priority: P1) 🎯 MVP

**Goal**: Administrador pode habilitar e configurar o contador de vagas na aba Gatilhos do painel admin.

**Independent Test**: Criar/editar página WhatsApp, habilitar contador com headline/número/footer, salvar e verificar persistência.

### Implementation for User Story 1

- [x] T006 [US1] Atualizar type FormState com campos vacancy* em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T007 [US1] Atualizar initialForm com defaults para campos vacancy* em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T008 [US1] Adicionar seção "Contador de Vagas" na aba Gatilhos (após Social Proof) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T009 [US1] Implementar toggle checkbox vacancyCounterEnabled com label explicativo em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T010 [US1] Implementar input vacancyHeadline (text, max 100 chars, required quando enabled) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T011 [US1] Implementar input vacancyCount (number, min 0) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T012 [US1] Implementar input vacancyFooter (text, max 200 chars, opcional) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T013 [US1] Implementar color picker vacancyBackgroundColor (igual Aparência Global) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T014 [P] [US1] Implementar seletor vacancyCountFontSize (Pequeno/Médio/Grande) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T015 [P] [US1] Implementar seletor vacancyHeadlineFontSize (Pequeno/Médio/Grande) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T016 [P] [US1] Implementar seletor vacancyFooterFontSize (Pequeno/Médio/Grande) em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T017 [US1] Implementar preview do componente contador na seção de configuração em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T018 [US1] Atualizar handleSubmit para incluir campos vacancy* no payload em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T019 [US1] Atualizar handleEdit para popular campos vacancy* do form ao editar em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T020 [US1] Atualizar resetForm para limpar campos vacancy* em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T021 [US1] Atualizar listagem para exibir badge "Contador" quando vacancyCounterEnabled em frontend/src/app/parametrizacao/whatsapp/page.tsx

**Checkpoint**: Admin pode configurar contador de vagas. Testar criação/edição/persistência.

---

## Phase 4: User Story 2 - Visitante Visualiza Contador (Priority: P1)

**Goal**: Visitante vê o componente de contador de vagas na página pública /w/[slug] quando habilitado.

**Independent Test**: Acessar /w/[slug] com contador habilitado e verificar exibição correta de headline, número e footer.

### Implementation for User Story 2

- [x] T022 [US2] Adicionar constante VACANCY_FONT_SIZE_CLASSES mapeando EmojiSize para classes Tailwind em frontend/src/app/w/[slug]/client.tsx
- [x] T023 [US2] Implementar componente VacancyCounter inline com estrutura headline/número/footer em frontend/src/app/w/[slug]/client.tsx
- [x] T024 [US2] Aplicar estilo de borda sempre ativa (border border-gray-200) no VacancyCounter em frontend/src/app/w/[slug]/client.tsx
- [x] T025 [US2] Aplicar backgroundColor dinâmico via style prop no VacancyCounter em frontend/src/app/w/[slug]/client.tsx
- [x] T026 [US2] Aplicar classes de tamanho de fonte para headline usando vacancyHeadlineFontSize em frontend/src/app/w/[slug]/client.tsx
- [x] T027 [US2] Aplicar classes de tamanho de fonte para número usando vacancyCountFontSize (com text-green-600 font-bold) em frontend/src/app/w/[slug]/client.tsx
- [x] T028 [US2] Aplicar classes de tamanho de fonte para footer usando vacancyFooterFontSize em frontend/src/app/w/[slug]/client.tsx
- [x] T029 [US2] Renderizar VacancyCounter condicionalmente quando page.vacancyCounterEnabled é true em frontend/src/app/w/[slug]/client.tsx
- [x] T030 [US2] Ocultar footer quando vacancyFooter é null ou vazio em frontend/src/app/w/[slug]/client.tsx

**Checkpoint**: Visitante vê contador na página pública. Testar responsividade mobile/desktop.

---

## Phase 5: User Story 3 - Exclusividade Mútua com Redirect (Priority: P2)

**Goal**: Sistema impede que contador e redirect estejam habilitados simultaneamente.

**Independent Test**: Tentar habilitar contador quando redirect está ativo (e vice-versa) e verificar bloqueio com mensagem.

### Implementation for User Story 3

- [x] T031 [US3] Implementar lógica de exclusividade: desabilitar checkbox vacancyCounterEnabled quando redirectEnabled é true em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T032 [US3] Implementar lógica de exclusividade: desabilitar checkbox redirectEnabled quando vacancyCounterEnabled é true em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T033 [US3] Adicionar mensagem explicativa "Desabilite o redirect para usar o contador" quando contador bloqueado em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T034 [US3] Adicionar mensagem explicativa "Desabilite o contador para usar o redirect" quando redirect bloqueado em frontend/src/app/parametrizacao/whatsapp/page.tsx
- [x] T035 [US3] Estilizar checkboxes bloqueados com opacity reduzida e cursor not-allowed em frontend/src/app/parametrizacao/whatsapp/page.tsx

**Checkpoint**: Exclusividade mútua funciona. Testar todos os cenários de transição.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories.

- [x] T036 Executar yarn lint e corrigir quaisquer erros de linting em frontend/
- [x] T037 Executar yarn build e verificar build sem erros em frontend/
- [x] T038 Validar cenários do quickstart.md manualmente (criar página, exclusividade, página pública, backward compatibility)
- [x] T039 Testar backward compatibility: verificar páginas existentes continuam funcionando sem contador

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Não necessário
- **Foundational (Phase 2)**: Pode começar imediatamente - BLOQUEIA todas as user stories
- **User Stories (Phase 3-5)**: Todas dependem da Phase 2 estar completa
  - US1 e US2 podem rodar em paralelo (arquivos diferentes)
  - US3 depende de US1 estar completa (modifica mesmo arquivo)
- **Polish (Phase 6)**: Depende de todas as user stories estarem completas

### User Story Dependencies

- **User Story 1 (P1)**: Depende de Phase 2 - Arquivo: page.tsx (admin)
- **User Story 2 (P1)**: Depende de Phase 2 - Arquivo: client.tsx (público) - **Pode rodar em paralelo com US1**
- **User Story 3 (P2)**: Depende de US1 - Mesmo arquivo: page.tsx (admin)

### Within Each User Story

- Form state antes de inputs
- Inputs antes de handlers
- Handlers antes de listagem

### Parallel Opportunities

**Phase 2 (Foundational)**:
- T001, T002, T003 podem rodar em paralelo (arquivos/seções diferentes)

**Phase 3 (US1)**:
- T014, T015, T016 podem rodar em paralelo (seletores independentes)

**Cross-Story**:
- US1 (page.tsx) e US2 (client.tsx) podem rodar em paralelo - arquivos diferentes

---

## Parallel Example: Foundational + User Stories

```bash
# Launch foundational tasks in parallel:
Task: "Adicionar campos vacancy* ao schema em frontend/src/lib/validation.ts"
Task: "Atualizar type WhatsAppPageRecord em frontend/src/lib/repos/whatsapp-pages.ts"
Task: "Atualizar type LegacyWhatsAppPageRecord em frontend/src/lib/repos/whatsapp-pages.ts"

# After foundational, launch US1 and US2 in parallel:
Task: "US1 - Implementar form admin" (page.tsx)
Task: "US2 - Implementar componente público" (client.tsx)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 2: Foundational (T001-T005)
2. Complete Phase 3: User Story 1 (T006-T021) - Admin pode configurar
3. Complete Phase 4: User Story 2 (T022-T030) - Visitante pode ver
4. **STOP and VALIDATE**: Testar fluxo completo admin → público
5. Deploy/demo se ready

### Full Feature

1. MVP acima
2. Complete Phase 5: User Story 3 (T031-T035) - Exclusividade mútua
3. Complete Phase 6: Polish (T036-T039)
4. Feature completa

### Parallel Strategy (2 developers)

1. Ambos completam Phase 2 juntos
2. Developer A: User Story 1 (admin form)
3. Developer B: User Story 2 (public component)
4. Developer A: User Story 3 (exclusividade - mesmo arquivo de US1)
5. Ambos: Phase 6 (polish)

---

## Summary

| Fase | Tasks | Arquivos Principais |
|------|-------|---------------------|
| Phase 2: Foundational | T001-T005 (5 tasks) | validation.ts, whatsapp-pages.ts |
| Phase 3: US1 Admin | T006-T021 (16 tasks) | page.tsx (admin) |
| Phase 4: US2 Público | T022-T030 (9 tasks) | client.tsx (público) |
| Phase 5: US3 Exclusividade | T031-T035 (5 tasks) | page.tsx (admin) |
| Phase 6: Polish | T036-T039 (4 tasks) | - |
| **Total** | **39 tasks** | |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story é independentemente completável e testável
- Commit após cada task ou grupo lógico
- Pare em qualquer checkpoint para validar story independentemente
