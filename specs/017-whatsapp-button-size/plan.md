# Implementation Plan: Configuração de Tamanho do Botão WhatsApp

**Branch**: `017-whatsapp-button-size` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/017-whatsapp-button-size/spec.md`

## Summary

Adicionar configuração de tamanho do botão principal da página WhatsApp (/w/[slug]) com três opções (pequeno, médio, grande) e preview em tempo real na interface de administração. A implementação segue o padrão existente de `emojiSize` e `subheadlineFontSize`, reutilizando o tipo `EmojiSize` já definido no sistema.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - padrão existente: index + registros individuais
**Testing**: Manual testing via interface admin e página pública
**Target Platform**: Web (Desktop + Mobile responsivo)
**Project Type**: Web application (Next.js monorepo com frontend)
**Performance Goals**: Preview em tempo real < 1 segundo após alteração
**Constraints**: Compatibilidade retroativa com páginas existentes (valor padrão: medium)
**Scale/Scope**: Feature incremental para sistema existente de WhatsApp pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constituição definida (template padrão detectado). Seguindo os padrões estabelecidos nas features anteriores:

- ✅ **Padrão de Tamanhos**: Reutiliza `EmojiSize` existente (small/medium/large)
- ✅ **Compatibilidade**: Valor padrão "medium" para páginas existentes
- ✅ **Persistência**: Segue padrão Edge Config com migração em `migrateRecord()`
- ✅ **Validação**: Zod schema existente (`emojiSizeSchema`)
- ✅ **UI Pattern**: Segue padrão shadcn/ui com RadioGroup para seleção

## Project Structure

### Documentation (this feature)

```text
specs/017-whatsapp-button-size/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/src/
├── app/
│   ├── parametrizacao/whatsapp/
│   │   └── page.tsx         # Admin interface - ADD button size selector + preview
│   └── w/[slug]/
│       └── client.tsx       # Public page - APPLY button size styles
├── lib/
│   ├── repos/
│   │   └── whatsapp-pages.ts  # Data layer - ADD buttonSize field + migration
│   └── validation.ts          # Zod schemas - ADD buttonSize to schema
└── components/
    └── ui/                    # shadcn components (existing RadioGroup)
```

**Structure Decision**: Utiliza estrutura web application existente. Nenhum novo diretório necessário.

## Complexity Tracking

N/A - Feature segue padrões estabelecidos sem violações.
