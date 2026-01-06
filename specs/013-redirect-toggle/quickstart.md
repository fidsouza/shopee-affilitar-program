# Quickstart: Toggle de Redirect com Eventos Separados

**Feature**: 013-redirect-toggle
**Date**: 2026-01-06

## Overview

Esta feature adiciona controle sobre o redirect automático nas páginas WhatsApp (`/w/[slug]`), permitindo:
1. Desabilitar o redirect automático (usuário só vai para WhatsApp ao clicar no botão)
2. Configurar eventos de pixel diferentes para clique no botão vs redirect automático

## Arquivos Afetados

### Validação
- `src/lib/validation.ts` - Adicionar campos `redirectEnabled` e `buttonEvent` ao schema

### Repository
- `src/lib/repos/whatsapp-pages.ts` - Atualizar tipos e migração para novos campos

### Frontend (Admin)
- `src/app/parametrizacao/whatsapp/page.tsx` - Adicionar controles na aba "Pixel"

### Frontend (Redirect Page)
- `src/app/w/[slug]/client.tsx` - Implementar lógica condicional de redirect e eventos

## Ordem de Implementação

### 1. Validação (Zod Schema)
```typescript
// src/lib/validation.ts
export const whatsAppPageSchema = z.object({
  // ... campos existentes ...
  redirectEnabled: z.boolean().default(true),
  buttonEvent: metaEventEnum.optional(),
});
```

### 2. Repository (Tipos e Migração)
```typescript
// src/lib/repos/whatsapp-pages.ts
export type WhatsAppPageRecord = {
  // ... campos existentes ...
  redirectEnabled: boolean;
  buttonEvent?: MetaEvent;
};

function migrateRecord(record: LegacyWhatsAppPageRecord): WhatsAppPageRecord {
  // ... migrações existentes ...
  migrated.redirectEnabled = record.redirectEnabled ?? true;
  migrated.buttonEvent = record.buttonEvent;
  return migrated;
}
```

### 3. Admin UI (Aba Pixel)
```typescript
// src/app/parametrizacao/whatsapp/page.tsx
type FormState = {
  // ... campos existentes ...
  redirectEnabled: boolean;
  buttonEvent: MetaEvent | "";
};

const initialForm: FormState = {
  // ... valores existentes ...
  redirectEnabled: true,
  buttonEvent: "",
};
```

### 4. Client-Side (Redirect Page)
```typescript
// src/app/w/[slug]/client.tsx
// Separar lógica em duas funções:
const handleButtonClick = () => {
  const event = page.buttonEvent ?? page.redirectEvent;
  // dispara event
  // navega para whatsappUrl
};

const handleAutoRedirect = () => {
  // dispara page.redirectEvent
  // navega para whatsappUrl
};

// Countdown só ativa se redirectEnabled === true
```

## Teste Manual

1. Criar página com redirect habilitado (comportamento atual)
2. Verificar countdown e redirect automático funcionam
3. Editar página, desabilitar redirect
4. Verificar que countdown não aparece
5. Clicar no botão, verificar que funciona
6. Configurar evento diferente para botão
7. Verificar no Meta Pixel Helper que eventos corretos disparam

## Backward Compatibility

- Páginas existentes: `redirectEnabled` assume `true`, `buttonEvent` assume `undefined` (usa `redirectEvent`)
- Nenhuma ação necessária do usuário para manter comportamento atual
