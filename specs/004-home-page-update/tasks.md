# Tasks: Home Page Simplification and Admin Route Rename

**Input**: Design documents from `/specs/004-home-page-update/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Não solicitados - validação manual via navegador conforme plan.md

**Organization**: Tasks organizadas por user story para implementação independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story associada (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

---

## Phase 1: Setup

**Purpose**: Preparação do ambiente - não há setup adicional necessário

- [x] T001 Verificar que está no branch correto: `git branch` deve mostrar `004-home-page-update`

---

## Phase 2: Foundational (Renomeação de Rota)

**Purpose**: Renomear diretório admin para parametrizacao - BLOQUEIA User Stories 1 e 2

**⚠️ CRITICAL**: Esta mudança deve ser feita primeiro pois afeta todas as rotas administrativas

- [x] T002 Renomear diretório `frontend/src/app/admin/` para `frontend/src/app/parametrizacao/`
- [x] T003 Verificar que todas as sub-rotas foram movidas: `ls frontend/src/app/parametrizacao/` deve mostrar layout.tsx, page.tsx, pixels/, products/, whatsapp/

**Checkpoint**: Rotas /parametrizacao/* devem funcionar, /admin deve retornar 404

---

## Phase 3: User Story 1 - Visitor Sees Under Construction Page (Priority: P1) 🎯 MVP

**Goal**: Visitante vê apenas "Página em Construção" na home page, sem informações do sistema

**Independent Test**: Acessar `/` e verificar que mostra apenas mensagem de construção, sem links ou informações do sistema

### Implementation for User Story 1

- [x] T004 [US1] Simplificar `frontend/src/app/page.tsx`: remover todos os textos sobre o sistema, remover imports não utilizados, exibir apenas "Página em Construção" centralizado com Tailwind
- [x] T005 [P] [US1] Atualizar `frontend/src/app/layout.tsx`: mudar title no metadata para incluir emoji 🏷️, limpar description

**Checkpoint**: User Story 1 completa - home page mostra apenas "Página em Construção" com emoji 🏷️ na aba

---

## Phase 4: User Story 2 - Admin Access via New Route (Priority: P1)

**Goal**: Administrador acessa dashboard via /parametrizacao, /admin retorna 404

**Independent Test**: Acessar `/parametrizacao` mostra dashboard, `/admin` retorna 404

### Implementation for User Story 2

- [x] T006 [US2] Verificar navegação em `frontend/src/app/parametrizacao/layout.tsx`: confirmar que não há referências hardcoded a /admin (CORRIGIDO: links atualizados para /parametrizacao)
- [x] T007 [US2] Testar acesso a `/parametrizacao/products` - deve funcionar normalmente
- [x] T008 [US2] Testar acesso a `/parametrizacao/pixels` - deve funcionar normalmente
- [x] T009 [US2] Testar acesso a `/parametrizacao/whatsapp` - deve funcionar normalmente
- [x] T010 [US2] Testar acesso a `/admin` - deve retornar 404

**Checkpoint**: User Story 2 completa - área administrativa acessível apenas via /parametrizacao

---

## Phase 5: User Story 3 - Updated Documentation (Priority: P2)

**Goal**: CLAUDE.md reflete as mudanças: home page de construção, rota /parametrizacao

**Independent Test**: Ler CLAUDE.md e verificar informações sobre home page e rota administrativa

### Implementation for User Story 3

- [x] T011 [US3] Atualizar seção "Directory Structure" em `CLAUDE.md`: mudar `admin/` para `parametrizacao/`
- [x] T012 [US3] Atualizar descrição da rota em `CLAUDE.md`: mencionar que admin dashboard está em /parametrizacao
- [x] T013 [US3] Adicionar nota sobre home page em `CLAUDE.md`: mencionar que home page exibe "Página em Construção"

**Checkpoint**: User Story 3 completa - documentação atualizada

---

## Phase 6: Polish & Validation

**Purpose**: Validação final e build

- [x] T014 Executar `yarn build` em `frontend/` - deve passar sem erros (limpeza de cache .next necessária)
- [x] T015 Executar `yarn dev` e validar manualmente:
  - `/` mostra "Página em Construção"
  - `/` não tem links para admin
  - `/admin` retorna 404
  - `/parametrizacao` mostra dashboard
  - Emoji 🏷️ aparece na aba do navegador
- [x] T016 Fazer commit das mudanças com mensagem descritiva

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEIA User Stories
- **User Story 1 (Phase 3)**: Depende de Foundational
- **User Story 2 (Phase 4)**: Depende de Foundational
- **User Story 3 (Phase 5)**: Pode rodar em paralelo com US1 e US2
- **Polish (Phase 6)**: Depende de todas as User Stories

### User Story Dependencies

- **User Story 1 (P1)**: Depende apenas de Phase 2 (Foundational)
- **User Story 2 (P1)**: Depende apenas de Phase 2 (Foundational)
- **User Story 3 (P2)**: Independente - apenas documentação

### Parallel Opportunities

```text
Após Phase 2 (Foundational):
├── User Story 1 (T004, T005) - podem rodar em paralelo entre si
├── User Story 2 (T006-T010) - validação sequencial
└── User Story 3 (T011-T013) - podem rodar em paralelo com US1 e US2
```

---

## Parallel Example: User Story 1

```bash
# T004 e T005 podem rodar em paralelo (arquivos diferentes):
Task: "Simplificar frontend/src/app/page.tsx"
Task: "Atualizar frontend/src/app/layout.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T003)
3. Complete Phase 3: User Story 1 (T004-T005)
4. Complete Phase 4: User Story 2 (T006-T010)
5. **STOP and VALIDATE**: Testar home page e rotas administrativas
6. Deploy se pronto

### Full Implementation

1. MVP completo (acima)
2. Add User Story 3 (T011-T013) → Documentação
3. Phase 6: Polish & Validation (T014-T016)
4. Commit e PR

---

## Summary

| Métrica | Valor |
|---------|-------|
| Total de Tasks | 16 |
| Tasks User Story 1 | 2 |
| Tasks User Story 2 | 5 |
| Tasks User Story 3 | 3 |
| Tasks Parallelizáveis | 3 (T004/T005, T011/T012/T013) |
| MVP Scope | User Stories 1 + 2 (8 tasks) |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Validação manual via navegador (sem testes automatizados)
- Commit após cada fase completa
- Build deve passar antes de finalizar
