# Implementation Plan: WhatsApp Social Proof Carousel & Custom Footer

**Branch**: `015-whatsapp-social-carousel-footer` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/015-whatsapp-social-carousel-footer/spec.md`

## Summary

Implementar carrossel de provas sociais (texto ou imagem) e footer personalizado para páginas de WhatsApp (`/w/[slug]`). O carrossel suportará navegação manual, swipe touch, auto-play opcional, e loop infinito. O footer exibirá texto customizado no rodapé da página.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS 3.4, shadcn/ui (Radix UI), Zod 4.1, lucide-react
**Storage**: Vercel Edge Config (REST API) - padrão existente: index + registros individuais
**Testing**: ESLint (lint-only, sem testes unitários configurados)
**Target Platform**: Web (mobile-first, responsivo)
**Project Type**: Web application (frontend-only, Next.js App Router)
**Performance Goals**: Carrossel responsivo em <300ms, página carrega em <2s
**Constraints**: URLs de imagem externas (sem upload), máximo 10 provas por página
**Scale/Scope**: Sistema admin single-user, páginas públicas de alta performance (Edge Runtime)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constitution definida (arquivo é template). Prosseguindo com padrões estabelecidos no codebase:

| Princípio Implícito | Status | Justificativa |
|---------------------|--------|---------------|
| Padrão de dados Edge Config | ✅ PASS | Seguir padrão existente: index + registros individuais |
| Validação com Zod | ✅ PASS | Esquemas de validação já existem para WhatsApp pages |
| Componentes shadcn/ui | ✅ PASS | Usar componentes existentes do projeto |
| Server Actions | ✅ PASS | Repositório `whatsapp-pages.ts` usa padrão 'use server' |
| Edge Runtime para páginas públicas | ✅ PASS | `/w/[slug]` já usa Edge Runtime |

## Project Structure

### Documentation (this feature)

```text
specs/015-whatsapp-social-carousel-footer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no external APIs)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── parametrizacao/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx           # Admin - adicionar nova aba/seção
│   │   └── w/
│   │       └── [slug]/
│   │           ├── page.tsx           # Server component (Edge Runtime)
│   │           └── client.tsx         # Client component - adicionar carousel + footer
│   ├── components/
│   │   ├── ui/                        # shadcn components existentes
│   │   ├── social-proof-carousel.tsx  # NOVO: Componente do carrossel
│   │   └── page-footer.tsx            # NOVO: Componente do footer
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts      # Atualizar tipo WhatsAppPageRecord
│       └── validation.ts              # Adicionar schemas para SocialProofItem
```

**Structure Decision**: Seguir estrutura existente do projeto. Novos componentes em `frontend/src/components/`, extensão de tipos em arquivos existentes.

## Complexity Tracking

> Nenhuma violação identificada. Feature segue padrões existentes.

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Biblioteca de carrossel | CSS/JS nativo + Tailwind | Evitar dependência externa para funcionalidade simples |
| Drag-and-drop no admin | @dnd-kit ou similar | Já existe padrão de reordenação no projeto (benefit cards) |
| Armazenamento de imagens | URLs externas | Conforme spec - sem upload de arquivos |
