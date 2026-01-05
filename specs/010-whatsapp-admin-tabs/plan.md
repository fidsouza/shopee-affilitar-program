# Implementation Plan: WhatsApp Admin Tabs Organization

**Branch**: `010-whatsapp-admin-tabs` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-whatsapp-admin-tabs/spec.md`

## Summary

Reorganizar a página de administração de WhatsApp (`/parametrizacao/whatsapp`) adicionando uma aba "Geral" que contém os 5 campos principais: Headline, URL da Foto, Provas Sociais, Texto do Botão e URL do WhatsApp. As demais seções (Pixel/Eventos, Benefit Cards, Notificações de Prova Social) permanecem fora do sistema de abas, exatamente como estão atualmente. Utilizar componente Tabs do shadcn/ui para consistência visual.

## Technical Context

**Language/Version**: TypeScript 5, Node.js 20
**Primary Dependencies**: Next.js 16.0.7, React 19, Tailwind CSS, shadcn/ui (Radix UI)
**Storage**: N/A (sem alterações no modelo de dados)
**Testing**: ESLint (yarn lint)
**Target Platform**: Web (navegadores modernos)
**Project Type**: web (frontend only)
**Performance Goals**: N/A (reorganização visual apenas)
**Constraints**: Manter compatibilidade com formulário existente, preservar comportamento de submit
**Scale/Scope**: 1 página afetada (/parametrizacao/whatsapp)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Library-First | N/A | Não aplicável - feature de UI apenas |
| CLI Interface | N/A | Não aplicável - não há CLI |
| Test-First | PASS | Linting existente será executado |
| Integration Testing | N/A | Sem integração nova |
| Observability | N/A | Sem logs adicionais necessários |
| Simplicity | PASS | Mudança mínima - apenas reorganização visual |

**Gate Result**: PASS - Nenhuma violação detectada

## Project Structure

### Documentation (this feature)

```text
specs/010-whatsapp-admin-tabs/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (N/A - sem alterações)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── parametrizacao/
│   │       └── whatsapp/
│   │           └── page.tsx        # Arquivo a ser modificado
│   └── components/
│       └── ui/
│           ├── button.tsx          # Componente existente
│           └── tabs.tsx            # NOVO - componente Tabs do shadcn/ui
```

**Structure Decision**: Projeto web existente. Apenas modificação do arquivo `page.tsx` da página WhatsApp admin e adição do componente `tabs.tsx` do shadcn/ui.

## Complexity Tracking

> **Nenhuma violação que necessite justificativa**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
