# Implementation Plan: Personalização Visual das Páginas de WhatsApp

**Branch**: `009-whatsapp-appearance` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-whatsapp-appearance/spec.md`

## Summary

Configuração global para customizar o texto de "redirecionando" e a aparência da caixa (cor de fundo, toggle de borda) nas páginas `/w/[slug]`.

**Funcionalidades**:
- Texto de redirecionamento personalizável
- Cor de fundo configurável (formato hexadecimal)
- Toggle de borda (ativa/desativa)
- Interface de administração em /parametrizacao/whatsapp

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI), Zod 4.1
**Storage**: Vercel Edge Config (REST API) - chave única `whatsapp_appearance`
**Testing**: ESLint (lint check via `yarn lint`)
**Target Platform**: Web (Vercel Edge Runtime para páginas de transição)
**Project Type**: Web application (frontend monorepo)
**Performance Goals**: Páginas /w/[slug] carregam < 2s, config retorna < 100ms
**Scale/Scope**: 1 configuração global no Edge Config

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui uma constitution definida (template placeholder). Não há gates bloqueantes. Seguiremos os padrões já estabelecidos no projeto:
- Repository pattern para acesso a dados (`lib/repos/`)
- Validação com Zod (`lib/validation.ts`)
- Componentes client/server separados para páginas Edge
- Edge Config para persistência

**Status**: ✅ PASS (sem violações)

## Project Structure

### Documentation (this feature)

```text
specs/009-whatsapp-appearance/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API endpoints)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── w/[slug]/
│   │   │   ├── page.tsx           # Server component (atualizar para carregar config)
│   │   │   └── client.tsx         # Client component (atualizar para usar config)
│   │   ├── parametrizacao/
│   │   │   └── whatsapp/
│   │   │       └── page.tsx       # Admin page (adicionar seção Aparência)
│   │   └── api/
│   │       └── whatsapp/
│   │           └── appearance/
│   │               └── route.ts   # API endpoint para config de aparência
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-appearance.ts  # Novo repo para config de aparência
│       └── validation.ts          # Adicionar schema para aparência
```

**Structure Decision**: Web application com frontend monorepo. A personalização de aparência será adicionada ao admin existente `/parametrizacao/whatsapp`.

## Complexity Tracking

Nenhuma violação de constitution detectada. Implementação segue padrões existentes.

| Aspecto | Decisão | Justificativa |
|---------|---------|---------------|
| Storage | Edge Config (chave única) | Seguir padrão existente de `whatsapp_pages_*` |
| UI | Seção na página existente | Não criar nova rota, reaproveitar layout |
| Escopo | Global para todas /w/ | Conforme clarificado na spec |
| Borda | Cor fixa #e5e7eb | Simplicidade, conforme clarificado |
