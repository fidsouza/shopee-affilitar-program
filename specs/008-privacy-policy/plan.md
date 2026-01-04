# Implementation Plan: Página de Política de Privacidade para Lead Ads

**Branch**: `008-privacy-policy` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-privacy-policy/spec.md`

## Summary

Criar uma página estática de política de privacidade para conformidade com LGPD e requisitos do Meta Ads para campanhas de lead ads. A página será acessível via URL pública, totalmente responsiva, e conterá todas as seções obrigatórias para coleta de dados via formulários instantâneos do Facebook/Instagram.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7, React 19, Tailwind CSS, shadcn/ui (Radix UI)
**Storage**: N/A (conteúdo estático, sem persistência)
**Testing**: ESLint (yarn lint)
**Target Platform**: Web (browser) - mobile-first
**Project Type**: web (frontend Next.js App Router)
**Performance Goals**: Carregamento < 3 segundos em 3G
**Constraints**: Responsivo a partir de 320px, conteúdo em português brasileiro
**Scale/Scope**: Página única estática, acesso público

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui uma constituição configurada com princípios específicos (template padrão). Os seguintes princípios implícitos do projeto são seguidos:

| Princípio | Status | Notas |
|-----------|--------|-------|
| Simplicidade | ✅ PASS | Página estática, sem complexidade desnecessária |
| Mobile-first | ✅ PASS | Design responsivo usando Tailwind CSS |
| Conformidade Legal | ✅ PASS | Segue requisitos LGPD e Meta |
| Padrões do Projeto | ✅ PASS | Usa Next.js App Router, Tailwind CSS, estrutura existente |

**Resultado**: Todos os gates passam. Prosseguir para Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/008-privacy-policy/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── politica-de-privacidade/  # Nova rota da política
│   │   │   └── page.tsx              # Página da política de privacidade
│   │   ├── t/[slug]/                 # Transition pages (existente)
│   │   ├── w/[slug]/                 # WhatsApp redirect pages (existente)
│   │   ├── parametrizacao/           # Admin dashboard (existente)
│   │   └── page.tsx                  # Home page (existente)
│   ├── components/
│   │   ├── ui/                       # shadcn components (existente)
│   │   └── privacy-policy/           # Componentes específicos da política
│   │       └── policy-section.tsx    # Componente de seção reutilizável
│   └── lib/                          # Utilities (existente)
└── tests/                            # N/A para esta feature (página estática)
```

**Structure Decision**: Seguir o padrão existente do Next.js App Router, criando uma nova rota `/politica-de-privacidade` com componentes auxiliares em `/components/privacy-policy/`.

## Complexity Tracking

> Não há violações de complexidade. A implementação é simples:
> - Uma página estática
> - Um componente de seção reutilizável (opcional, para organização)
> - Sem persistência de dados
> - Sem APIs
