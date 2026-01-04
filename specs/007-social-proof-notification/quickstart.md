# Quickstart: Notificação de Prova Social

**Feature**: 007-social-proof-notification
**Date**: 2026-01-03

## Prerequisites

- Node.js 20+
- Yarn package manager
- Acesso ao repositório

## Setup

```bash
# Clone e acesse o diretório
cd shopee-affilitar-program/frontend

# Instale dependências (se ainda não instaladas)
yarn install

# Inicie o servidor de desenvolvimento
yarn dev
```

## Implementation Steps

### 1. Extend Validation Schema

**File**: `frontend/src/lib/validation.ts`

Adicionar campos ao `whatsAppPageSchema`:

```typescript
// Social Proof Notifications
socialProofEnabled: z.boolean().default(false),
socialProofInterval: z.number()
  .int("Intervalo deve ser número inteiro")
  .min(5, "Intervalo mínimo: 5 segundos")
  .max(60, "Intervalo máximo: 60 segundos")
  .default(10),
```

### 2. Create Social Proof Data

**File**: `frontend/src/lib/social-proof-data.ts` (novo)

```typescript
export const BRAZILIAN_NAMES = [
  "Ana", "Maria", "Juliana", /* ... */
];

export const BRAZILIAN_CITIES = [
  "São Paulo", "Rio de Janeiro", /* ... */
];
```

### 3. Extend Repository Type

**File**: `frontend/src/lib/repos/whatsapp-pages.ts`

Adicionar campos ao `WhatsAppPageRecord` e `migrateRecord`.

### 4. Create Notification Component

**File**: `frontend/src/components/social-proof-notification.tsx` (novo)

Componente client-side com:
- Animação de entrada/saída
- Timer para ciclo de notificações
- Geração aleatória de nome/cidade

### 5. Update Admin Panel

**File**: `frontend/src/app/parametrizacao/whatsapp/page.tsx`

Adicionar ao formulário:
- Toggle para habilitar/desabilitar
- Input numérico para intervalo (5-60s)

### 6. Integrate in WhatsApp Page

**File**: `frontend/src/app/w/[slug]/client.tsx`

Renderizar `SocialProofNotification` condicionalmente quando `socialProofEnabled`.

## Testing

```bash
# Run linter
yarn lint

# Start dev server and test manually
yarn dev
```

### Manual Test Checklist

1. [ ] Acessar `/parametrizacao/whatsapp`
2. [ ] Criar/editar página com social proof habilitado
3. [ ] Configurar intervalo (ex: 10s)
4. [ ] Salvar e acessar `/w/[slug]`
5. [ ] Verificar notificação aparece após ~3s
6. [ ] Verificar notificação desaparece após ~4s
7. [ ] Verificar nova notificação após intervalo configurado
8. [ ] Testar em mobile (responsividade)

## Key Files

| File | Purpose |
|------|---------|
| `lib/validation.ts` | Schema Zod estendido |
| `lib/social-proof-data.ts` | Listas de nomes/cidades |
| `lib/repos/whatsapp-pages.ts` | Tipo estendido + migration |
| `components/social-proof-notification.tsx` | Componente de notificação |
| `app/parametrizacao/whatsapp/page.tsx` | Admin panel estendido |
| `app/w/[slug]/client.tsx` | Integração na página |

## Troubleshooting

### Notificação não aparece
- Verificar se `socialProofEnabled` está `true` no banco
- Verificar console do browser para erros JavaScript
- Verificar se o componente está sendo renderizado (React DevTools)

### Intervalo incorreto
- Verificar se valor está entre 5-60 segundos
- Verificar se valor foi salvo corretamente no Edge Config
