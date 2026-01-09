# Data Model: Subheadline Text with Font Size Control

**Feature**: 016-subheadline-font-size
**Date**: 2026-01-08

## Entities

### WhatsAppPage (Extended)

Entidade existente que armazena configurações de páginas de redirecionamento WhatsApp.

#### New Field

| Field                  | Type       | Required | Default  | Description                                    |
|------------------------|------------|----------|----------|------------------------------------------------|
| `subheadlineFontSize`  | EmojiSize  | No       | "medium" | Tamanho da fonte do subheadline (small/medium/large) |

#### Existing Field (Reused)

| Field          | Type       | Required | Default | Description                                           |
|----------------|------------|----------|---------|-------------------------------------------------------|
| `socialProofs` | string[]   | No       | []      | Array de linhas de texto para o subheadline           |

**Note**: O campo `socialProofs` será reutilizado como armazenamento do texto do subheadline. Apenas o label no admin será alterado de "Provas Sociais (uma por linha)" para "Subheadline".

## Type Definitions

### EmojiSize (Existing)

```typescript
type EmojiSize = "small" | "medium" | "large";
```

### WhatsAppPageRecord (Updated)

```typescript
type WhatsAppPageRecord = {
  // ... existing fields ...
  socialProofs: string[];           // Reused as subheadline text (one line per item)
  subheadlineFontSize: EmojiSize;   // NEW: Font size for subheadline display
  // ... existing fields ...
};
```

### LegacyWhatsAppPageRecord (Updated for Migration)

```typescript
type LegacyWhatsAppPageRecord = {
  // ... existing optional fields ...
  subheadlineFontSize?: EmojiSize;  // Optional for backward compatibility
};
```

## Validation Rules

### subheadlineFontSize

- **Type**: Enum ("small" | "medium" | "large")
- **Default**: "medium"
- **Required**: No (defaults applied automatically)

### socialProofs (Unchanged)

- **Type**: Array of strings
- **Default**: []
- **Max items**: No limit (text field, not array UI)
- **Item validation**: Non-empty strings after trimming

## State Transitions

N/A - This feature only adds a display configuration field with no state machine.

## Migration

### Backward Compatibility

Records without `subheadlineFontSize` will automatically receive the default value "medium" through:

1. Zod schema default: `emojiSizeSchema.default("medium")`
2. Migration function in `whatsapp-pages.ts`

### Migration Function Update

Add to `migrateRecord()` function:

```typescript
subheadlineFontSize: raw.subheadlineFontSize ?? 'medium',
```

## Relationships

```
WhatsAppPage
    └── subheadlineFontSize: EmojiSize (enum value)
    └── socialProofs: string[] (text lines)
```

No foreign keys or complex relationships introduced.
