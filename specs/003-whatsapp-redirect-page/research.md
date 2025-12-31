# Research: WhatsApp Redirect Page

**Feature Branch**: `003-whatsapp-redirect-page`
**Date**: 2025-12-30

## Executive Summary

Esta feature segue os padrões já estabelecidos no projeto. Não há necessidade de pesquisa externa - todas as decisões técnicas são baseadas na arquitetura existente.

## Decisions

### 1. Storage Pattern

**Decision**: Two-level index storage (igual a Products/Pixels)

**Rationale**:
- Padrão já validado e funcional no projeto
- Evita carregar todos os registros para operações de listagem
- Edge Config tem limites de tamanho por chave

**Alternatives Considered**:
- Single key storage: Rejeitado por limitação de tamanho e performance
- Database externo: Over-engineering para o escopo atual

### 2. URL Pattern

**Decision**: `/w/[slug]` para páginas públicas

**Rationale**:
- Consistente com `/t/[slug]` para products
- Short URL ideal para compartilhamento
- Namespace separado evita conflitos

**Alternatives Considered**:
- `/whatsapp/[slug]`: Mais longo, pior para compartilhamento
- `/wpp/[slug]`: Menos intuitivo

### 3. WhatsApp URL Validation

**Decision**: Aceitar `chat.whatsapp.com/*` e `wa.me/*` (HTTPS only)

**Rationale**:
- `chat.whatsapp.com` é o formato padrão de convite de grupo
- `wa.me` é o shortener oficial do WhatsApp
- HTTPS obrigatório para segurança

**Alternatives Considered**:
- Aceitar qualquer URL: Risco de segurança, fora do propósito
- Apenas chat.whatsapp.com: Limita flexibilidade sem ganho

### 4. Meta Event Handling (Atualizado 2025-12-31)

**Decision**: Dois tipos de eventos - `events[]` (múltiplos, disparo no load) + `redirectEvent` (único, disparo antes do redirect)

**Rationale**:
- Clarificação do usuário exige separação clara entre eventos de página e evento de conversão
- `events[]`: Disparados ao carregar a página (ex: ViewContent, Lead) - permite múltipla seleção
- `redirectEvent`: Disparado ANTES do redirecionamento (clique ou automático) - evento de conversão principal
- Deduplicação do redirectEvent por sessão usando flag no client
- Ambos disparam dual-tracking (client fbq + server CAPI)

**Alternatives Considered**:
- Evento único (`buttonEvent`): Limitava flexibilidade - rejeitado por clarificação do usuário
- Todos eventos no load: Não captura momento da conversão (redirect)
- Eventos separados por caminho (clique vs auto): Complexidade desnecessária, mesmo redirectEvent serve para ambos

### 5. Header Image

**Decision**: URL externa (não upload)

**Rationale**:
- Clarificação do usuário especifica URL externa
- Evita complexidade de storage de arquivos
- Admin já tem imagens hospedadas externamente

**Alternatives Considered**:
- Upload de arquivo: Rejeitado por clarificação do usuário
- Base64 inline: Performance ruim, aumenta tamanho do registro

### 6. Social Proofs Structure

**Decision**: Array de strings simples

**Rationale**:
- Flexibilidade máxima para o admin
- Sem necessidade de estrutura complexa (ícone + texto)
- Admin pode incluir emojis diretamente no texto

**Alternatives Considered**:
- Objeto com ícone + texto: Over-engineering
- Número fixo de slots: Limita flexibilidade

### 7. Redirect Delay

**Decision**: Configurável em segundos (default: 5)

**Rationale**:
- Flexibilidade para diferentes estratégias
- 5 segundos é tempo suficiente para ler e decidir
- Consistente com transition pages

**Alternatives Considered**:
- Valor fixo: Limita uso
- Milissegundos: Complexidade desnecessária para o admin

## Integration Analysis

### Reusable Components

| Component | Location | Reuse Strategy |
|-----------|----------|----------------|
| Conversion API | `lib/conversion-api.ts` | Import direto |
| Meta Events | `lib/meta-events.ts` | Import direto |
| Pixel Repository | `lib/repos/pixels.ts` | Chamar `getPixelById()` |
| Edge Config | `lib/edge-config.ts` | Import direto |
| UUID Generator | `lib/uuid.ts` | Import direto |
| Logging | `lib/logging.ts` | Import direto |

### New Components Required

| Component | Purpose | Based On |
|-----------|---------|----------|
| `whatsapp-pages.ts` | Repository for WhatsApp pages | `products.ts` |
| `whatsAppPageSchema` | Zod validation | `productLinkSchema` |
| `/w/[slug]/page.tsx` | Server component | `/t/[slug]/page.tsx` |
| `/w/[slug]/client.tsx` | Client tracking | `/t/[slug]/client.tsx` |
| `/admin/whatsapp/page.tsx` | Admin CRUD | `/admin/products/page.tsx` |
| `/api/whatsapp/route.ts` | REST API | `/api/products/route.ts` |

### Admin Navigation Update

Adicionar em `app/admin/layout.tsx`:
```tsx
{ name: "Páginas WhatsApp", href: "/admin/whatsapp", icon: MessageCircle }
```

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| URL validation bypass | Low | Medium | Server-side validation with Zod |
| Event deduplication failure | Low | Low | Seguir padrão existente com eventId |
| Edge Config limits | Low | Medium | Index pattern já testado |
| Image URL broken | Medium | Low | Fallback visual ou hide element |

### 8. Multi-Event Selection UI (Novo 2025-12-31)

**Decision**: Checkboxes para eventos no load, dropdown para redirectEvent

**Rationale**:
- Checkboxes permitem seleção múltipla intuitiva para `events[]`
- Dropdown single-select para `redirectEvent` (apenas 1 evento permitido)
- Lista de eventos vem de `META_STANDARD_EVENTS` já existente
- Mínimo 1 evento obrigatório em `events[]`
- `redirectEvent` também obrigatório

**Alternatives Considered**:
- Multi-select dropdown: Menos intuitivo para múltipla seleção
- Drag-and-drop: Over-engineering
- Autocomplete: Desnecessário com lista pequena de eventos

### 9. Event Deduplication Strategy (Novo 2025-12-31)

**Decision**: `useRef` flag no client-side para prevenir disparo duplicado do redirectEvent

**Rationale**:
- Padrão já usado no projeto (`hasTracked` ref)
- Previne disparo se usuário clicar e countdown terminar simultaneamente
- Simples e efetivo
- Server-side: event ID único por request

**Alternatives Considered**:
- localStorage: Persistente demais, atrapalharia re-visitas legítimas
- sessionStorage: Funcionaria, mas ref é mais simples
- Cookie: Overhead desnecessário

## Conclusion

Nenhum NEEDS CLARIFICATION restante. Todas as decisões estão baseadas em:
1. Clarificações do usuário na spec (sessões 2025-12-30 e 2025-12-31)
2. Padrões existentes no codebase
3. Best practices de desenvolvimento web

**Atualização 2025-12-31**: Adicionadas decisões sobre múltiplos eventos e estratégia de deduplicação.

Próximo passo: Phase 1 - Data Model & Contracts
