# Data Model: WhatsApp Admin Tabs Organization

**Feature**: 010-whatsapp-admin-tabs
**Date**: 2026-01-04

## Overview

Esta feature **NÃO altera o modelo de dados**. É uma reorganização puramente visual dos campos existentes na interface de administração.

## Existing Entity (Unchanged)

### WhatsAppPage

A entidade WhatsAppPage permanece inalterada. Os campos abaixo são apenas reorganizados visualmente:

```typescript
// Campos movidos para aba "Geral" (sem alteração de estrutura)
type GeneralTabFields = {
  headline: string;           // Título da página
  headerImageUrl: string;     // URL da foto do header (opcional)
  socialProofs: string[];     // Provas sociais (array de strings)
  buttonText: string;         // Texto do botão CTA
  whatsappUrl: string;        // URL do grupo WhatsApp
};

// Campos que permanecem nas seções existentes (fora das abas)
type RemainingFields = {
  // Seção Pixel/Eventos
  pixelConfigId: string;
  events: MetaEvent[];
  redirectEvent: MetaEvent;
  redirectDelay: number;
  status: "active" | "inactive";

  // Seção Benefit Cards
  benefitCards: BenefitCard[];
  emojiSize: EmojiSize;

  // Seção Notificações Prova Social
  socialProofEnabled: boolean;
  socialProofInterval: number;
};
```

## State Management

O estado do formulário (`FormState`) permanece inalterado:

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

## UI State (New)

Único estado novo adicionado para controle da aba ativa:

```typescript
// Não é necessário persistir - apenas controle visual local
const [activeTab, setActiveTab] = useState<"general">("general");
```

## API Contracts

**Nenhuma alteração nos contratos de API.** Os endpoints existentes continuam funcionando sem modificação:

- `GET /api/whatsapp` - Lista páginas
- `POST /api/whatsapp` - Cria/atualiza página
- `DELETE /api/whatsapp/[id]` - Remove página
- `GET /api/whatsapp/appearance` - Configuração de aparência
- `PUT /api/whatsapp/appearance` - Atualiza aparência

## Migrations

**Nenhuma migração necessária.** Não há alterações no modelo de dados.
