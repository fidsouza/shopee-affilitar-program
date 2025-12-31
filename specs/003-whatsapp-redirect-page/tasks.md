# Tasks: WhatsApp Redirect Page - Multi-Event Support

**Input**: Design documents from `/specs/003-whatsapp-redirect-page/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓
**Updated**: 2025-12-31 (Multi-Event Support)
**Implementation Completed**: 2025-12-31

**Tests**: Não solicitados - projeto usa testes manuais

**Organization**: Tasks organizadas por user story para implementação e teste independente

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story relacionada (US1, US2, US3)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Web app**: `frontend/src/` (Next.js App Router)

---

## Update Summary (2025-12-31)

**Mudança principal**: Substituir `buttonEvent` (único) por `events[]` (múltiplos, page load) + `redirectEvent` (único, antes do redirect)

**Tarefas existentes afetadas**:
- T002: Schema Zod precisa ser atualizado ✅
- T004: Tipos precisam ser atualizados ✅
- T016: UI de seleção de evento precisa mudar ✅
- T024, T030-T033: Lógica de disparo de eventos precisa mudar ✅

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estrutura base e validação schema

- [x] T001 Add WhatsApp URL validation helper `isAllowedWhatsAppHost()` in `frontend/src/lib/validation.ts`
- [x] T002 **UPDATE**: Update `whatsAppPageSchema` Zod schema with `events[]` (array, min 1) and `redirectEvent` (single) replacing `buttonEvent` in `frontend/src/lib/validation.ts`
- [x] T003 Add `deleteWhatsAppPageSchema` Zod schema in `frontend/src/lib/validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Repository e API routes que DEVEM estar prontos antes das user stories

**⚠️ CRÍTICO**: Nenhuma user story pode começar até esta fase estar completa

- [x] T004 **UPDATE**: Update WhatsAppPageRecord type with `events: MetaEvent[]` and `redirectEvent: MetaEvent` (remove `buttonEvent`) in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T005 **UPDATE**: Update `listWhatsAppPages()` to handle migration from `buttonEvent` to `events`/`redirectEvent` in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T006 Implement `getWhatsAppPageBySlug()` function in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T007 **UPDATE**: Update `upsertWhatsAppPage()` to save `events` and `redirectEvent` fields in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T008 Implement `deleteWhatsAppPage()` function in `frontend/src/lib/repos/whatsapp-pages.ts`
- [x] T009 [P] Create GET handler for listing pages in `frontend/src/app/api/whatsapp/route.ts`
- [x] T010 **UPDATE**: Update POST handler validation to require `events[]` (min 1) and `redirectEvent` in `frontend/src/app/api/whatsapp/route.ts`
- [x] T011 Create DELETE handler in `frontend/src/app/api/whatsapp/[id]/route.ts`

**Checkpoint**: Foundation ready - implementação das user stories pode começar ✅

---

## Phase 3: User Story 1 - Admin Creates WhatsApp Redirect Page (Priority: P1) 🎯 MVP

**Goal**: Admin pode criar uma página de WhatsApp completa com seleção múltipla de eventos e evento de redirecionamento

**Independent Test**: Criar uma página no admin selecionando múltiplos eventos e um evento de redirect, verificar se dados são salvos corretamente

### Implementation for User Story 1

- [x] T012 [US1] Add "Páginas WhatsApp" navigation item with MessageCircle icon in `frontend/src/app/admin/layout.tsx`
- [x] T013 [US1] Create admin page component structure in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T014 **UPDATE** [US1] Update form state to use `events: MetaEvent[]` and `redirectEvent: MetaEvent` (remove buttonEvent state) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T015 [US1] Implement Pixel Config dropdown (fetch from /api/pixels) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T016 **NEW** [US1] Implement checkboxes for multiple event selection (events[]) with min 1 validation in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T017 **NEW** [US1] Implement dropdown for redirectEvent selection (single event) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T018 [US1] Implement redirectDelay input field (1-30 seconds, default 5) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T019 [US1] Implement status radio buttons (active/inactive) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T020 [US1] Implement socialProofs textarea (one line per proof) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T021 **UPDATE** [US1] Update form submission to send `events[]` and `redirectEvent` instead of `buttonEvent` in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T022 [US1] Add success/error feedback after form submission in `frontend/src/app/admin/whatsapp/page.tsx`

**Checkpoint**: Admin pode criar páginas WhatsApp com múltiplos eventos - MVP funcional ✅

---

## Phase 4: User Story 2 - Visitor Views WhatsApp Redirect Page (Priority: P1)

**Goal**: Visitante visualiza a página, todos os eventos[] são disparados no load, redirectEvent é disparado antes do redirect

**Independent Test**: Acessar `/w/[slug]`, verificar que eventos[] disparam no load, redirectEvent dispara antes do redirect

### Implementation for User Story 2

- [x] T023 [US2] Create server component with Edge Runtime in `frontend/src/app/w/[slug]/page.tsx`
- [x] T024 **UPDATE** [US2] Update server-side to fire ALL events in `events[]` array via Conversion API on page load in `frontend/src/app/w/[slug]/page.tsx`
- [x] T025 **NEW** [US2] Generate separate eventId for redirect event and pass to client in `frontend/src/app/w/[slug]/page.tsx`
- [x] T026 [US2] Create client component structure in `frontend/src/app/w/[slug]/client.tsx`
- [x] T027 **UPDATE** [US2] Update Props interface to include `redirectEventId` in `frontend/src/app/w/[slug]/client.tsx`
- [x] T028 [US2] Implement circular header image display (if headerImageUrl exists) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T029 [US2] Implement headline and social proofs display in `frontend/src/app/w/[slug]/client.tsx`
- [x] T030 [US2] Implement CTA button with buttonText in `frontend/src/app/w/[slug]/client.tsx`
- [x] T031 [US2] Implement countdown timer with visual display in `frontend/src/app/w/[slug]/client.tsx`
- [x] T032 **UPDATE** [US2] Update Meta Pixel SDK initialization to fire PageView + ALL events[] on mount in `frontend/src/app/w/[slug]/client.tsx`
- [x] T033 **NEW** [US2] Add `hasTrackedPageEvents` ref for page load event deduplication in `frontend/src/app/w/[slug]/client.tsx`
- [x] T034 **UPDATE** [US2] Update button click/countdown handler to fire `redirectEvent` (not buttonEvent) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T035 **NEW** [US2] Add `hasTrackedRedirect` ref for redirect event deduplication (prevents double fire on click+countdown race) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T036 **NEW** [US2] Add API call to fire redirectEvent server-side before redirect in `frontend/src/app/w/[slug]/client.tsx`
- [x] T037 [US2] Implement redirect to whatsappUrl after event fires in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: Páginas públicas funcionando com múltiplos eventos no load e evento de redirect ✅

---

## Phase 5: User Story 3 - Admin Manages Multiple WhatsApp Pages (Priority: P2)

**Goal**: Admin pode listar, editar, ativar/desativar e excluir páginas existentes

**Independent Test**: Criar múltiplas páginas, verificar listagem mostra eventos corretamente, edição preserva eventos

### Implementation for User Story 3

- [x] T038 [US3] Implement pages list display (fetch from /api/whatsapp) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T039 **UPDATE** [US3] Update list display to show `events[]` count and `redirectEvent` in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T040 [US3] Implement "Copy Link" button for `/w/[slug]` URL in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T041 **UPDATE** [US3] Update edit functionality to populate `events[]` checkboxes and `redirectEvent` dropdown in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T042 [US3] Implement delete confirmation dialog using useConfirmDelete hook in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T043 [US3] Implement delete action (DELETE to /api/whatsapp/[id]) in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T044 [US3] Add "View Page" button that opens `/w/[slug]` in new tab in `frontend/src/app/admin/whatsapp/page.tsx`

**Checkpoint**: Gerenciamento completo de páginas WhatsApp funcionando com múltiplos eventos ✅

---

## Phase 6: API for Redirect Event Tracking

**Purpose**: Endpoint para disparar redirectEvent server-side antes do redirect

- [x] T045 **NEW** Create POST handler for tracking redirect event in `frontend/src/app/api/whatsapp/track-redirect/route.ts`
- [x] T046 **NEW** Implement Conversion API call for redirectEvent in track-redirect handler in `frontend/src/app/api/whatsapp/track-redirect/route.ts`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias e edge cases

- [x] T047 Add graceful degradation for JavaScript disabled (button as direct link) in `frontend/src/app/w/[slug]/client.tsx`
- [x] T048 Add loading state while fetching pages in admin in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T049 **UPDATE** Validate events[] has at least 1 item and redirectEvent is selected in form validation in `frontend/src/app/admin/whatsapp/page.tsx`
- [x] T050 Ensure responsive design for redirect page on mobile in `frontend/src/app/w/[slug]/client.tsx`
- [x] T051 Add logging for create/update/delete operations in `frontend/src/lib/repos/whatsapp-pages.ts`
- [ ] T052 **NEW** Run manual test: create page with multiple events → access /w/[slug] → verify ALL events fire on load
- [ ] T053 **NEW** Run manual test: click button → verify redirectEvent fires BEFORE redirect
- [ ] T054 **NEW** Run manual test: wait for countdown → verify redirectEvent fires BEFORE auto-redirect
- [ ] T055 **NEW** Run manual test: click button multiple times rapidly → verify redirectEvent fires only ONCE
- [ ] T056 Run manual test: edit page → verify events[] and redirectEvent are preserved
- [ ] T057 Run manual test: delete page → verify 404 on /w/[slug]

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências - pode iniciar imediatamente ✅
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEIA todas as user stories ✅
- **User Stories (Phase 3-5)**: Dependem de Foundational completo ✅
  - US1 e US2 são ambas P1 e podem rodar em paralelo ✅
  - US3 (P2) pode rodar após Foundational ✅
- **API (Phase 6)**: Pode rodar em paralelo com US2 ✅
- **Polish (Phase 7)**: Depende de todas as user stories (testes manuais pendentes)

### Task Dependencies for Multi-Event Update

```
T002 (Zod schema) → T004 (Types) → T005/T007/T010 (Repository/API) ✅
                                         ↓
T016/T017 (Admin checkboxes) ← depende de → T014/T021 (Form state) ✅
                                         ↓
T024/T025 (Server events) → T027/T032-T036 (Client events) ✅
                                         ↓
T045/T046 (Track-redirect API) → usado por T036 ✅
```

---

## Implementation Status

### Build Verification

```
✓ Compiled successfully
✓ TypeScript check passed
✓ All routes generated correctly
```

### Files Modified

| File | Changes |
|------|---------|
| `frontend/src/lib/validation.ts` | Updated schema: `events[]` + `redirectEvent` |
| `frontend/src/lib/repos/whatsapp-pages.ts` | Updated types + migration logic |
| `frontend/src/app/api/whatsapp/route.ts` | Uses updated schema validation |
| `frontend/src/app/api/whatsapp/track-redirect/route.ts` | **NEW** - Fires redirect event server-side |
| `frontend/src/app/admin/whatsapp/page.tsx` | Checkboxes + dropdown for events |
| `frontend/src/app/w/[slug]/page.tsx` | Fires all events[] on load |
| `frontend/src/app/w/[slug]/client.tsx` | Page events + redirect event with deduplication |

---

## Task Count Summary (Final)

| Phase | Total | Completed | Pending |
|-------|-------|-----------|---------|
| Phase 1: Setup | 3 | 3 | 0 |
| Phase 2: Foundational | 8 | 8 | 0 |
| Phase 3: User Story 1 | 11 | 11 | 0 |
| Phase 4: User Story 2 | 15 | 15 | 0 |
| Phase 5: User Story 3 | 7 | 7 | 0 |
| Phase 6: API | 2 | 2 | 0 |
| Phase 7: Polish | 11 | 5 | 6 (testes manuais) |
| **Total** | **57** | **51** | **6** |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- [Story] label mapeia task para user story específica
- Cada user story deve ser completável e testável independentemente
- **UPDATE** tasks = modificar código existente (não criar do zero)
- **NEW** tasks = adicionar novo código/funcionalidade
- Commit após cada task ou grupo lógico
- Pare em qualquer checkpoint para validar
- Evite: tasks vagas, conflitos de arquivo, dependências entre stories que quebrem independência
