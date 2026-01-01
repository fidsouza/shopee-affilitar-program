# API Contract: WhatsApp Pages (Extended)

**Feature**: 005-whatsapp-benefit-cards
**Date**: 2026-01-01

## Overview

Este contrato documenta as extensões à API existente de páginas WhatsApp para suportar benefit cards. A API existente em `/api/whatsapp` é estendida com novos campos no payload.

## Base URL

```
/api/whatsapp
```

## Endpoints

### POST /api/whatsapp - Create/Update WhatsApp Page

Cria ou atualiza uma página WhatsApp. Endpoint existente estendido com campos de benefit cards.

#### Request

```typescript
interface WhatsAppPageRequest {
  // Campos existentes
  id?: string;                    // UUID - se fornecido, atualiza; senão, cria
  headline: string;               // 1-200 chars
  headerImageUrl?: string;        // URL HTTPS ou vazio
  socialProofs: string[];         // Array de strings
  buttonText: string;             // 1-100 chars
  whatsappUrl: string;            // chat.whatsapp.com ou wa.me
  pixelConfigId?: string;         // UUID ou vazio
  events: MetaEvent[];            // Array de eventos Meta
  redirectEvent: MetaEvent;       // Evento único
  redirectDelay: number;          // 1-30 segundos
  status: "active" | "inactive";

  // NOVOS CAMPOS
  benefitCards?: BenefitCard[];   // 0-8 cards
  emojiSize?: "small" | "medium" | "large";  // Default: "medium"
}

interface BenefitCard {
  emoji: string;         // 1-2 chars
  title: string;         // 1-50 chars
  description?: string;  // 0-150 chars (opcional)
}
```

#### Response

**Success (200)**
```typescript
interface WhatsAppPageResponse {
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
  status: "active" | "inactive";
  benefitCards: BenefitCard[];    // Sempre presente (pode ser [])
  emojiSize: "small" | "medium" | "large";  // Sempre presente
  createdAt: string;
  updatedAt: string;
}
```

**Error (400)** - Validation Error
```typescript
interface ValidationError {
  error: string;
  details?: {
    field: string;
    message: string;
  }[];
}
```

#### Examples

**Create page with benefit cards:**
```json
POST /api/whatsapp
{
  "headline": "Entre no Grupo VIP!",
  "buttonText": "Entrar Agora",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123",
  "events": ["Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active",
  "benefitCards": [
    {
      "emoji": "💸",
      "title": "Descontos de até 70%",
      "description": "Economia real em produtos."
    },
    {
      "emoji": "🎟️",
      "title": "Cupons Secretos"
    }
  ],
  "emojiSize": "large"
}
```

**Update existing page (add cards):**
```json
POST /api/whatsapp
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "headline": "Ofertas VIP",
  "buttonText": "Entrar",
  "whatsappUrl": "https://chat.whatsapp.com/XYZ",
  "events": ["Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active",
  "benefitCards": [
    {"emoji": "✨", "title": "Novidades"}
  ],
  "emojiSize": "medium"
}
```

### GET /api/whatsapp - List WhatsApp Pages

Lista todas as páginas. Resposta estendida com campos de benefit cards.

#### Response

```typescript
type ListResponse = WhatsAppPageResponse[];
```

### DELETE /api/whatsapp/[id] - Delete WhatsApp Page

Sem alterações - funciona normalmente, remove página e seus benefit cards.

## Validation Rules

### benefitCards

| Rule | Constraint | Error Message |
|------|-----------|---------------|
| Max items | 8 | "Máximo de 8 benefit cards por página" |
| emoji min | 1 char | "Emoji é obrigatório" |
| emoji max | 2 chars | "Emoji deve ter no máximo 2 caracteres" |
| title min | 1 char | "Título é obrigatório" |
| title max | 50 chars | "Título deve ter no máximo 50 caracteres" |
| description max | 150 chars | "Descrição deve ter no máximo 150 caracteres" |

### emojiSize

| Rule | Constraint | Error Message |
|------|-----------|---------------|
| enum values | "small", "medium", "large" | "Tamanho de emoji inválido" |
| default | "medium" | N/A |

## Backward Compatibility

- **Request**: Campos `benefitCards` e `emojiSize` são opcionais
- **Response**: Campos sempre presentes (com defaults se não fornecidos)
- **Existing clients**: Continuam funcionando sem modificação
- **New clients**: Podem enviar/receber novos campos

## Error Codes

| HTTP Status | Scenario |
|-------------|----------|
| 200 | Success |
| 400 | Validation error (invalid fields) |
| 404 | Page not found (for updates) |
| 500 | Server error |
