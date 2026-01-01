# Quickstart: WhatsApp Benefit Cards

**Feature**: 005-whatsapp-benefit-cards
**Date**: 2026-01-01

## Overview

Guia rápido para implementar os benefit cards personalizáveis nas páginas WhatsApp.

## Prerequisites

- Ambiente de desenvolvimento configurado (`yarn dev`)
- Acesso ao Edge Config (variáveis de ambiente configuradas)
- Branch `005-whatsapp-benefit-cards` checked out

## Implementation Steps

### Step 1: Extend Validation Schema

**File**: `frontend/src/lib/validation.ts`

```typescript
// Adicionar após os schemas existentes

export const benefitCardSchema = z.object({
  emoji: z.string()
    .min(1, "Emoji é obrigatório")
    .max(2, "Emoji deve ter no máximo 2 caracteres"),
  title: z.string()
    .min(1, "Título é obrigatório")
    .max(50, "Título deve ter no máximo 50 caracteres"),
  description: z.string()
    .max(150, "Descrição deve ter no máximo 150 caracteres")
    .optional(),
});

export type BenefitCard = z.infer<typeof benefitCardSchema>;

export const emojiSizeSchema = z.enum(["small", "medium", "large"]).default("medium");
export type EmojiSize = z.infer<typeof emojiSizeSchema>;

// Atualizar whatsAppPageSchema adicionando:
// benefitCards: z.array(benefitCardSchema).max(8).default([]),
// emojiSize: emojiSizeSchema,
```

### Step 2: Extend Type Definition

**File**: `frontend/src/lib/repos/whatsapp-pages.ts`

```typescript
// Atualizar WhatsAppPageRecord:
export type WhatsAppPageRecord = {
  // ... campos existentes ...
  benefitCards: BenefitCard[];
  emojiSize: "small" | "medium" | "large";
};
```

### Step 3: Update Admin Form

**File**: `frontend/src/app/parametrizacao/whatsapp/page.tsx`

Adicionar ao FormState:
```typescript
type FormState = {
  // ... existing fields ...
  benefitCards: BenefitCard[];
  emojiSize: "small" | "medium" | "large";
};
```

Adicionar componentes de UI para:
- Lista de benefit cards
- Botões adicionar/remover card
- Inputs para emoji, título, descrição
- Botões mover cima/baixo
- Select para tamanho do emoji

### Step 4: Update Redirect Page

**File**: `frontend/src/app/w/[slug]/client.tsx`

Adicionar seção de benefit cards:
```tsx
{page.benefitCards.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {page.benefitCards.map((card, idx) => (
      <div key={idx} className="bg-white rounded-lg p-4 shadow">
        <span className={emojiSizeClasses[page.emojiSize]}>
          {card.emoji}
        </span>
        <h3 className="font-bold mt-2">{card.title}</h3>
        {card.description && (
          <p className="text-sm text-gray-600">{card.description}</p>
        )}
      </div>
    ))}
  </div>
)}
```

## Testing Checklist

- [ ] Criar página sem benefit cards (deve funcionar como antes)
- [ ] Adicionar 1 benefit card e salvar
- [ ] Adicionar 8 benefit cards (limite máximo)
- [ ] Tentar adicionar 9º card (deve ser bloqueado)
- [ ] Editar card existente
- [ ] Remover card
- [ ] Reordenar cards (mover cima/baixo)
- [ ] Testar cada tamanho de emoji (small/medium/large)
- [ ] Verificar layout responsivo (mobile/tablet/desktop)
- [ ] Verificar página sem cards não mostra seção

## Key Files to Modify

| File | Changes |
|------|---------|
| `lib/validation.ts` | Add benefitCardSchema, emojiSizeSchema |
| `lib/repos/whatsapp-pages.ts` | Extend WhatsAppPageRecord type |
| `app/parametrizacao/whatsapp/page.tsx` | Add benefit cards form UI |
| `app/w/[slug]/client.tsx` | Add benefit cards display |

## Commands

```bash
# Start dev server
cd frontend && yarn dev

# Check for lint errors
yarn lint

# Build for production
yarn build
```

## Troubleshooting

**Cards not saving?**
- Verify Zod validation is updated
- Check browser console for validation errors
- Ensure payload includes `benefitCards` array

**Cards not displaying?**
- Check if `page.benefitCards` exists (may be undefined for old pages)
- Use fallback: `page.benefitCards ?? []`

**Emoji size not working?**
- Verify `emojiSize` field in data
- Check CSS classes are correctly mapped
