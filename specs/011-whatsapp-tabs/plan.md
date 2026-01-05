# Implementation Plan: Abas de Gatilhos e Pixel para WhatsApp

**Branch**: `011-whatsapp-tabs` | **Date**: 2026-01-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-whatsapp-tabs/spec.md`

## Summary

Reorganizar o formulário de páginas WhatsApp em três abas: "Geral" (informações básicas), "Gatilhos" (Benefit Cards + Social Proof) e "Pixel" (configurações de rastreamento). Esta é uma mudança puramente visual que move campos existentes para abas organizadas, sem alteração do modelo de dados.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7 (App Router), React 19, Tailwind CSS, shadcn/ui (Radix UI)
**Storage**: Vercel Edge Config (REST API) - padrão: index + registros individuais
**Testing**: Manual testing (não há framework de testes configurado)
**Target Platform**: Web (Vercel Edge)
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: N/A (UI reorganization only)
**Constraints**: Manter compatibilidade com páginas existentes
**Scale/Scope**: Single admin page component (~927 lines)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

O projeto não possui constitution definida (arquivo template). Esta feature:
- Não adiciona novas dependências
- Não altera modelo de dados
- Reutiliza componentes existentes (shadcn/ui Tabs)
- Mantém compatibilidade retroativa

**Status**: PASS (sem gates definidos para violar)

## Project Structure

### Documentation (this feature)

```text
specs/011-whatsapp-tabs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API changes)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── parametrizacao/
│   │       └── whatsapp/
│   │           └── page.tsx       # Target file - WhatsApp admin page
│   ├── components/
│   │   └── ui/
│   │       └── tabs.tsx           # shadcn/ui Tabs component (existing)
│   └── lib/
│       ├── repos/
│       │   └── whatsapp-pages.ts  # Data layer (no changes needed)
│       ├── validation.ts          # Zod schemas (no changes needed)
│       └── meta-events.ts         # Meta events enum (no changes needed)
└── tests/                         # (not configured)
```

**Structure Decision**: Web application structure. This feature modifies only the frontend admin page component (`frontend/src/app/parametrizacao/whatsapp/page.tsx`). No backend changes required.

## Complexity Tracking

N/A - No constitution violations to justify.

## Implementation Approach

### Current State Analysis

O formulário atual possui:
1. Uma única aba "Geral" (linhas 454-519) com 5 campos: Headline, Header Image URL, Provas Sociais, Texto do Botão, URL do WhatsApp
2. Campos de Pixel/eventos fora das abas (linhas 522-621): dropdown de pixel, evento de redirect, checkboxes de eventos ao carregar, tempo de redirect, status
3. Seção de Benefit Cards fora das abas (linhas 624-778)
4. Seção de Social Proof Notifications fora das abas (linhas 780-818)

### Target State

Reorganizar em três abas:
1. **Aba "Geral"**: Headline, Header Image URL, Provas Sociais (texto), Texto do Botão, URL do WhatsApp
2. **Aba "Gatilhos"**: Seção Benefit Cards + Seção Social Proof Notifications
3. **Aba "Pixel"**: Dropdown de Pixel, Eventos ao Carregar (checkboxes), Evento do Redirect, Tempo de Redirect

Manter fora das abas: Status (ativo/inativo), Mensagens de erro/sucesso, Botões de submit

### Changes Required

1. Adicionar duas novas TabsTrigger: "Gatilhos" e "Pixel"
2. Mover a seção de Benefit Cards (linhas 624-778) para TabsContent value="gatilhos"
3. Mover a seção de Social Proof (linhas 780-818) para TabsContent value="gatilhos"
4. Mover os campos de Pixel/eventos (linhas 522-585) para TabsContent value="pixel"
5. Manter o campo de Status (linhas 600-621) fora das abas, junto com submit buttons
