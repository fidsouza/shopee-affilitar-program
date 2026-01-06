# Implementation Plan: Aparência Global na Aba Geral e Remoção de Bordas

**Branch**: `012-admin-appearance-general` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-admin-appearance-general/spec.md`

## Summary

Reorganizar a interface administrativa do sistema de afiliados, movendo os campos de "Aparência Global" para dentro da aba "Geral" na página de WhatsApp, e removendo bordas duplicadas em todas as páginas administrativas (WhatsApp, Produtos, Pixels). A estratégia é manter bordas apenas no wrapper principal do layout e nos inputs de formulário.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - sem alterações nesta feature
**Testing**: ESLint (yarn lint)
**Target Platform**: Web (navegadores modernos)
**Project Type**: Web application (frontend only)
**Performance Goals**: N/A - feature de UI apenas
**Constraints**: Manter compatibilidade com o design system shadcn/ui
**Scale/Scope**: 3 páginas admin afetadas (WhatsApp, Products, Pixels)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui um constitution.md configurado com princípios específicos. Seguindo boas práticas padrão:

| Principle | Status | Notes |
|-----------|--------|-------|
| Simplicity | PASS | Remoção de código (bordas), não adição |
| Consistency | PASS | Aplicando mesmo padrão em todas as páginas |
| No Breaking Changes | PASS | Apenas mudanças visuais, sem alteração de API/dados |

## Project Structure

### Documentation (this feature)

```text
specs/012-admin-appearance-general/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - no data changes)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/src/app/parametrizacao/
├── layout.tsx           # Layout wrapper com borda principal (MANTER)
├── whatsapp/
│   └── page.tsx         # Mover Aparência Global para aba Geral, remover bordas
├── products/
│   └── page.tsx         # Remover bordas de containers e items
└── pixels/
    └── page.tsx         # Remover bordas de containers e items
```

**Structure Decision**: Frontend-only, modificações em 3 arquivos de página + preservação do layout wrapper.

## Complexity Tracking

> Nenhuma violação de complexidade - feature é simplificação de código existente.

## Files to Modify

### High-Impact Files

| File | Changes | FR Coverage |
|------|---------|-------------|
| `frontend/src/app/parametrizacao/whatsapp/page.tsx` | Mover seção Aparência Global para dentro de TabsContent[value="geral"], remover bordas de containers | FR-001 a FR-008 |
| `frontend/src/app/parametrizacao/products/page.tsx` | Remover classes `border` de form e list containers, remover bordas de items | FR-009 a FR-011 |
| `frontend/src/app/parametrizacao/pixels/page.tsx` | Remover classes `border` de form e list containers, remover bordas de items | FR-012 a FR-014 |

### Preserved Files

| File | Reason |
|------|--------|
| `frontend/src/app/parametrizacao/layout.tsx` | Manter borda no `<main>` wrapper (FR-015) |
| `frontend/src/components/ui/*` | Manter componentes shadcn inalterados |

## Implementation Strategy

### Phase 1: WhatsApp Page Refactoring (FR-001 to FR-008)

1. Identificar a seção de Aparência Global (linhas ~321-450)
2. Mover campos (Texto de Redirecionamento, Cor de Fundo, toggle Borda) para dentro de `<TabsContent value="geral">`
3. Mover preview para dentro da aba Geral
4. Remover a seção separada de Aparência Global
5. Remover classes `border` e `shadow-sm` de containers de formulário e listas
6. Remover classes `border` de seções aninhadas (Benefit Cards, Social Proof)

### Phase 2: Products Page Border Removal (FR-009 to FR-011)

1. Remover `border` e `shadow-sm` do container `<form>` (linha ~169)
2. Remover `border` e `shadow-sm` do container da lista de produtos (linha ~265)
3. Remover `border` dos items `<li>` da lista (linha ~279)

### Phase 3: Pixels Page Border Removal (FR-012 to FR-014)

1. Remover `border` e `shadow-sm` do container `<form>` (linha ~142)
2. Remover `border` e `shadow-sm` do container da lista de pixels (linha ~210)
3. Remover `border` dos items `<li>` da lista (linha ~227)

## CSS Classes to Remove

### Pattern: Container Borders
```
rounded-lg border bg-card p-4 shadow-sm
→ rounded-lg bg-card p-4
```

### Pattern: Item Borders
```
rounded-md border px-3 py-2
→ rounded-md px-3 py-2
```

### Pattern: Subsection Borders (WhatsApp only)
```
rounded-md border bg-accent/30 p-4
→ rounded-md bg-accent/30 p-4
```

## Validation Checklist

- [ ] Campos de Aparência Global visíveis na aba Geral
- [ ] Preview funcional dentro da aba Geral
- [ ] Salvamento de aparência funcionando
- [ ] Nenhuma borda duplicada em /parametrizacao/whatsapp
- [ ] Nenhuma borda duplicada em /parametrizacao/products
- [ ] Nenhuma borda duplicada em /parametrizacao/pixels
- [ ] Borda do layout wrapper (main) preservada
- [ ] Bordas de inputs de formulário preservadas
- [ ] Build sem erros (yarn build)
- [ ] Lint sem erros (yarn lint)
