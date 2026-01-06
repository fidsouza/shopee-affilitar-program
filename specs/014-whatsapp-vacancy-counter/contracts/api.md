# API Contracts: WhatsApp Vacancy Counter

**Feature**: 014-whatsapp-vacancy-counter
**Date**: 2026-01-06

## Overview

Esta feature não introduz novos endpoints. Os campos do vacancy counter são adicionados ao payload existente do endpoint `POST /api/whatsapp`.

---

## Endpoint: POST /api/whatsapp

### Request Body (Extended)

```typescript
interface WhatsAppPagePayload {
  // Campos existentes
  id?: string;
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
  benefitCards?: BenefitCard[];
  emojiSize?: EmojiSize;
  socialProofEnabled?: boolean;
  socialProofInterval?: number;
  redirectEnabled?: boolean;
  buttonEvent?: MetaEvent;

  // Novos campos - Vacancy Counter (2026-01-06)
  vacancyCounterEnabled?: boolean;
  vacancyHeadline?: string;
  vacancyCount?: number;
  vacancyFooter?: string;
  vacancyBackgroundColor?: string;
  vacancyCountFontSize?: EmojiSize;
  vacancyHeadlineFontSize?: EmojiSize;
  vacancyFooterFontSize?: EmojiSize;
}
```

### Response Body (Extended)

```typescript
interface WhatsAppPageResponse {
  // Todos os campos do request + campos gerados
  id: string;
  slug: string;
  createdAt: string;
  updatedAt: string;

  // Vacancy Counter fields (sempre presentes na resposta)
  vacancyCounterEnabled: boolean;
  vacancyHeadline: string;
  vacancyCount: number;
  vacancyFooter: string | null;
  vacancyBackgroundColor: string | null;
  vacancyCountFontSize: EmojiSize;
  vacancyHeadlineFontSize: EmojiSize;
  vacancyFooterFontSize: EmojiSize;
}
```

---

## Endpoint: GET /api/whatsapp

### Response Body

Lista de `WhatsAppPageResponse[]` com todos os campos incluindo os novos campos de vacancy counter.

---

## Validação de Campos

### vacancyCounterEnabled
- Tipo: `boolean`
- Default: `false`
- Descrição: Toggle para habilitar/desabilitar o contador

### vacancyHeadline
- Tipo: `string`
- Default: `""`
- Max: 100 caracteres
- Descrição: Texto exibido acima do número
- Validação UI: Obrigatório quando `vacancyCounterEnabled=true`

### vacancyCount
- Tipo: `number`
- Default: `0`
- Min: `0`
- Descrição: Número de vagas a exibir
- Validação: Inteiro não-negativo

### vacancyFooter
- Tipo: `string | null`
- Default: `null`
- Max: 200 caracteres
- Descrição: Texto opcional exibido abaixo do número

### vacancyBackgroundColor
- Tipo: `string | null`
- Default: `null`
- Pattern: `/^#[0-9A-Fa-f]{6}$/`
- Descrição: Cor de fundo em formato hex

### vacancyCountFontSize
- Tipo: `"small" | "medium" | "large"`
- Default: `"large"`
- Descrição: Tamanho da fonte do número

### vacancyHeadlineFontSize
- Tipo: `"small" | "medium" | "large"`
- Default: `"medium"`
- Descrição: Tamanho da fonte da headline

### vacancyFooterFontSize
- Tipo: `"small" | "medium" | "large"`
- Default: `"small"`
- Descrição: Tamanho da fonte do footer

---

## Exemplo de Uso

### Criar página com contador de vagas

```http
POST /api/whatsapp
Content-Type: application/json

{
  "headline": "Grupo VIP de Ofertas",
  "buttonText": "Entrar no Grupo",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123",
  "events": ["Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active",

  "redirectEnabled": false,
  "vacancyCounterEnabled": true,
  "vacancyHeadline": "VAGAS DISPONÍVEIS",
  "vacancyCount": 47,
  "vacancyFooter": "Garanta sua vaga agora!",
  "vacancyBackgroundColor": "#FEF3C7",
  "vacancyCountFontSize": "large",
  "vacancyHeadlineFontSize": "medium",
  "vacancyFooterFontSize": "small"
}
```

### Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "slug": "grupo-vip-de-ofertas",
  "headline": "Grupo VIP de Ofertas",
  "buttonText": "Entrar no Grupo",
  "whatsappUrl": "https://chat.whatsapp.com/ABC123",
  "events": ["Lead"],
  "redirectEvent": "CompleteRegistration",
  "redirectDelay": 5,
  "status": "active",
  "redirectEnabled": false,
  "vacancyCounterEnabled": true,
  "vacancyHeadline": "VAGAS DISPONÍVEIS",
  "vacancyCount": 47,
  "vacancyFooter": "Garanta sua vaga agora!",
  "vacancyBackgroundColor": "#FEF3C7",
  "vacancyCountFontSize": "large",
  "vacancyHeadlineFontSize": "medium",
  "vacancyFooterFontSize": "small",
  "createdAt": "2026-01-06T10:00:00.000Z",
  "updatedAt": "2026-01-06T10:00:00.000Z"
}
```
