# Data Model: Abas de Gatilhos e Pixel para WhatsApp

**Feature**: 011-whatsapp-tabs
**Date**: 2026-01-05

## Overview

Esta feature **não altera o modelo de dados**. Apenas reorganiza a apresentação visual dos campos existentes em abas.

## Entidades Existentes (sem alterações)

### WhatsAppPageRecord

```typescript
type WhatsAppPageRecord = {
  // Core IDs
  id: string;                    // UUID
  slug: string;                  // Auto-generated from headline

  // Aba "Geral" - campos
  headline: string;              // Max 200 chars
  headerImageUrl?: string;       // Optional HTTPS URL
  socialProofs: string[];        // Array of proof strings
  buttonText: string;            // Max 100 chars
  whatsappUrl: string;           // Must be chat.whatsapp.com or wa.me

  // Aba "Pixel" - campos
  pixelConfigId?: string;        // Optional pixel UUID
  events: MetaEvent[];           // Page load events (min 1)
  redirectEvent: MetaEvent;      // Event before redirect
  redirectDelay: number;         // 1-30 seconds, default 5

  // Fora das abas
  status: "active" | "inactive";

  // Aba "Gatilhos" - Benefit Cards
  benefitCards: BenefitCard[];   // Max 8 cards
  emojiSize: EmojiSize;          // "small" | "medium" | "large"

  // Aba "Gatilhos" - Social Proof Notifications
  socialProofEnabled: boolean;   // Enable notifications
  socialProofInterval: number;   // 5-60 seconds

  // Timestamps
  createdAt: string;             // ISO
  updatedAt: string;             // ISO
};
```

### BenefitCard

```typescript
type BenefitCard = {
  emoji: string;           // 1-2 characters, required
  title: string;           // 1-50 chars, required
  description?: string;    // Optional, max 150 chars
};
```

### EmojiSize

```typescript
type EmojiSize = "small" | "medium" | "large";
```

### MetaEvent

```typescript
type MetaEvent =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase"
  | "AddPaymentInfo"
  | "CompleteRegistration";
```

## FormState (Frontend)

O estado do formulário no componente React também **não é alterado**:

```typescript
type FormState = {
  id?: string;
  headline: string;
  headerImageUrl: string;
  socialProofs: string[];
  buttonText: string;
  whatsappUrl: string;
  pixelConfigId: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: "active" | "inactive";
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;
  socialProofEnabled: boolean;
  socialProofInterval: number;
};
```

## Mapeamento Campos → Abas

| Campo | Aba | Obrigatório |
|-------|-----|-------------|
| headline | Geral | Sim |
| headerImageUrl | Geral | Não |
| socialProofs | Geral | Não |
| buttonText | Geral | Sim |
| whatsappUrl | Geral | Sim |
| benefitCards | Gatilhos | Não |
| emojiSize | Gatilhos | Não |
| socialProofEnabled | Gatilhos | Não |
| socialProofInterval | Gatilhos | Não |
| pixelConfigId | Pixel | Não |
| events | Pixel | Sim (mín. 1) |
| redirectEvent | Pixel | Sim |
| redirectDelay | Pixel | Sim |
| status | (fora das abas) | Sim |

## Validação

Nenhuma alteração nas regras de validação. As validações existentes em `lib/validation.ts` permanecem inalteradas.

## Persistência

Nenhuma alteração na camada de dados. O repositório `lib/repos/whatsapp-pages.ts` permanece inalterado.
