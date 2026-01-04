# Tasks: Personalização Visual das Páginas de WhatsApp

**Input**: Design documents from `/specs/009-whatsapp-appearance/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Não requisitados - apenas lint check via `yarn lint`

**Organization**: Tasks organizadas por camada de implementação para permitir validação incremental.

## Format: `[ID] [P?] [US1] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[US1]**: Todas as tasks pertencem à User Story 1 (Personalização Visual)
- Caminhos exatos incluídos nas descrições

## Path Conventions

- **Projeto**: `frontend/src/` (Next.js App Router)
- **API**: `frontend/src/app/api/whatsapp/appearance/`
- **Admin**: `frontend/src/app/parametrizacao/whatsapp/`
- **Public**: `frontend/src/app/w/[slug]/`
- **Lib**: `frontend/src/lib/`

---

## Phase 1: Foundational (Schema + Repository)

**Purpose**: Criar tipos, validação e acesso a dados

**⚠️ CRITICAL**: API e UI dependem desta fase

- [ ] T001 [US1] Add WhatsAppAppearanceConfig type and schema to `frontend/src/lib/validation.ts`
- [ ] T002 [US1] Create whatsapp-appearance repository in `frontend/src/lib/repos/whatsapp-appearance.ts`

**Checkpoint**: Schema e repository prontos - API pode ser implementada

---

## Phase 2: API Layer

**Purpose**: Endpoints para leitura e escrita da configuração

**Independent Test**: Testar via curl os endpoints GET e PUT

- [ ] T003 [P] [US1] Create GET handler for appearance config in `frontend/src/app/api/whatsapp/appearance/route.ts`
- [ ] T004 [P] [US1] Create PUT handler for appearance config in `frontend/src/app/api/whatsapp/appearance/route.ts`

**Checkpoint**: API funcional - testar via curl antes de prosseguir

```bash
# GET - deve retornar valores padrão
curl http://localhost:3000/api/whatsapp/appearance

# PUT - deve atualizar config
curl -X PUT http://localhost:3000/api/whatsapp/appearance \
  -H "Content-Type: application/json" \
  -d '{"redirectText": "Aguarde...", "backgroundColor": "#f0fdf4", "borderEnabled": true}'
```

---

## Phase 3: Admin UI

**Purpose**: Interface para administrador configurar aparência

**Independent Test**: Acessar /parametrizacao/whatsapp e verificar seção de aparência

- [ ] T005 [US1] Add appearance state management (form state, loading, error, success) in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T006 [US1] Add appearance form section UI with text input in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T007 [US1] Add color picker input for background color in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T008 [US1] Add toggle switch for border enabled in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T009 [US1] Implement load appearance config on page mount in `frontend/src/app/parametrizacao/whatsapp/page.tsx`
- [ ] T010 [US1] Implement save appearance config handler in `frontend/src/app/parametrizacao/whatsapp/page.tsx`

**Checkpoint**: Admin UI funcional - configurar e salvar antes de prosseguir

---

## Phase 4: Public Page Integration

**Purpose**: Aplicar configuração nas páginas /w/[slug]

**Independent Test**: Configurar aparência no admin e verificar em página /w/[slug]

- [ ] T011 [US1] Import and call getWhatsAppAppearance in server component `frontend/src/app/w/[slug]/page.tsx`
- [ ] T012 [US1] Pass appearance config as prop to WhatsAppRedirectClient in `frontend/src/app/w/[slug]/page.tsx`
- [ ] T013 [US1] Add appearance prop type to WhatsAppRedirectClient in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T014 [US1] Apply custom redirect text from appearance config in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T015 [US1] Apply background color from appearance config (inline style) in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T016 [US1] Apply border styling when borderEnabled is true in `frontend/src/app/w/[slug]/client.tsx`
- [ ] T017 [US1] Implement fallback to default values when config is undefined in `frontend/src/app/w/[slug]/client.tsx`

**Checkpoint**: Integração completa - personalização funcional em todas as páginas /w/

---

## Phase 5: Polish & Validation

**Purpose**: Validação final e limpeza

- [ ] T018 Run yarn lint and fix any errors
- [ ] T019 Test complete flow: admin config → save → public page displays custom appearance
- [ ] T020 Test edge case: missing config uses default values (text: "Redirecionando...", no border, no background)
- [ ] T021 Run yarn build and verify production build succeeds
- [ ] T022 Validate following quickstart.md checklist

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Foundational)
    ↓
Phase 2 (API)
    ↓
Phase 3 (Admin UI) ←→ Phase 4 (Public Page)  [podem rodar em paralelo]
    ↓
Phase 5 (Polish)
```

### Parallel Opportunities

- **T003 e T004**: GET e PUT handlers podem rodar em paralelo
- **Phase 3 e Phase 4**: Após API pronta, Admin UI e Public Page podem ser desenvolvidas em paralelo

---

## Implementation Strategy

### Step-by-Step

1. Complete Phase 1: Schema + Repository (T001-T002)
2. Complete Phase 2: API endpoints (T003-T004)
3. **VALIDATE**: Test API via curl
4. Complete Phase 3: Admin UI (T005-T010)
5. **VALIDATE**: Test admin interface
6. Complete Phase 4: Public page integration (T011-T017)
7. **VALIDATE**: End-to-end test
8. Complete Phase 5: Polish (T018-T022)

### Task Summary

| Phase | Tarefas | IDs |
|-------|---------|-----|
| Foundational | 2 | T001-T002 |
| API Layer | 2 | T003-T004 |
| Admin UI | 6 | T005-T010 |
| Public Page | 7 | T011-T017 |
| Polish | 5 | T018-T022 |
| **Total** | **22** | - |

---

## Notes

- [P] tasks = arquivos diferentes, sem dependências
- Todas as tasks pertencem à US1 (única user story desta feature)
- Commit após cada task ou grupo lógico
- Parar em qualquer checkpoint para validar incrementalmente
- Valores padrão: texto "Redirecionando...", sem borda, sem cor de fundo
- Cor da borda quando habilitada: #e5e7eb (gray-200)
