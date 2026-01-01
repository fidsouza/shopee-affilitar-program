# Research: Home Page Simplification and Admin Route Rename

**Branch**: `004-home-page-update` | **Date**: 2025-12-31

## Summary

Esta feature não requer pesquisa técnica significativa. Todas as tecnologias e padrões já estão em uso no projeto.

## Decisions

### 1. Renomeação de Rota via File-System Routing

**Decision**: Renomear o diretório `admin/` para `parametrizacao/`

**Rationale**: Next.js App Router usa file-system based routing. Renomear o diretório automaticamente muda todas as rotas sem necessidade de configuração adicional.

**Alternatives considered**:
- Redirect via middleware: Desnecessário, adiciona complexidade
- Manter `/admin` com redirect: Viola requisito de retornar 404

### 2. Emoji no Favicon/Title

**Decision**: Usar emoji 🏷️ no title do metadata em `layout.tsx`

**Rationale**: O emoji aparece na aba do navegador quando incluído no title. É a forma mais simples de mudar o ícone visual sem criar um novo favicon.ico.

**Alternatives considered**:
- Criar novo favicon.ico com emoji: Mais complexo, requer geração de ícone
- SVG favicon: Suporte limitado em alguns navegadores

### 3. Página "Em Construção"

**Decision**: Página minimalista usando Tailwind CSS existente

**Rationale**: Manter consistência com o estilo visual do projeto. Não adicionar dependências.

**Alternatives considered**:
- Página com animação: Over-engineering para o propósito
- Página vazia: Não comunica claramente o estado

## Technical Notes

### Next.js App Router - File System Routing

- Diretórios em `app/` definem rotas automaticamente
- Renomear `admin/` → `parametrizacao/` muda:
  - `/admin` → `/parametrizacao`
  - `/admin/products` → `/parametrizacao/products`
  - `/admin/pixels` → `/parametrizacao/pixels`
  - `/admin/whatsapp` → `/parametrizacao/whatsapp`

### Metadata em Next.js

```typescript
export const metadata: Metadata = {
  title: "🏷️ Título",  // Emoji aparece na aba do navegador
  description: "...",
};
```

## Unresolved Items

Nenhum. Todos os aspectos técnicos estão claros.
