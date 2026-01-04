# Tasks: Política de Privacidade + Personalização Visual WhatsApp

**Input**: Design documents from `/specs/008-privacy-policy/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Não requisitados - apenas lint check via `yarn lint`

**Organization**: Tasks são agrupadas por user story para permitir implementação e teste independente de cada história.

**Status**: User Stories 1-3 (Política de Privacidade) ✅ COMPLETAS | User Story 4 (Personalização WhatsApp) 🔨 PENDENTE

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

## Phase 6: User Story 4 - Personalização Visual das Páginas WhatsApp (Priority: P2) 🎯 NEW

**Goal**: Administrador pode personalizar texto e aparência da caixa de redirecionamento nas páginas /w/[slug]

**Independent Test**:
1. Acessar http://localhost:3000/parametrizacao/whatsapp
2. Configurar texto personalizado, cor de fundo e toggle de borda
3. Salvar configuração
4. Acessar qualquer página /w/[slug] e verificar mudanças aplicadas

### Foundational Tasks for US4

- [ ] T030 [US4] Add WhatsAppAppearanceConfig type and schema to `frontend/src/lib/validation.ts`
- [ ] T031 [US4] Create whatsapp-appearance repository in `frontend/src/lib/repos/whatsapp-appearance.ts`

### API Layer for US4

- [ ] T032 [P] [US4] Create GET handler for appearance config in `frontend/src/app/api/whatsapp/appearance/route.ts`
- [ ] T033 [P] [US4] Create PUT handler for appearance config in `frontend/src/app/api/whatsapp/appearance/route.ts`

### Admin UI for US4

- [ ] T034 [US4] Add appearance state management (form state, loading, error, success) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T035 [US4] Add appearance form section UI with text input in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T036 [US4] Add color picker input for background color in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T037 [US4] Add toggle switch for border enabled in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T038 [US4] Implement load appearance config on page mount in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T039 [US4] Implement save appearance config handler in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

### Public Page Integration for US4

- [ ] T040 [US4] Import and call getWhatsAppAppearance in server component `frontend/src/app/w/[slug]/page.tsx`
- [ ] T041 [US4] Pass appearance config as prop to WhatsAppRedirectClient in `frontend/src/app/w/[slug]/page.tsx`
- [ ] T042 [US4] Add appearance prop type to WhatsAppRedirectClient in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T043 [US4] Apply custom redirect text from appearance config in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T044 [US4] Apply background color from appearance config (inline style) in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T045 [US4] Apply border styling when borderEnabled is true in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T046 [US4] Implement fallback to default values when config is undefined in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: User Story 4 completa - personalização de aparência funcional em todas as páginas /w/

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories

- [x] T026 [P] Adicionar estilos de impressão (print media query) em `frontend/src/app/globals.css`
- [x] T027 [P] Executar `yarn lint` e corrigir quaisquer erros
- [x] T028 Executar `yarn build` para verificar build de produção
- [x] T029 Validar página seguindo checklist do `quickstart.md`

### New Polish Tasks for US4

- [ ] T047 Run yarn lint and fix any errors related to US4 changes
- [ ] T048 Test complete flow: admin config → save → public page displays custom appearance
- [ ] T049 Test edge case: missing config uses default values (text: "Redirecionando...", no border, no background)
- [ ] T050 Run yarn build and verify production build succeeds
- [ ] T051 Validate US4 following quickstart.md Part 2 checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ Completo
- **Foundational (Phase 2)**: ✅ Completo
- **User Story 1 (Phase 3)**: ✅ Completo - Política de Privacidade
- **User Story 2 (Phase 4)**: ✅ Completo - Responsividade Mobile
- **User Story 3 (Phase 5)**: ✅ Completo - Navegação e Acessibilidade
- **User Story 4 (Phase 6)**: 🔨 PENDENTE - Personalização WhatsApp
  - Depende de T030-T031 (schema + repo) antes de API/UI
- **Polish (Phase 7)**: Depende de US4 estar completa

### User Story 4 Dependencies

- **T030-T031 (Foundational)**: Sem dependências - pode começar imediatamente
- **T032-T033 (API)**: Dependem de T030-T031 - podem rodar em paralelo entre si
- **T034-T039 (Admin UI)**: Dependem de T032-T033 - sequenciais
- **T040-T046 (Public Page)**: Dependem de T032-T033 - podem iniciar após API pronta
- **T047-T051 (Polish)**: Dependem de todas as tarefas US4

### Parallel Opportunities for US4

- T032 e T033 podem rodar em paralelo (mesmo arquivo, handlers independentes)
- Admin UI (T034-T039) e Public Page (T040-T046) podem ser desenvolvidas em paralelo após API pronta

---

## Parallel Example: User Story 4

```bash
# Após T030-T031 (Foundational), lançar API handlers em paralelo:
Task: "Create GET handler in frontend/src/app/api/whatsapp/appearance/route.ts"
Task: "Create PUT handler in frontend/src/app/api/whatsapp/appearance/route.ts"

# Após API pronta, Admin UI e Public Page podem ser desenvolvidas em paralelo:
# Developer A: Admin UI (T034-T039)
# Developer B: Public Page (T040-T046)
```

---

## Implementation Strategy

### Current Status

- ✅ User Stories 1-3 (Política de Privacidade): COMPLETAS
- 🔨 User Story 4 (Personalização WhatsApp): PENDENTE

### US4 Implementation Order

1. Complete T030-T031: Schema + Repository
2. Complete T032-T033: API endpoints
3. **STOP and VALIDATE**: Test API via curl
4. Complete T034-T039: Admin UI
5. **STOP and VALIDATE**: Test admin interface
6. Complete T040-T046: Public page integration
7. **STOP and VALIDATE**: End-to-end test
8. Complete T047-T051: Polish

### Estimativa de Tarefas

| Phase | Story | Tarefas | Status |
|-------|-------|---------|--------|
| Setup | - | 2 | ✅ Completo |
| Foundational | - | 2 | ✅ Completo |
| Phase 3 | US1 | 13 | ✅ Completo |
| Phase 4 | US2 | 4 | ✅ Completo |
| Phase 5 | US3 | 4 | ✅ Completo |
| Phase 6 | US4 | 17 | 🔨 Pendente |
| Phase 7 | Polish | 9 | 🔨 Pendente (5 novos) |
| **Total** | - | **51** | 29 ✅ / 22 🔨 |

### Tarefas Pendentes por Categoria (US4)

| Categoria | Tarefas | IDs |
|-----------|---------|-----|
| Foundational | 2 | T030-T031 |
| API Layer | 2 | T032-T033 |
| Admin UI | 6 | T034-T039 |
| Public Page | 7 | T040-T046 |
| Polish | 5 | T047-T051 |
| **Total US4** | **22** | - |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica para rastreabilidade
- Cada user story deve ser completável e testável independentemente
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar story independentemente
- User Stories 1-3 já completas e funcionais
- User Story 4 é nova implementação completa
