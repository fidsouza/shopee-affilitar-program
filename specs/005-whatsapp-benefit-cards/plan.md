# Implementation Plan: WhatsApp Benefit Cards Personalizáveis

**Branch**: `005-whatsapp-benefit-cards` | **Date**: 2026-01-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-whatsapp-benefit-cards/spec.md`

## Summary

Adicionar benefit cards personalizáveis às páginas de redirecionamento WhatsApp (`/w/[slug]`), permitindo ao administrador configurar cards com emoji, título e descrição para destacar benefícios do grupo/destino. Inclui configuração de tamanho global de emoji (pequeno/médio/grande) por página. Implementação estende o modelo de dados existente `WhatsAppPageRecord` com array de `BenefitCard` e novo campo `emojiSize`.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - padrão: index + registros individuais
**Testing**: ESLint (lint check via `yarn lint`)
**Target Platform**: Web (Vercel Edge Runtime para páginas públicas)
**Project Type**: Web application (frontend only, usando Edge Config como backend)
**Performance Goals**: Página de redirect carrega em <2s em conexões 3G
**Constraints**: Máximo 8 benefit cards por página, emoji max 2 caracteres, título max 50 caracteres
**Scale/Scope**: Feature adicional para páginas WhatsApp existentes (~10s de páginas)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O arquivo constitution.md contém template não preenchido (placeholders). Não há princípios específicos definidos para este projeto. Procedendo sem gates específicos de constitution.

**Status**: PASS (no specific constitution rules defined)

## Project Structure

### Documentation (this feature)

```text
specs/005-whatsapp-benefit-cards/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/whatsapp/    # Admin dashboard (benefit cards form)
│   │   │   └── page.tsx
│   │   ├── w/[slug]/                   # Redirect pages (benefit cards display)
│   │   │   ├── page.tsx
│   │   │   └── client.tsx
│   │   └── api/whatsapp/               # API endpoints
│   │       └── route.ts
│   ├── components/
│   │   └── ui/                         # shadcn components
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts       # WhatsAppPageRecord type extension
│       └── validation.ts               # Zod schemas extension
└── tests/                              # N/A (apenas lint)
```

**Structure Decision**: Web application existente com frontend Next.js. Todos os arquivos estão em `frontend/src/`. Extensão de funcionalidade existente sem criação de novos diretórios estruturais.

## Complexity Tracking

> Nenhuma violação de constitution identificada. Feature é extensão direta do modelo existente.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
