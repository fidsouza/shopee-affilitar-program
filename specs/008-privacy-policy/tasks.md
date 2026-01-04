# Tasks: Página de Política de Privacidade para Lead Ads

**Input**: Design documents from `/specs/008-privacy-policy/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Não requisitados - apenas lint check via `yarn lint`

**Organization**: Tasks são agrupadas por user story para permitir implementação e teste independente de cada história.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story esta task pertence (e.g., US1, US2, US3)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Projeto**: `frontend/src/` (Next.js App Router)
- **Página**: `frontend/src/app/politica-de-privacidade/`
- **Componentes**: `frontend/src/components/privacy-policy/`

---

## Phase 1: Setup (Infraestrutura Compartilhada)

**Purpose**: Estrutura de diretórios e arquivos base

- [x] T001 Criar diretório `frontend/src/app/politica-de-privacidade/`
- [x] T002 [P] Criar diretório `frontend/src/components/privacy-policy/`

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Componentes base que devem estar prontos antes das user stories

**⚠️ CRITICAL**: Nenhum trabalho de user story pode começar até esta fase estar completa

- [x] T003 Criar tipo PolicySection em `frontend/src/components/privacy-policy/types.ts` (id, title, content)
- [x] T004 [P] Criar componente PolicySection em `frontend/src/components/privacy-policy/policy-section.tsx`

**Checkpoint**: Fundação pronta - implementação das user stories pode começar

---

## Phase 3: User Story 1 - Visualização da Política (Priority: P1) 🎯 MVP

**Goal**: Página de política de privacidade acessível via URL pública com todas as 11 seções obrigatórias

**Independent Test**: Acessar `http://localhost:3000/politica-de-privacidade` e verificar se todas as seções estão presentes e legíveis

### Implementation for User Story 1

- [x] T005 [US1] Criar página principal em `frontend/src/app/politica-de-privacidade/page.tsx` com estrutura base e metadados SEO
- [x] T006 [US1] Adicionar seção 1: Introdução - apresentação e escopo da política
- [x] T007 [US1] Adicionar seção 2: Controlador de Dados - nome, contato, email
- [x] T008 [US1] Adicionar seção 3: Dados Coletados - lista de dados pessoais (nome, email, telefone)
- [x] T009 [US1] Adicionar seção 4: Finalidade do Tratamento - para que os dados são usados
- [x] T010 [US1] Adicionar seção 5: Base Legal - fundamento jurídico (consentimento)
- [x] T011 [US1] Adicionar seção 6: Compartilhamento de Dados - com quem os dados podem ser compartilhados
- [x] T012 [US1] Adicionar seção 7: Retenção de Dados - período de armazenamento
- [x] T013 [US1] Adicionar seção 8: Direitos do Titular - direitos garantidos pela LGPD
- [x] T014 [US1] Adicionar seção 9: Exercício de Direitos - como solicitar acesso, correção, exclusão
- [x] T015 [US1] Adicionar seção 10: Cookies - informações sobre uso de cookies
- [x] T016 [US1] Adicionar seção 11: Atualizações da Política - data da última atualização visível
- [x] T017 [US1] Verificar que todas as 11 seções estão presentes e com conteúdo completo

**Checkpoint**: User Story 1 deve estar totalmente funcional - página acessível com todo o conteúdo legal

---

## Phase 4: User Story 2 - Responsividade Mobile (Priority: P1)

**Goal**: Página perfeitamente legível em dispositivos móveis a partir de 320px

**Independent Test**: Acessar a página em DevTools com viewport de 320px, 375px, 768px e verificar legibilidade sem scroll horizontal

### Implementation for User Story 2

- [x] T018 [US2] Aplicar classes Tailwind responsive em `frontend/src/app/politica-de-privacidade/page.tsx` (container, padding, margin)
- [x] T019 [US2] Configurar tipografia responsiva (text-sm/base/lg para diferentes breakpoints)
- [x] T020 [US2] Garantir espaçamento adequado entre seções para toque mobile
- [x] T021 [US2] Testar layout em 320px, 375px, 768px, 1024px e corrigir problemas

**Checkpoint**: User Stories 1 E 2 devem funcionar independentemente - página acessível e responsiva

---

## Phase 5: User Story 3 - Navegação e Acessibilidade (Priority: P2)

**Goal**: Navegação facilitada entre seções com estrutura semântica clara

**Independent Test**: Navegar pelos títulos das seções e verificar se a hierarquia (h1, h2, h3) está correta e links âncora funcionam

### Implementation for User Story 3

- [x] T022 [US3] Implementar hierarquia de headings semântica (h1 para título principal, h2 para seções) em `frontend/src/app/politica-de-privacidade/page.tsx`
- [x] T023 [US3] Adicionar IDs âncora para cada seção permitindo navegação direta
- [x] T024 [US3] Adicionar índice/sumário no topo da página com links para cada seção
- [x] T025 [US3] Verificar contraste de cores seguindo WCAG 2.1 AA (ratio mínimo 4.5:1)

**Checkpoint**: Todas as user stories devem funcionar independentemente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [x] T026 [P] Adicionar estilos de impressão (print media query) em `frontend/src/app/globals.css`
- [x] T027 [P] Executar `yarn lint` e corrigir quaisquer erros
- [x] T028 Executar `yarn build` para verificar build de produção
- [x] T029 Validar página seguindo checklist do `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode começar imediatamente
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEIA todas as user stories
- **User Stories (Phase 3+)**: Dependem da fase Foundational
  - US1 (P1): Pode começar após Foundational - MVP
  - US2 (P1): Pode ser implementada junto com US1 (mesmo arquivo, classes Tailwind)
  - US3 (P2): Pode começar após Foundational - melhoria de navegação
- **Polish (Phase 6)**: Depende de todas as user stories desejadas estarem completas

### User Story Dependencies

- **User Story 1 (P1)**: Pode começar após Foundational (Phase 2) - Sem dependências de outras stories
- **User Story 2 (P1)**: Na prática, implementada junto com US1 pois são classes Tailwind no mesmo arquivo
- **User Story 3 (P2)**: Pode começar após Foundational (Phase 2) - Adiciona navegação à página existente

### Within Each User Story

- Seções da política podem ser implementadas em paralelo por diferentes desenvolvedores
- Preferência por implementar em ordem numérica para manter organização
- Story complete antes de passar para próxima prioridade

### Parallel Opportunities

- T001 e T002 podem rodar em paralelo (Setup)
- T003 e T004 podem rodar em paralelo (Foundational)
- T006-T016 poderiam ser paralelizadas se múltiplos desenvolvedores disponíveis
- T026 e T027 podem rodar em paralelo (Polish)

---

## Parallel Example: User Story 1

```bash
# Como esta é uma página estática simples, a maior oportunidade de paralelização
# seria com múltiplos desenvolvedores escrevendo diferentes seções:

# Desenvolvedor A:
Task: "Adicionar seção 1-4 (Introdução, Controlador, Dados, Finalidade)"

# Desenvolvedor B:
Task: "Adicionar seção 5-8 (Base Legal, Compartilhamento, Retenção, Direitos)"

# Desenvolvedor C:
Task: "Adicionar seção 9-11 (Exercício, Cookies, Atualizações)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (2 tasks)
2. Complete Phase 2: Foundational (2 tasks)
3. Complete Phase 3: User Story 1 (13 tasks)
4. **STOP and VALIDATE**: Testar página em `http://localhost:3000/politica-de-privacidade`
5. Deploy/demo se pronto - já atende requisitos do Meta para lead ads

### Incremental Delivery

1. Complete Setup + Foundational → Fundação pronta
2. Add User Story 1 → Test → Deploy (MVP! Página funcional)
3. Add User Story 2 → Test → Deploy (Mobile otimizado)
4. Add User Story 3 → Test → Deploy (Navegação melhorada)
5. Add Polish → Test → Deploy final

### Estimativa de Tarefas por Story

| Story | Tarefas | Descrição |
|-------|---------|-----------|
| Setup | 2 | Criação de diretórios |
| Foundational | 2 | Tipos e componente base |
| User Story 1 | 13 | Página com 11 seções + validação |
| User Story 2 | 4 | Responsividade mobile |
| User Story 3 | 4 | Navegação e acessibilidade |
| Polish | 4 | Impressão, lint, build, validação |
| **Total** | **29** | - |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica para rastreabilidade
- Cada user story deve ser completável e testável independentemente
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
- Evitar: tasks vagas, conflitos no mesmo arquivo, dependências entre stories que quebram independência
