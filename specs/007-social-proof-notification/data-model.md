# Data Model: Notificação de Prova Social

**Feature**: 007-social-proof-notification
**Date**: 2026-01-03

## Entity Changes

### WhatsAppPageRecord (Extension)

Extensão da entidade existente em `frontend/src/lib/repos/whatsapp-pages.ts`.

#### New Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `socialProofEnabled` | boolean | No | `false` | Habilita/desabilita notificações de prova social |
| `socialProofInterval` | number | No | `10` | Intervalo em segundos entre notificações (5-60) |

#### Updated Type Definition

```typescript
// In whatsapp-pages.ts
export type WhatsAppPageRecord = {
  // ... existing fields ...
  id: string;
  slug: string;
  headline: string;
  headerImageUrl?: string;
  socialProofs: string[];
  buttonText: string;
  whatsappUrl: string;
  pixelConfigId?: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: 'active' | 'inactive';
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
  createdAt: string;
  updatedAt: string;

  // NEW FIELDS
  socialProofEnabled: boolean;
  socialProofInterval: number;
};
```

### Validation Schema Extension

Extensão do schema em `frontend/src/lib/validation.ts`.

```typescript
// Add to whatsAppPageSchema
export const whatsAppPageSchema = z.object({
  // ... existing fields ...

  // Social Proof Notifications - added 2026-01-03
  socialProofEnabled: z.boolean().default(false),
  socialProofInterval: z.number()
    .int("Intervalo deve ser número inteiro")
    .min(5, "Intervalo mínimo: 5 segundos")
    .max(60, "Intervalo máximo: 60 segundos")
    .default(10),
});
```

## New Static Data

### Social Proof Data (`frontend/src/lib/social-proof-data.ts`)

Lista estática de nomes e cidades brasileiras para geração aleatória.

```typescript
// Brazilian first names (popular names)
export const BRAZILIAN_NAMES: string[] = [
  "Ana", "Maria", "Juliana", "Fernanda", "Priscila",
  "Camila", "Beatriz", "Larissa", "Amanda", "Bruna",
  "Carolina", "Gabriela", "Leticia", "Mariana", "Patricia",
  "Rafaela", "Renata", "Sabrina", "Tatiana", "Vanessa",
  "Carlos", "Pedro", "Lucas", "Rafael", "Bruno",
  "Felipe", "Gustavo", "Henrique", "Leonardo", "Marcelo",
  "Matheus", "Paulo", "Ricardo", "Rodrigo", "Thiago",
  "Anderson", "Diego", "Eduardo", "Fernando", "Gabriel",
  "Igor", "Joao", "Leandro", "Marcos", "Nicolas",
  "Otavio", "Roberto", "Sergio", "Vitor", "Wesley"
];

// Brazilian cities (major cities by region)
export const BRAZILIAN_CITIES: string[] = [
  // Sudeste
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Campinas",
  "Guarulhos", "Santos", "Niterói", "Ribeirão Preto",
  // Sul
  "Curitiba", "Porto Alegre", "Florianópolis", "Londrina",
  "Joinville", "Caxias do Sul",
  // Nordeste
  "Salvador", "Fortaleza", "Recife", "Natal", "João Pessoa",
  "Maceió", "Teresina", "São Luís",
  // Centro-Oeste
  "Brasília", "Goiânia", "Campo Grande", "Cuiabá",
  // Norte
  "Manaus", "Belém", "Porto Velho"
];
```

## State Transitions

### Social Proof Toggle

```
[Disabled] ---(admin enables)---> [Enabled]
[Enabled] ---(admin disables)---> [Disabled]
```

### Notification Cycle (Client-side)

```
[Page Load]
    |
    v (2-3s delay)
[Show Notification]
    |
    v (4s display)
[Hide Notification]
    |
    v (configurable interval)
[Show Notification]
    |
    ... (loop while page active)
```

## Backward Compatibility

### Migration Strategy

Similar ao padrão existente com `benefitCards` e `emojiSize`:

```typescript
// In migrateRecord function
function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  // ... existing migration ...

  // Add default socialProof fields if missing (backward compatibility)
  migrated.socialProofEnabled = record.socialProofEnabled ?? false;
  migrated.socialProofInterval = record.socialProofInterval ?? 10;

  return migrated;
}
```

### Legacy Type Extension

```typescript
type LegacyWhatsAppPageRecord = {
  // ... existing legacy fields ...
  socialProofEnabled?: boolean;
  socialProofInterval?: number;
};
```

## Data Flow

```
[Admin Panel]
     |
     v (POST /api/whatsapp)
[Zod Validation]
     |
     v
[Edge Config Storage]
     |
     v (GET on page load)
[WhatsApp Page Server Component]
     |
     v (props)
[WhatsApp Client Component]
     |
     v (conditional render)
[SocialProofNotification Component]
```

## Constraints & Validation Rules

| Field | Constraint | Error Message |
|-------|------------|---------------|
| `socialProofInterval` | >= 5 | "Intervalo mínimo: 5 segundos" |
| `socialProofInterval` | <= 60 | "Intervalo máximo: 60 segundos" |
| `socialProofInterval` | integer | "Intervalo deve ser número inteiro" |
