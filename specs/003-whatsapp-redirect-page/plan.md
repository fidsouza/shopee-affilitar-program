# Implementation Plan: WhatsApp Redirect Page - Multi-Event Support

**Branch**: `003-whatsapp-redirect-page` | **Date**: 2025-12-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-whatsapp-redirect-page/spec.md`

**Note**: This plan updates the existing WhatsApp redirect page feature to support multiple events on page load and a separate redirect event.

## Summary

Atualizar a página de redirecionamento WhatsApp para suportar:
1. **Múltiplos eventos Meta** disparados ao carregar a página (`events[]`)
2. **Evento de redirecionamento** (`redirectEvent`) disparado antes do redirect (clique ou automático)
3. **Deduplicação** do evento de redirect por sessão do visitante

A abordagem técnica segue os padrões existentes do projeto: repositório com Edge Config, validação Zod, disparo dual (client-side fbq + server-side Conversion API).

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui, Zod 4.1
**Storage**: Vercel Edge Config (REST API) - pattern: index + individual records
**Testing**: Manual testing (projeto não possui framework de testes configurado)
**Target Platform**: Web (Edge Runtime para páginas públicas, Node.js para API)
**Project Type**: Web application (frontend-only com serverless functions)
**Performance Goals**: Páginas carregam em <2 segundos, redirecionamento preciso ±0.5s
**Constraints**: Edge Runtime para páginas públicas, <200ms p95 para lookup de slug
**Scale/Scope**: Suporta 100+ páginas WhatsApp ativas simultaneamente

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O arquivo constitution.md está em template (não configurado), portanto não há restrições formais a verificar. Seguiremos as práticas já estabelecidas no projeto:

- ✅ Repository pattern para acesso a dados
- ✅ Validação Zod para inputs
- ✅ Edge Runtime para páginas públicas
- ✅ Dual tracking (client + server) para eventos Meta
- ✅ UI em português com shadcn/ui

## Project Structure

### Documentation (this feature)

```text
specs/003-whatsapp-redirect-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx         # Admin form - ADD multi-select events + redirectEvent
│   │   ├── api/
│   │   │   └── whatsapp/
│   │   │       └── route.ts         # API routes - UPDATE validation
│   │   └── w/
│   │       └── [slug]/
│   │           ├── page.tsx         # Server component - UPDATE event firing
│   │           └── client.tsx       # Client component - UPDATE event firing
│   ├── components/
│   │   └── ui/                      # shadcn components (existing)
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts    # Repository - UPDATE types
│       ├── validation.ts            # Zod schemas - UPDATE WhatsApp schema
│       ├── meta-events.ts           # Meta events list (existing)
│       ├── conversion-api.ts        # Conversion API (existing)
│       └── edge-config.ts           # Edge Config wrapper (existing)
└── package.json
```

**Structure Decision**: Projeto web frontend-only existente. Alterações serão feitas em arquivos já existentes, sem criar novos arquivos/diretórios.

## Complexity Tracking

> Nenhuma violação de constitution identificada.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Changes Summary

### Files to Modify

| File | Change Type | Description |
|------|-------------|-------------|
| `lib/repos/whatsapp-pages.ts` | UPDATE | Alterar `buttonEvent` para `events[]` + `redirectEvent` |
| `lib/validation.ts` | UPDATE | Atualizar schema Zod com novos campos |
| `app/admin/whatsapp/page.tsx` | UPDATE | Adicionar multi-select para eventos e campo redirectEvent |
| `app/api/whatsapp/route.ts` | UPDATE | Atualizar validação e persistência |
| `app/w/[slug]/page.tsx` | UPDATE | Disparar múltiplos eventos no load + redirectEvent |
| `app/w/[slug]/client.tsx` | UPDATE | Disparar eventos no client com deduplicação |

### No New Files Required

A implementação reutiliza toda a infraestrutura existente.
