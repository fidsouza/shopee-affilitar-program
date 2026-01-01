# Data Model: WhatsApp Benefit Cards

**Feature**: 005-whatsapp-benefit-cards
**Date**: 2026-01-01

## Entity Diagram

```
┌─────────────────────────────────────┐
│         WhatsAppPageRecord          │
├─────────────────────────────────────┤
│ id: string (UUID)                   │
│ slug: string                        │
│ headline: string                    │
│ headerImageUrl?: string             │
│ socialProofs: string[]              │
│ buttonText: string                  │
│ whatsappUrl: string                 │
│ pixelConfigId?: string              │
│ events: MetaEvent[]                 │
│ redirectEvent: MetaEvent            │
│ redirectDelay: number               │
│ status: 'active' | 'inactive'       │
│ createdAt: string (ISO)             │
│ updatedAt: string (ISO)             │
├─────────────────────────────────────┤
│ + benefitCards: BenefitCard[]  NEW  │
│ + emojiSize: EmojiSize         NEW  │
└─────────────────────────────────────┘
         │
         │ 0..8
         ▼
┌─────────────────────────────────────┐
│           BenefitCard               │
├─────────────────────────────────────┤
│ emoji: string (1-2 chars)           │
│ title: string (1-50 chars)          │
│ description?: string (0-150 chars)  │
└─────────────────────────────────────┘
```

## New Types

### BenefitCard

Representa um card de benefício individual exibido na página de redirect.

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| emoji | string | Yes | 1-2 caracteres | Emoji ou ícone visual |
| title | string | Yes | 1-50 caracteres | Título do benefício |
| description | string | No | 0-150 caracteres | Descrição detalhada (opcional) |

### EmojiSize

Enum para tamanho do emoji aplicado globalmente a todos os cards da página.

| Value | CSS Class | Visual Size |
|-------|-----------|-------------|
| small | text-2xl | ~24px |
| medium | text-4xl | ~36px (padrão) |
| large | text-6xl | ~60px |

## Extended Type: WhatsAppPageRecord

Campos adicionados ao tipo existente:

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| benefitCards | BenefitCard[] | No | [] | Array de 0-8 benefit cards |
| emojiSize | EmojiSize | No | "medium" | Tamanho global dos emojis |

## Validation Rules

### BenefitCard Validation

```typescript
const benefitCardSchema = z.object({
  emoji: z.string()
    .min(1, "Emoji é obrigatório")
    .max(2, "Emoji deve ter no máximo 2 caracteres"),
  title: z.string()
    .min(1, "Título é obrigatório")
    .max(50, "Título deve ter no máximo 50 caracteres"),
  description: z.string()
    .max(150, "Descrição deve ter no máximo 150 caracteres")
    .optional(),
});
```

### EmojiSize Validation

```typescript
const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");
```

### WhatsAppPageRecord Extension

```typescript
// Adições ao whatsAppPageSchema existente:
benefitCards: z.array(benefitCardSchema)
  .max(8, "Máximo de 8 benefit cards por página")
  .default([]),
emojiSize: emojiSizeSchema,
```

## State Transitions

Não há transições de estado específicas para BenefitCard. Os cards são:
- **Criados**: Quando administrador adiciona no formulário
- **Atualizados**: Quando administrador edita emoji/título/descrição
- **Removidos**: Quando administrador clica em remover
- **Reordenados**: Quando administrador move para cima/baixo

Todas as operações são persistidas junto com o save da WhatsAppPage.

## Storage Pattern

Seguindo o padrão existente do projeto:

```
Edge Config Key: whatsapp_pages_{id}
Value: WhatsAppPageRecord (JSON) including benefitCards array
```

Não requer novas chaves ou índices - os benefit cards são armazenados inline no registro da página.

## Backward Compatibility

- Campo `benefitCards` é opcional com default `[]`
- Campo `emojiSize` é opcional com default `"medium"`
- Páginas existentes sem esses campos continuam funcionando
- Leitura: campos ausentes tratados como valores default
- Escrita: novos campos incluídos apenas se fornecidos

## Sample Data

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "slug": "ofertas-vip",
  "headline": "Entre no Grupo VIP de Ofertas!",
  "benefitCards": [
    {
      "emoji": "💸",
      "title": "Descontos de até 70%",
      "description": "Economia real em produtos selecionados a dedo para você."
    },
    {
      "emoji": "🎟️",
      "title": "Cupons Secretos",
      "description": "Acesso a cupons exclusivos que só a nossa comunidade tem."
    },
    {
      "emoji": "✨",
      "title": "Achados Virais",
      "description": "Os produtos mais desejados e comentados do momento."
    },
    {
      "emoji": "🛍️",
      "title": "Tudo em um só lugar",
      "description": "Moda, casa, beleza e mais, com os melhores preços."
    }
  ],
  "emojiSize": "medium",
  "socialProofs": ["+5.000 membros", "⭐ 4.9 de avaliação"],
  "buttonText": "Entrar no Grupo VIP",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123...",
  "events": ["Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active"
}
```
