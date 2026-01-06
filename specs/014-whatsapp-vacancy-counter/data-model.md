# Data Model: WhatsApp Vacancy Counter

**Feature**: 014-whatsapp-vacancy-counter
**Date**: 2026-01-06

## Entity Changes

### WhatsAppPageRecord (Extension)

Entidade existente em `lib/repos/whatsapp-pages.ts` será estendida com os seguintes campos:

```typescript
// Novos campos a adicionar ao type WhatsAppPageRecord
type WhatsAppPageRecord = {
  // ... campos existentes ...

  // Vacancy Counter - added 2026-01-06
  vacancyCounterEnabled: boolean;           // Toggle para habilitar/desabilitar
  vacancyHeadline: string;                  // Texto acima do número (ex: "VAGAS DISPONÍVEIS")
  vacancyCount: number;                     // Número de vagas a exibir (>= 0)
  vacancyFooter: string | null;             // Texto abaixo do número (opcional)
  vacancyBackgroundColor: string | null;    // Cor hex (#RRGGBB) ou null para transparente
  vacancyCountFontSize: EmojiSize;          // "small" | "medium" | "large"
  vacancyHeadlineFontSize: EmojiSize;       // "small" | "medium" | "large"
  vacancyFooterFontSize: EmojiSize;         // "small" | "medium" | "large"
};
```

### Campo Details

| Campo | Tipo | Required | Default | Validação |
|-------|------|----------|---------|-----------|
| `vacancyCounterEnabled` | boolean | Yes | `false` | - |
| `vacancyHeadline` | string | When enabled | `""` | min: 1, max: 100 chars |
| `vacancyCount` | number | When enabled | `0` | integer >= 0 |
| `vacancyFooter` | string \| null | No | `null` | max: 200 chars |
| `vacancyBackgroundColor` | string \| null | No | `null` | regex: `/^#[0-9A-Fa-f]{6}$/` |
| `vacancyCountFontSize` | EmojiSize | Yes | `"large"` | enum: small, medium, large |
| `vacancyHeadlineFontSize` | EmojiSize | Yes | `"medium"` | enum: small, medium, large |
| `vacancyFooterFontSize` | EmojiSize | Yes | `"small"` | enum: small, medium, large |

## Validation Schema (Zod)

```typescript
// Adicionar ao whatsAppPageSchema em lib/validation.ts
{
  // ... campos existentes ...

  // Vacancy Counter - added 2026-01-06
  vacancyCounterEnabled: z.boolean().default(false),
  vacancyHeadline: z.string()
    .max(100, "Headline deve ter no máximo 100 caracteres")
    .default(""),
  vacancyCount: z.number()
    .int("Número de vagas deve ser inteiro")
    .min(0, "Número de vagas não pode ser negativo")
    .default(0),
  vacancyFooter: z.string()
    .max(200, "Footer deve ter no máximo 200 caracteres")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyBackgroundColor: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Cor deve estar em formato hexadecimal (#RRGGBB)")
    .optional()
    .or(z.literal(""))
    .transform(v => v || null),
  vacancyCountFontSize: emojiSizeSchema.default("large"),
  vacancyHeadlineFontSize: emojiSizeSchema.default("medium"),
  vacancyFooterFontSize: emojiSizeSchema.default("small"),
}
```

## Migration Function

```typescript
// Atualizar migrateRecord em lib/repos/whatsapp-pages.ts
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  // ... migrações existentes ...

  // Add default vacancy counter fields if missing (backward compatibility - 2026-01-06)
  migrated.vacancyCounterEnabled = record.vacancyCounterEnabled ?? false;
  migrated.vacancyHeadline = record.vacancyHeadline ?? "";
  migrated.vacancyCount = record.vacancyCount ?? 0;
  migrated.vacancyFooter = record.vacancyFooter ?? null;
  migrated.vacancyBackgroundColor = record.vacancyBackgroundColor ?? null;
  migrated.vacancyCountFontSize = record.vacancyCountFontSize ?? "large";
  migrated.vacancyHeadlineFontSize = record.vacancyHeadlineFontSize ?? "medium";
  migrated.vacancyFooterFontSize = record.vacancyFooterFontSize ?? "small";

  return migrated;
}
```

## Business Rules

### Exclusividade Mútua (UI-level)

```
IF vacancyCounterEnabled == true THEN redirectEnabled MUST be false
IF redirectEnabled == true THEN vacancyCounterEnabled MUST be false
```

**Nota**: Esta regra é enforced na UI (client-side), não no schema Zod. Dados legados podem ter ambos true, mas a UI impedirá novas combinações inválidas.

### Validação Condicional (UI-level)

```
IF vacancyCounterEnabled == true THEN vacancyHeadline MUST NOT be empty
```

**Nota**: O schema permite headline vazia (para páginas com contador desabilitado), mas a UI deve validar quando o usuário tenta habilitar.

## State Transitions

```
[Página Nova] ──create──> [Counter Disabled, Redirect Enabled (default)]
                              │
                              ▼
                    [Disable Redirect]
                              │
                              ▼
                    [Enable Counter] ──> [Counter Enabled, Redirect Disabled]
                              │
                              ▼
                    [Disable Counter] ──> [Counter Disabled, Redirect Unlocked]
```

## Storage Format (Edge Config)

```json
{
  "whatsapp_pages_<uuid>": {
    "id": "uuid",
    "slug": "string",
    "headline": "string",
    // ... outros campos existentes ...

    // Vacancy Counter fields
    "vacancyCounterEnabled": false,
    "vacancyHeadline": "",
    "vacancyCount": 0,
    "vacancyFooter": null,
    "vacancyBackgroundColor": null,
    "vacancyCountFontSize": "large",
    "vacancyHeadlineFontSize": "medium",
    "vacancyFooterFontSize": "small"
  }
}
```
