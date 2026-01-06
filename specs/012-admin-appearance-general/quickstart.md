# Quickstart: Aparência Global na Aba Geral e Remoção de Bordas

**Feature**: 012-admin-appearance-general
**Date**: 2026-01-05

## Overview

Esta feature reorganiza a interface administrativa do sistema de afiliados:
1. Move os campos de "Aparência Global" para dentro da aba "Geral" na página WhatsApp
2. Remove bordas duplicadas em todas as páginas admin (WhatsApp, Products, Pixels)

## Prerequisites

- Node.js 20+
- Yarn
- Acesso ao repositório `shopee-affilitar-program`

## Setup

```bash
cd frontend
yarn install
yarn dev
```

## Files to Modify

### 1. WhatsApp Page (Principal)

**File**: `src/app/parametrizacao/whatsapp/page.tsx`

**Changes**:
1. Mover seção "Aparência Global" (linhas ~321-450) para dentro de `<TabsContent value="geral">`
2. Remover `border` e `shadow-sm` de containers
3. Remover `border` de seções aninhadas

**Before** (container pattern):
```tsx
<div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
```

**After**:
```tsx
<div className="space-y-4 rounded-lg bg-card p-4">
```

### 2. Products Page

**File**: `src/app/parametrizacao/products/page.tsx`

**Changes**:
- Remover `border shadow-sm` do container form (~linha 169)
- Remover `border shadow-sm` do container lista (~linha 265)
- Remover `border` dos items da lista (~linha 279)

### 3. Pixels Page

**File**: `src/app/parametrizacao/pixels/page.tsx`

**Changes**:
- Remover `border shadow-sm` do container form (~linha 142)
- Remover `border shadow-sm` do container lista (~linha 210)
- Remover `border shadow-sm` dos items da lista (~linha 227)

## Validation

1. **Visual Check**:
   - Acesse `/parametrizacao/whatsapp` - campos de Aparência Global devem estar na aba Geral
   - Nenhuma borda duplicada visível em nenhuma das 3 páginas
   - Apenas o wrapper principal (main) deve ter borda

2. **Functional Check**:
   - Editar e salvar configurações de Aparência Global
   - Preview deve refletir mudanças em tempo real
   - Criar/editar/excluir produtos e pixels deve continuar funcionando

3. **Build Check**:
   ```bash
   yarn build
   yarn lint
   ```

## Important Notes

### Classes a MANTER

- `border` em inputs (`<input>`, `<select>`, `<textarea>`)
- `border` em checkboxes e toggles
- `border-r` no sidebar (layout.tsx)
- `border` no `<main>` wrapper (layout.tsx)

### Classes a REMOVER

- `border` e `shadow-sm` em containers de formulário
- `border` e `shadow-sm` em containers de lista
- `border` em items de lista (`<li>`)
- `border` em seções aninhadas (Benefit Cards, Social Proof)

## Testing

Após as mudanças, verificar:

| Página | Cenário | Esperado |
|--------|---------|----------|
| WhatsApp | Aba Geral | Campos de Aparência Global visíveis |
| WhatsApp | Preview | Funcional e responsivo |
| WhatsApp | Salvar | Configurações persistem |
| Products | Lista | Sem bordas duplicadas |
| Pixels | Lista | Sem bordas duplicadas |
| Todas | Layout | Borda apenas no wrapper principal |
