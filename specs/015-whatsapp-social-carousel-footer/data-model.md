# Data Model: WhatsApp Social Proof Carousel & Custom Footer

**Feature**: 015-whatsapp-social-carousel-footer
**Date**: 2026-01-07
**Status**: Complete

## Entity Overview

Esta feature estende a entidade `WhatsAppPageRecord` existente com novos campos para carrossel de provas sociais e footer personalizado.

## Entities

### SocialProofItem (New)

Representa uma prova social individual. Usa discriminated union para diferenciar entre tipo texto e imagem.

#### SocialProofTextItem

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | UUID v4 | Identificador único |
| type | literal | 'text' | Discriminador de tipo |
| description | string | 1-500 chars, required | Texto do depoimento |
| author | string | 1-100 chars, required | Nome do autor |
| city | string | 1-100 chars, required | Cidade do autor |

#### SocialProofImageItem

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string | UUID v4 | Identificador único |
| type | literal | 'image' | Discriminador de tipo |
| imageUrl | string | HTTPS URL, required | URL da imagem |

#### Union Type

```typescript
type SocialProofItem = SocialProofTextItem | SocialProofImageItem;
```

### WhatsAppPageRecord (Extended)

Campos adicionados à entidade existente:

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| socialProofCarouselItems | SocialProofItem[] | max 10 items | [] | Array de provas sociais para o carrossel |
| carouselAutoPlay | boolean | - | false | Habilita auto-play do carrossel |
| carouselInterval | number | int, 3-15 | 5 | Intervalo de auto-play em segundos |
| footerText | string \| null | 0-500 chars | null | Texto do rodapé personalizado |

## Zod Schemas

### socialProofTextItemSchema

```typescript
export const socialProofTextItemSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('text'),
  description: z.string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição deve ter no máximo 500 caracteres"),
  author: z.string()
    .min(1, "Autor é obrigatório")
    .max(100, "Nome do autor deve ter no máximo 100 caracteres"),
  city: z.string()
    .min(1, "Cidade é obrigatória")
    .max(100, "Cidade deve ter no máximo 100 caracteres"),
});
```

### socialProofImageItemSchema

```typescript
export const socialProofImageItemSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('image'),
  imageUrl: z.string()
    .url("URL inválida")
    .refine((url) => url.startsWith("https://"), "URL deve usar HTTPS"),
});
```

### socialProofItemSchema

```typescript
export const socialProofItemSchema = z.discriminatedUnion('type', [
  socialProofTextItemSchema,
  socialProofImageItemSchema,
]);

export type SocialProofItem = z.infer<typeof socialProofItemSchema>;
export type SocialProofTextItem = z.infer<typeof socialProofTextItemSchema>;
export type SocialProofImageItem = z.infer<typeof socialProofImageItemSchema>;
```

### whatsAppPageSchema (Extended Fields)

```typescript
// Adicionar aos campos existentes do whatsAppPageSchema:

socialProofCarouselItems: z.array(socialProofItemSchema)
  .max(10, "Máximo de 10 provas sociais por página")
  .default([]),

carouselAutoPlay: z.boolean().default(false),

carouselInterval: z.number()
  .int("Intervalo deve ser número inteiro")
  .min(3, "Intervalo mínimo: 3 segundos")
  .max(15, "Intervalo máximo: 15 segundos")
  .default(5),

footerText: z.string()
  .max(500, "Footer deve ter no máximo 500 caracteres")
  .optional()
  .or(z.literal(""))
  .transform(v => v || null),
```

## Type Definitions

### WhatsAppPageRecord (Updated)

```typescript
// Adicionar ao tipo existente WhatsAppPageRecord:
export type WhatsAppPageRecord = Omit<WhatsAppPageInput, /* campos existentes */> & {
  // ... campos existentes ...

  // Social Proof Carousel - added 2026-01-07
  socialProofCarouselItems: SocialProofItem[];
  carouselAutoPlay: boolean;
  carouselInterval: number;

  // Custom Footer - added 2026-01-07
  footerText: string | null;

  // ... outros campos existentes ...
};
```

### LegacyWhatsAppPageRecord (Migration Support)

```typescript
// Adicionar campos opcionais para backward compatibility:
type LegacyWhatsAppPageRecord = Omit<WhatsAppPageRecord, /* ... */> & {
  // ... campos existentes ...

  // Optional for backward compatibility
  socialProofCarouselItems?: SocialProofItem[];
  carouselAutoPlay?: boolean;
  carouselInterval?: number;
  footerText?: string | null;
};
```

## Migration Function Updates

```typescript
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  let migrated = { ...record } as WhatsAppPageRecord;

  // ... migrações existentes ...

  // Add default socialProofCarousel fields if missing (2026-01-07)
  migrated.socialProofCarouselItems = record.socialProofCarouselItems ?? [];
  migrated.carouselAutoPlay = record.carouselAutoPlay ?? false;
  migrated.carouselInterval = record.carouselInterval ?? 5;

  // Add default footerText if missing (2026-01-07)
  migrated.footerText = record.footerText ?? null;

  return migrated;
}
```

## Validation Rules

### Business Rules

1. **Máximo de provas sociais**: 10 items por página
2. **Tipo obrigatório**: Cada item deve ter `type: 'text'` ou `type: 'image'`
3. **Campos de texto obrigatórios**: Para `type: 'text'`, todos os campos (description, author, city) são obrigatórios
4. **URL HTTPS**: Para `type: 'image'`, URL deve usar protocolo HTTPS
5. **Intervalo de auto-play**: Entre 3 e 15 segundos
6. **Footer opcional**: Se vazio ou não definido, não é renderizado

### State Transitions

Não há máquina de estados específica para esta feature. Os items são gerenciados via CRUD simples no array.

## Data Flow

```
Admin Input → Zod Validation → WhatsAppPageRecord → Edge Config
                                      ↓
                               migrateRecord()
                                      ↓
                          WhatsAppRedirectClient
                                      ↓
                         SocialProofCarousel + PageFooter
```

## Storage Pattern

Segue padrão existente do projeto:

- **Index**: `whatsapp_pages_index` (não alterado)
- **Records**: `whatsapp_pages_{id}` (extended with new fields)

Os novos campos são armazenados inline no registro da página WhatsApp, não como entidades separadas.

## Relationships

```
WhatsAppPageRecord
├── socialProofCarouselItems: SocialProofItem[] (embedded, 0-10)
├── footerText: string | null (embedded)
└── (outros campos existentes)
```

## Index Impact

Nenhuma alteração necessária no `WhatsAppPageIndexEntry`. Os novos campos são armazenados apenas no registro completo, não no índice.
