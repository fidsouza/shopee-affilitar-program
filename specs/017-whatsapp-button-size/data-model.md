# Data Model: Configuração de Tamanho do Botão WhatsApp

**Feature**: 017-whatsapp-button-size
**Date**: 2026-01-09

## Overview

Esta feature adiciona um único campo ao modelo existente `WhatsAppPage`. Não há novas entidades.

---

## Entity Changes

### WhatsAppPage (Existing Entity - Modified)

**New Field**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `buttonSize` | `EmojiSize` | `"medium"` | Tamanho do botão CTA principal |

**Type Reference**:
```typescript
type EmojiSize = "small" | "medium" | "large";
```

**Full Entity Context** (campos relacionados ao botão):

| Field | Type | Description |
|-------|------|-------------|
| `buttonText` | `string` | Texto exibido no botão |
| `buttonSize` | `EmojiSize` | **NEW** - Tamanho do botão |
| `buttonEvent` | `MetaEvent?` | Evento disparado ao clicar |

---

## Validation Rules

### buttonSize

- **Type**: Enum (`"small" | "medium" | "large"`)
- **Required**: No (opcional com default)
- **Default**: `"medium"`
- **Zod Schema**: Reutiliza `emojiSizeSchema` existente

```typescript
// Em validation.ts (já existe)
export const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");

// Adicionar ao whatsAppPageSchema
buttonSize: emojiSizeSchema.default("medium"),
```

---

## State Transitions

N/A - Campo estático sem transições de estado.

---

## Migration Strategy

### Backward Compatibility

Registros existentes sem `buttonSize` devem receber valor padrão `"medium"`.

**Location**: `frontend/src/lib/repos/whatsapp-pages.ts`

```typescript
// Em LegacyWhatsAppPageRecord, adicionar:
buttonSize?: EmojiSize;

// Em migrateRecord(), adicionar:
migrated.buttonSize = record.buttonSize ?? "medium";

// Em upsertWhatsAppPage(), adicionar:
buttonSize: parsed.buttonSize ?? existing?.buttonSize ?? "medium",
```

---

## CSS Mapping

**Location**: `frontend/src/app/w/[slug]/client.tsx`

```typescript
// Novo mapeamento para tamanho do botão
const BUTTON_SIZE_CLASSES: Record<EmojiSize, string> = {
  small: "px-6 py-3 text-base",   // Menor: padding 24px/12px, font 16px
  medium: "px-8 py-4 text-lg",    // Médio: padding 32px/16px, font 18px (padrão atual)
  large: "px-10 py-5 text-xl",    // Maior: padding 40px/20px, font 20px
};
```

---

## Storage Schema

**Vercel Edge Config Key Pattern**: `whatsapp_pages_{id}`

**Updated JSON Structure** (excerpt):
```json
{
  "id": "uuid",
  "slug": "string",
  "headline": "string",
  "buttonText": "string",
  "buttonSize": "small" | "medium" | "large",
  "whatsappUrl": "string",
  // ... outros campos existentes
}
```

---

## Relationships

- **ButtonSize → WhatsAppPage**: 1:1 (campo dentro da entidade)
- **EmojiSize Type**: Reutilizado de `emojiSize`, `subheadlineFontSize`, `vacancyCountFontSize`, etc.

---

## Impact Analysis

| Component | Change Type | Description |
|-----------|-------------|-------------|
| `validation.ts` | ADD | Campo `buttonSize` no schema |
| `whatsapp-pages.ts` | ADD | Campo no tipo + migração |
| `client.tsx` | ADD | Mapeamento CSS + aplicação |
| `page.tsx` (admin) | ADD | Seletor + preview |
