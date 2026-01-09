# Implementation Plan: Subheadline Text with Font Size Control

**Branch**: `016-subheadline-font-size` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-subheadline-font-size/spec.md`

## Summary

Corrigir o texto "Provas Sociais" que não está aparecendo na página de redirecionamento WhatsApp, renomear o campo para "Subheadline" na aba Geral do admin, e adicionar seletor de tamanho de fonte com três opções (pequeno, médio, grande).

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - padrão existente: index + registros individuais
**Testing**: Testes manuais (projeto não possui framework de testes automatizados configurado)
**Target Platform**: Web (desktop e mobile responsivo)
**Project Type**: Web application (monorepo frontend only)
**Performance Goals**: Renderização instantânea da página de redirecionamento (Edge Runtime)
**Constraints**: Manter compatibilidade com dados existentes em `socialProofs`
**Scale/Scope**: Admin panel + página pública `/w/[slug]`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constitution definida (arquivo template). Prosseguindo sem gates de constitution.

**Status**: PASSED (no constitution gates defined)

## Project Structure

### Documentation (this feature)

```text
specs/016-subheadline-font-size/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no new API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx          # Admin form - modify textarea label + add font size selector
│   │   └── w/
│   │       └── [slug]/
│   │           └── client.tsx        # WhatsApp redirect page - fix subheadline rendering
│   ├── components/
│   │   └── ui/                       # shadcn components (existing)
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts     # Add subheadlineFontSize to record type
│       └── validation.ts             # Add subheadlineFontSize schema field
└── package.json
```

**Structure Decision**: Modificações em arquivos existentes seguindo padrões estabelecidos. Não há necessidade de criar novos arquivos.

## Complexity Tracking

Nenhuma violação de constitution identificada. Implementação simples usando padrões existentes:
- Reutiliza `emojiSizeSchema` (small, medium, large) já definido em `validation.ts`
- Segue padrão de campos existentes como `vacancyHeadlineFontSize`
