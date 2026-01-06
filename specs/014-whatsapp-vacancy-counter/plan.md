# Implementation Plan: WhatsApp Vacancy Counter

**Branch**: `014-whatsapp-vacancy-counter` | **Date**: 2026-01-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-whatsapp-vacancy-counter/spec.md`

## Summary

Adicionar contador de vagas restantes às páginas WhatsApp (/w/[slug]) com configuração de headline, número, footer, cor de fundo e tamanhos de fonte personalizáveis. O contador é mutuamente exclusivo com o redirect automático existente e deve ser configurado na aba "Gatilhos" do painel de administração.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - padrão: index + registros individuais
**Testing**: ESLint (linting only - projeto não possui testes unitários)
**Target Platform**: Web (browser)
**Project Type**: Web application (Next.js fullstack)
**Performance Goals**: Páginas /w/[slug] devem carregar em < 2 segundos
**Constraints**: Edge Runtime para páginas públicas, client components para interatividade
**Scale/Scope**: Extensão de feature existente (WhatsAppPage entity)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constitution definida (template genérico encontrado). Seguir padrões existentes no codebase:

- [x] Extensão de entidade existente (WhatsAppPage) - padrão já estabelecido
- [x] Validação com Zod - padrão já estabelecido
- [x] Server actions para data layer - padrão já estabelecido
- [x] Client components para formulários - padrão já estabelecido
- [x] Edge Runtime para páginas públicas - padrão já estabelecido

**Status**: PASSED - Nenhuma violação identificada

## Project Structure

### Documentation (this feature)

```text
specs/014-whatsapp-vacancy-counter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx          # Admin form (aba Gatilhos - modificar)
│   │   ├── w/[slug]/
│   │   │   ├── page.tsx              # Server component (modificar)
│   │   │   └── client.tsx            # Client component - vacancy counter (modificar)
│   │   └── api/
│   │       └── whatsapp/
│   │           └── route.ts          # API endpoint (já suporta novos campos)
│   ├── components/
│   │   └── ui/                       # shadcn components (existentes)
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts     # Server actions (modificar type + migration)
│       └── validation.ts             # Zod schemas (modificar)
```

**Structure Decision**: Web application - frontend Next.js com API routes e Edge Config para persistência. Estrutura existente será estendida com novos campos.

## Complexity Tracking

> Nenhuma violação identificada - não há necessidade de justificativas.
