# Implementation Plan: Notificação de Prova Social

**Branch**: `007-social-proof-notification` | **Date**: 2026-01-03 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-social-proof-notification/spec.md`

## Summary

Implementar notificações de prova social nas páginas de WhatsApp (`/w/[slug]`) que exibem mensagens como "Priscila de São Paulo acabou de entrar no grupo!" com nomes e cidades aleatórios. A funcionalidade será configurável por página através do painel admin, permitindo habilitar/desabilitar e configurar o intervalo entre notificações (5-60 segundos, padrão 10s).

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, Zod 4.1, shadcn/ui (Radix UI)
**Storage**: Vercel Edge Config (REST API) - padrão: index + registros individuais
**Testing**: ESLint (yarn lint)
**Target Platform**: Web (desktop + mobile)
**Project Type**: Web application (Next.js frontend)
**Performance Goals**: Notificações devem aparecer/desaparecer suavemente sem impacto perceptível na performance
**Constraints**: Client-side only para animações, compatível com Edge Runtime
**Scale/Scope**: Páginas WhatsApp existentes (~10-50 páginas), sem limite de visitantes simultâneos

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constitution específica configurada. Seguindo padrões estabelecidos no codebase:

- [x] **Padrão Repository**: Uso do repositório existente `whatsapp-pages.ts` com Server Actions
- [x] **Validação Zod**: Extensão do schema `whatsAppPageSchema` existente
- [x] **Edge Config**: Armazenamento junto aos dados existentes da WhatsAppPage
- [x] **Client Components**: Componente de notificação será client-side para animações
- [x] **Responsividade**: Notificação deve funcionar em mobile e desktop

## Project Structure

### Documentation (this feature)

```text
specs/007-social-proof-notification/
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
│   ├── parametrizacao/
│   │   └── whatsapp/
│   │       └── page.tsx          # Extend form with social proof toggle + interval
│   └── w/
│       └── [slug]/
│           └── client.tsx        # Add SocialProofNotification component
├── components/
│   └── social-proof-notification.tsx  # New: Toast notification component
└── lib/
    ├── repos/
    │   └── whatsapp-pages.ts     # Extend WhatsAppPageRecord type
    ├── validation.ts             # Extend whatsAppPageSchema
    └── social-proof-data.ts      # New: Names and cities lists
```

**Structure Decision**: Extensão da estrutura existente seguindo os padrões do projeto. O componente de notificação será separado para reutilização e testabilidade.

## Complexity Tracking

Nenhuma violação identificada. A implementação segue padrões existentes e não introduz complexidade desnecessária.
