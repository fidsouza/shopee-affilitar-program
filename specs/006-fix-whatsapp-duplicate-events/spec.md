# Feature Specification: Fix WhatsApp Duplicate Meta Pixel Events

**Feature Branch**: `006-fix-whatsapp-duplicate-events`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "Corrigir bug onde eventos do Meta Pixel são disparados mais de uma vez ao clicar no botão da página de WhatsApp. Eventos como LEAD devem ser disparados apenas uma vez. O mesmo vale para eventos disparados via redirect automático."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Event on Button Click (Priority: P1)

O usuário visitante clica no botão CTA da página de WhatsApp para entrar no grupo. O sistema deve disparar o evento de redirect (ex: Lead) exatamente uma vez, independentemente de quantos cliques o usuário fizer.

**Why this priority**: Este é o cenário principal de interação do usuário com a página. Eventos duplicados causam métricas incorretas no Meta Ads e podem resultar em custos adicionais de remarketing e atribuição incorreta de conversões.

**Independent Test**: Pode ser testado abrindo a página de WhatsApp, abrindo o Meta Pixel Helper no navegador, clicando no botão CTA múltiplas vezes rapidamente e verificando que o evento de redirect aparece apenas uma vez no Pixel Helper.

**Acceptance Scenarios**:

1. **Given** uma página de WhatsApp configurada com evento de redirect "Lead", **When** o usuário clica no botão CTA pela primeira vez, **Then** o evento Lead é disparado exatamente uma vez (client-side e server-side).
2. **Given** uma página de WhatsApp onde o usuário já clicou no botão, **When** o usuário clica no botão novamente antes do redirect ocorrer, **Then** nenhum evento adicional é disparado.
3. **Given** uma página de WhatsApp aberta em modo de desenvolvimento (React Strict Mode), **When** o componente monta e remonta devido ao Strict Mode, **Then** eventos de page load não são duplicados.

---

### User Story 2 - Single Event on Auto-Redirect (Priority: P1)

O usuário visitante aguarda o countdown automático da página de WhatsApp. Quando o countdown chega a zero, o redirect automático dispara o evento de redirect exatamente uma vez.

**Why this priority**: Este cenário tem a mesma importância do clique manual, pois é o fluxo principal para usuários que não interagem com o botão.

**Independent Test**: Pode ser testado abrindo a página de WhatsApp, abrindo o Meta Pixel Helper, aguardando o countdown terminar e verificando que o evento de redirect aparece apenas uma vez.

**Acceptance Scenarios**:

1. **Given** uma página de WhatsApp configurada com redirectDelay de 5 segundos e evento de redirect "Lead", **When** o countdown chega a zero, **Then** o evento Lead é disparado exatamente uma vez.
2. **Given** uma página de WhatsApp onde o countdown está em andamento, **When** o usuário clica no botão antes do countdown terminar, **Then** apenas um evento de redirect é disparado (pelo clique, não pelo countdown).

---

### User Story 3 - Single Page Load Events (Priority: P2)

Quando a página de WhatsApp carrega, os eventos de page load configurados (ex: PageView, ViewContent) devem ser disparados exatamente uma vez cada, mesmo em cenários de re-renderização do React.

**Why this priority**: Eventos de page load são menos críticos que eventos de conversão (redirect), mas ainda afetam a qualidade das métricas.

**Independent Test**: Pode ser testado abrindo a página de WhatsApp com múltiplos eventos configurados, verificando no Meta Pixel Helper que cada evento aparece exatamente uma vez.

**Acceptance Scenarios**:

1. **Given** uma página de WhatsApp configurada com eventos ["Lead", "ViewContent"] para page load, **When** a página carrega completamente, **Then** cada evento é disparado exatamente uma vez.
2. **Given** uma página de WhatsApp em modo de desenvolvimento, **When** o React Strict Mode causa dupla montagem do componente, **Then** os eventos de page load não são duplicados.

---

### Edge Cases

- O que acontece quando o usuário clica no botão múltiplas vezes em rápida sucessão (< 100ms entre cliques)?
  - Resposta: Apenas o primeiro clique dispara o evento; cliques subsequentes são ignorados.

- Como o sistema se comporta quando a chamada à API de tracking falha?
  - Resposta: A falha da API não deve impedir o redirect nem causar tentativas de retry que disparariam eventos duplicados.

- O que acontece se o usuário navegar para longe da página e voltar (usando o botão voltar do navegador)?
  - Resposta: Os refs de deduplicação são resetados, então os eventos podem ser disparados novamente. Isso é comportamento esperado para uma nova visita à página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Sistema DEVE garantir que cada evento de redirect seja disparado no máximo uma vez por visita à página, independentemente de múltiplos cliques no botão CTA.

- **FR-002**: Sistema DEVE garantir que o redirect automático (via countdown) e o clique manual no botão compartilhem o mesmo mecanismo de deduplicação, evitando que ambos disparem eventos.

- **FR-003**: Sistema DEVE garantir que eventos de page load sejam disparados exatamente uma vez por visita, mesmo em cenários de re-renderização do React (incluindo Strict Mode).

- **FR-004**: Sistema DEVE manter a funcionalidade atual de tracking dual (client-side via fbq e server-side via Conversion API), aplicando deduplicação a ambos.

- **FR-005**: Sistema DEVE continuar redirecionando o usuário para a URL do WhatsApp após o disparo do evento, mesmo se o tracking falhar.

### Assumptions

- O React Strict Mode do Next.js em desenvolvimento causa dupla montagem de componentes, o que pode disparar useEffect duas vezes.
- A deduplicação atual usando useRef (`hasTrackedPageEvents`, `hasTrackedRedirect`) é a abordagem correta, mas pode não estar funcionando adequadamente em todos os cenários.
- O eventId gerado no servidor é único por visita e pode ser usado para deduplicação no Meta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos cenários de clique múltiplo no botão CTA, apenas um evento de redirect é registrado no Meta Pixel Helper.

- **SC-002**: Em 100% dos cenários de auto-redirect via countdown, apenas um evento de redirect é registrado.

- **SC-003**: Em modo de desenvolvimento com React Strict Mode ativo, eventos de page load aparecem exatamente uma vez no Meta Pixel Helper.

- **SC-004**: A taxa de eventos duplicados reportada pelo Meta Events Manager deve ser zero para páginas de WhatsApp corrigidas.
