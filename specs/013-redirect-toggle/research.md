# Research: Toggle de Redirect com Eventos Separados

**Feature**: 013-redirect-toggle
**Date**: 2026-01-06

## Research Tasks

### 1. Análise da Implementação Atual de Redirect

**Questão**: Como o sistema atual implementa o redirect e o disparo de eventos?

**Análise**:
- **Arquivo**: `src/app/w/[slug]/client.tsx`
- **Comportamento atual**:
  - `page.events[]`: Disparados no carregamento da página (PageView + eventos configurados)
  - `page.redirectEvent`: Disparado tanto no clique do botão quanto no redirect automático (via countdown)
  - O countdown é controlado por `page.redirectDelay` (1-30 segundos)
  - Função `handleRedirect()` é chamada tanto pelo timer quanto pelo clique no botão

**Decisão**: Separar a lógica do `handleRedirect` em duas funções: `handleButtonClick` e `handleAutoRedirect`

**Rationale**: Permite eventos diferentes para cada ação sem duplicar código de navegação

### 2. Estrutura do Modelo de Dados

**Questão**: Como adicionar os novos campos mantendo backward compatibility?

**Análise**:
- **Arquivo**: `src/lib/repos/whatsapp-pages.ts`
- O sistema já usa padrão de migração para campos legados (`migrateRecord`)
- Campos opcionais com defaults são aplicados na migração

**Decisão**:
- `redirectEnabled: boolean` - default `true` (comportamento atual)
- `buttonEvent: MetaEvent | undefined` - quando undefined, usa `redirectEvent`

**Rationale**: Páginas existentes continuam funcionando sem alteração; nova feature é opt-in

### 3. Validação com Zod

**Questão**: Como validar os novos campos?

**Análise**:
- **Arquivo**: `src/lib/validation.ts`
- Schema usa `z.enum(META_STANDARD_EVENTS)` para eventos
- Campos opcionais usam `.optional()` ou `.default()`

**Decisão**:
```typescript
redirectEnabled: z.boolean().default(true),
buttonEvent: metaEventEnum.optional(),
```

**Rationale**: Mantém consistência com outros campos do schema

### 4. Tracking Server-Side

**Questão**: Reutilizar API existente ou criar nova?

**Análise**:
- **Arquivo**: `src/app/api/whatsapp/track-redirect/route.ts` (endpoint existente)
- Recebe `pageId`, `eventName`, `eventId`
- Já é flexível para qualquer evento

**Decisão**: Reutilizar o endpoint existente, passando `page.buttonEvent ?? page.redirectEvent`

**Rationale**: API já é genérica; evita duplicação de código

### 5. Interface do Admin

**Questão**: Onde posicionar os novos controles na UI?

**Análise**:
- **Arquivo**: `src/app/parametrizacao/whatsapp/page.tsx`
- Aba "Pixel" contém: seleção de pixel, evento de redirect, eventos de carregamento, tempo de redirect
- Padrão visual: campos relacionados agrupados

**Decisão**:
- Toggle de redirect: na aba "Pixel", abaixo do campo "Tempo de Redirect"
- Dropdown de evento do botão: na aba "Pixel", ao lado do "Evento de Redirect"

**Rationale**: Agrupa configurações de tracking; mantém consistência visual

## Summary of Decisions

| Aspecto | Decisão | Alternativa Rejeitada |
|---------|---------|----------------------|
| Modelo de dados | Campos opcionais com defaults | Criar entidade separada (over-engineering) |
| Tracking | Reutilizar API existente | Nova API dedicada (duplicação) |
| UI posição | Aba "Pixel" | Nova aba dedicada (fragmentação) |
| Backward compat | Migração com defaults | Breaking change (ruim para usuários) |
| Lógica client | Funções separadas | Condicionais inline (menos legível) |
