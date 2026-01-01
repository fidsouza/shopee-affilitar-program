# Research: WhatsApp Benefit Cards

**Feature**: 005-whatsapp-benefit-cards
**Date**: 2026-01-01

## Overview

Este documento consolida as decisões técnicas e padrões a serem seguidos para implementação dos benefit cards personalizáveis.

## Decision 1: Estrutura de Dados para BenefitCard

**Decision**: Array de objetos `BenefitCard` embutido no `WhatsAppPageRecord`

**Rationale**:
- Consistente com o padrão existente (ex: `socialProofs` como array)
- Edge Config suporta arrays aninhados sem problemas
- Não requer novo índice ou chaves separadas
- Simplifica operações CRUD (todos os cards salvos junto com a página)

**Alternatives considered**:
1. **Referências separadas por ID**: Rejeitado - overhead desnecessário para 8 cards máximo, aumenta latência com múltiplas leituras
2. **JSON string serializada**: Rejeitado - perde type safety e validação Zod nativa

## Decision 2: Validação de Emoji

**Decision**: Aceitar qualquer string Unicode válida de até 2 caracteres

**Rationale**:
- Emojis podem ser compostos (ex: 👨‍👩‍👧 usa multiple code points mas rende como 1)
- Validação por caractere visual é complexa e frágil
- Limite de 2 chars cobre 99% dos emojis simples
- UI mostrará preview em tempo real para feedback visual

**Alternatives considered**:
1. **Regex para emoji range**: Rejeitado - ranges Unicode mudam, manutenção difícil
2. **Biblioteca de validação de emoji**: Rejeitado - dependência extra para caso simples

## Decision 3: Tamanhos de Emoji

**Decision**: Três tamanhos predefinidos mapeados para classes Tailwind

| Tamanho | Classe CSS | Dimensão aproximada |
|---------|------------|---------------------|
| small   | text-2xl   | ~24px |
| medium  | text-4xl   | ~36px |
| large   | text-6xl   | ~60px |

**Rationale**:
- Consistente com o design system existente (Tailwind)
- Três opções cobrem casos de uso sem over-engineering
- Fácil de ajustar via classes se necessário

## Decision 4: Reordenação de Cards

**Decision**: Botões "mover para cima/baixo" no formulário admin

**Rationale**:
- Implementação simples sem dependências extras
- Funciona bem para máximo de 8 items
- Acessível (não depende de drag-and-drop)
- Consistente com simplicidade do projeto

**Alternatives considered**:
1. **Drag-and-drop com biblioteca**: Rejeitado para v1 - complexidade adicional, pode ser feature futura
2. **Input numérico de ordem**: Rejeitado - UX inferior para poucos items

## Decision 5: Layout Grid Responsivo

**Decision**: CSS Grid com breakpoints Tailwind

```
Mobile (< 640px):    1 coluna
Tablet (640-1024px): 2 colunas
Desktop (> 1024px):  4 colunas (ou 2x2 se menos de 4 cards)
```

**Rationale**:
- Tailwind já está no projeto
- Grid nativo tem excelente suporte
- Adapta automaticamente ao número de cards

## Decision 6: Migração de Dados

**Decision**: Backward compatible - campo `benefitCards` é opcional com default `[]`

**Rationale**:
- Páginas existentes continuam funcionando sem modificação
- Novo campo é ignorado se ausente (fallback para array vazio)
- Não requer script de migração

## Decision 7: Validação Zod

**Decision**: Schema `benefitCardSchema` com validação de limites

```typescript
const benefitCardSchema = z.object({
  emoji: z.string().min(1).max(2),
  title: z.string().min(1).max(50),
  description: z.string().max(150).optional(),
});

const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");
```

**Rationale**:
- Reutiliza padrões Zod existentes no projeto
- Validação tanto no cliente quanto servidor
- Mensagens de erro em português consistentes

## Summary

Todas as decisões seguem os padrões existentes do projeto:
- Extensão do modelo existente (não criação de novos)
- Uso de Tailwind para styling
- Validação Zod consistente
- Edge Config como storage
- Backward compatibility priorizada
