# Implementation Plan: Toggle de Redirect com Eventos Separados

**Branch**: `013-redirect-toggle` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-redirect-toggle/spec.md`

## Summary

Adiciona controle sobre o redirect automático nas páginas WhatsApp, permitindo desabilitar o countdown e configurar eventos de pixel separados para clique no botão vs redirect automático. A implementação mantém backward compatibility total com páginas existentes.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - sem alterações nesta feature
**Testing**: Manual testing com Meta Pixel Helper
**Target Platform**: Web (navegadores modernos)
**Project Type**: Web application (frontend-only nesta feature)
**Performance Goals**: Manter performance atual da página de redirect (<1s First Contentful Paint)
**Constraints**: Backward compatibility obrigatória; eventos devem funcionar client e server-side
**Scale/Scope**: ~100 linhas de código distribuídas em 4 arquivos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

A constitution do projeto está em template (não configurada). Aplicando princípios padrão:

| Princípio | Status | Notas |
|-----------|--------|-------|
| Simplicidade | ✅ | Reutiliza padrões existentes; 2 novos campos apenas |
| Backward Compatibility | ✅ | Migração automática com defaults sensatos |
| Consistência | ✅ | Segue padrões de UI e validação já estabelecidos |

## Project Structure

### Documentation (this feature)

```text
specs/013-redirect-toggle/
├── spec.md              # Especificação da feature
├── plan.md              # Este arquivo
├── research.md          # Decisões técnicas
├── data-model.md        # Modelo de dados
├── quickstart.md        # Guia de implementação
├── contracts/           # Contratos de API
│   └── whatsapp-page-api.yaml
└── checklists/
    └── requirements.md  # Checklist de qualidade
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx          # [MODIFICAR] Admin UI - novos campos
│   │   └── w/
│   │       └── [slug]/
│   │           └── client.tsx        # [MODIFICAR] Lógica de redirect
│   └── lib/
│       ├── validation.ts             # [MODIFICAR] Schema Zod
│       └── repos/
│           └── whatsapp-pages.ts     # [MODIFICAR] Tipos e migração
```

**Structure Decision**: Web application com frontend Next.js. Todas as mudanças são no frontend (client e admin).

## Complexity Tracking

> Nenhuma violação de complexidade identificada.

| Aspecto | Complexidade | Justificativa |
|---------|--------------|---------------|
| Novos campos | Baixa | 2 campos simples com defaults |
| UI | Baixa | Reutiliza componentes existentes |
| Lógica | Baixa | Condicional simples no countdown |
| Migração | Baixa | Padrão já estabelecido no projeto |

## Implementation Order

### Fase 1: Data Layer (dependência zero)
1. `validation.ts` - Adicionar campos ao schema Zod
2. `whatsapp-pages.ts` - Atualizar tipos e função de migração

### Fase 2: Client Rendering (depende da Fase 1)
3. `w/[slug]/client.tsx` - Implementar lógica condicional de redirect

### Fase 3: Admin UI (depende das Fases 1 e 2)
4. `parametrizacao/whatsapp/page.tsx` - Adicionar controles na aba "Pixel"

## Artifacts Generated

- [x] `research.md` - Decisões técnicas e análise
- [x] `data-model.md` - Modelo de dados atualizado
- [x] `contracts/whatsapp-page-api.yaml` - Contrato OpenAPI
- [x] `quickstart.md` - Guia de implementação
- [x] `tasks.md` - Lista de tarefas detalhadas
