# Research: Aparência Global na Aba Geral e Remoção de Bordas

**Feature**: 012-admin-appearance-general
**Date**: 2026-01-05

## Research Summary

Esta feature é primariamente uma refatoração de UI sem necessidade de pesquisa técnica extensiva. Os pontos investigados foram a estrutura atual do código e os padrões de estilo utilizados.

## Decisions

### 1. Estratégia de Remoção de Bordas

**Decision**: Remover bordas de containers E items, mantendo apenas no layout wrapper e inputs

**Rationale**:
- Clarificação do usuário durante `/speckit.clarify`
- Simplifica a hierarquia visual
- Mantém indicadores de interatividade nos inputs

**Alternatives Considered**:
- Opção A: Remover apenas bordas de containers - rejeitada por não resolver completamente o problema de aninhamento
- Opção B: Remover apenas bordas de items - rejeitada por manter containers com bordas redundantes

### 2. Posicionamento da Aparência Global na Aba Geral

**Decision**: Adicionar campos de Aparência Global no início da aba "Geral", antes dos campos existentes

**Rationale**:
- Configurações globais devem ter destaque visual
- Usuário espera encontrar configurações mais abrangentes primeiro
- Preview pode ficar lado a lado com os campos usando grid

**Alternatives Considered**:
- Final da aba: Rejeitado - menos visível, parece secundário
- Nova subseção com header: Rejeitado - adiciona mais elementos visuais

### 3. Organização do Preview de Aparência

**Decision**: Manter preview em grid responsivo (2 colunas em desktop, 1 em mobile)

**Rationale**:
- Padrão já usado no código atual
- Permite visualização lado a lado com os campos
- Responsivo para diferentes tamanhos de tela

**Alternatives Considered**:
- Preview fixo na lateral: Rejeitado - complexidade adicional
- Preview em modal: Rejeitado - piora UX

### 4. Classes Tailwind a Preservar

**Decision**: Manter `rounded-lg`, `bg-card`, `p-4` mas remover `border` e `shadow-sm`

**Rationale**:
- Background e padding mantêm separação visual entre seções
- Border radius preserva consistência com design system
- Remoção de border e shadow elimina duplicação visual

## Technical Findings

### Estrutura de Bordas Atual

| Página | Container Form | Container List | Items | Total Levels |
|--------|---------------|----------------|-------|--------------|
| WhatsApp | `border shadow-sm` | `border shadow-sm` | `border` | 3 |
| Products | `border shadow-sm` | `border shadow-sm` | `border` | 3 |
| Pixels | `border shadow-sm` | `border shadow-sm` | `border` | 3 |

### Estrutura de Bordas Após Implementação

| Página | Container Form | Container List | Items | Total Levels |
|--------|---------------|----------------|-------|--------------|
| WhatsApp | nenhum | nenhum | nenhum | 0 (só layout wrapper) |
| Products | nenhum | nenhum | nenhum | 0 (só layout wrapper) |
| Pixels | nenhum | nenhum | nenhum | 0 (só layout wrapper) |

### Arquivos e Linhas Identificadas

#### WhatsApp (`/parametrizacao/whatsapp/page.tsx`)
- Seção Aparência Global: linhas ~321-450 (a ser movida)
- Container form com tabs: linha ~452 (`border shadow-sm`)
- Seções Gatilhos: linhas com `border bg-accent/30`
- Container lista de páginas: linha ~841 (`border shadow-sm`)

#### Products (`/parametrizacao/products/page.tsx`)
- Container form: linha ~169 (`border shadow-sm`)
- Container lista: linha ~265 (`border shadow-sm`)
- Items: linha ~279 (`border`)

#### Pixels (`/parametrizacao/pixels/page.tsx`)
- Container form: linha ~142 (`border shadow-sm`)
- Container lista: linha ~210 (`border shadow-sm`)
- Items: linha ~227 (`border`)

## No Further Research Required

- Sem dependências externas novas
- Sem mudanças de API ou modelo de dados
- Padrões de Tailwind CSS bem documentados
- Componentes shadcn/ui não precisam de modificação
