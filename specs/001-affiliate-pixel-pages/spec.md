# Feature Specification: Affiliate Pixel Redirect Pages

**Feature Branch**: `[001-affiliate-pixel-pages]`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "Voce vai construir um projeto para afiliados de venda de produtos shopee,alixpress,mercado livre , amazon. A Ideia é construir um sistema que consiga construir uma pagina de transiçao para uma pagina shopee por exemplo, nessa pagina queremos ativar o pixel do facebook por exemplo e queremos também para cada pagina escolher qual evento vamos ativar(consulte o perplexity MCP para saber os eventos padrões), também vamos enviar o pixel via api de conversao do Facebook. A ideia é ter uma pagina de hoje que leve para administracao sem usuario e senha por enquanto, isto é um MVP e esta sendo validado. Onde tenha um menu lateral que tenha Cadastrar Produto, Cadastrar Pixel e seja possível informar as configuracoes padrões de pixel do facebook. Na pagina do produto queremos adicionar, link do afiliado, quais eventos vamos escolher(nao apenas um), e informar o estado do link(activo ou nao ). O Resultado deve ser uma pagina que e redireciona para o link do afiliado e ativa o pixel do facebook escolhido."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure default pixel tracking (Priority: P1)

An admin (no authentication for MVP) opens the admin area, registers a Facebook Pixel ID, and selects default Meta events (e.g., PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase) plus default conversion API parameters that will be reused across product pages.

**Why this priority**: Without a saved pixel and defaults, no tracking can be sent for any affiliate link; this is the foundation for all other flows.

**Independent Test**: Save a pixel ID with a default event set and confirm it is stored and automatically suggested on product creation.

**Acceptance Scenarios**:

1. **Given** the admin accesses the dashboard with no pixel configured, **When** they provide a pixel ID and choose default events, **Then** the system stores the configuration and shows it as the active default.
2. **Given** a default pixel and event set exists, **When** the admin opens the product creation form, **Then** the default pixel and events are pre-selected.

---

### User Story 2 - Create affiliate redirect page (Priority: P2)

An admin registers a product entry with a destination affiliate URL (Shopee, AliExpress, Mercado Livre, Amazon, etc.), selects one or more events to fire, assigns a pixel (default or chosen), and marks the link as active/inactive.

**Why this priority**: The business value comes from producing shareable redirect links tied to affiliate tracking and selected events.

**Independent Test**: Create a product with an affiliate URL, selected events, chosen pixel, and active status; verify it appears in the list with a shareable link and correct state.

**Acceptance Scenarios**:

1. **Given** the admin is on product creation with at least one pixel available, **When** they enter a valid affiliate URL, select multiple events, pick a pixel, and set status to active, **Then** the product saves with a generated transition link and displays chosen events/pixel in the summary.
2. **Given** a saved product is active, **When** the admin toggles it to inactive, **Then** the product state updates and the transition link now shows an inactive message instead of redirecting.

---

### User Story 3 - Visitor redirection with tracking (Priority: P3)

Visitors who click a generated transition link are shown the transition page, the selected pixel events fire (browser pixel and conversion API), and they are forwarded to the affiliate destination automatically.

**Why this priority**: Proper tracking and smooth redirection are the core of affiliate revenue and campaign attribution.

**Independent Test**: Open a live transition link, verify configured events are received (pixel and conversion API) and the visitor reaches the affiliate URL within the target time.

**Acceptance Scenarios**:

1. **Given** a transition link for an active product, **When** a visitor opens it, **Then** the selected events fire for the chosen pixel via browser and conversion API and the visitor is redirected to the affiliate URL within the expected time budget.
2. **Given** a visitor refreshes the transition page, **When** events are fired, **Then** duplicate event names are not emitted more than once per page load and the redirect still completes.

---

### Edge Cases

- Inactive product links must show a clear "link unavailable/inactive" message, must not trigger events, and must not redirect.
- Invalid or missing affiliate URLs are blocked at save time with a descriptive validation message.
- If no pixel is configured or selected, publishing or activating a product is blocked with guidance to add one.
- If the conversion API call fails or times out, the visitor still redirects while the failure is surfaced to the admin (log or status indicator).
- Duplicate events selected for a product should be de-duplicated so each event fires once per visit.
- If the affiliate destination is slow or unreachable, the transition page should time out gracefully and inform the visitor instead of hanging indefinitely.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Provide an admin dashboard (no authentication for MVP) with a side menu containing "Cadastrar Produto" and "Cadastrar Pixel", plus access to default pixel/event settings.
- **FR-002**: Allow saving one or more Facebook Pixel configurations (pixel ID and label) and designate one as the default for new products.
- **FR-003**: Support selecting default Meta standard events (e.g., PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase, AddPaymentInfo, CompleteRegistration) to apply automatically when creating a product if no custom events are chosen.
- **FR-004**: Enable creating and editing product entries with fields: name/title, affiliate URL (Shopee/AliExpress/Mercado Livre/Amazon), pixel selection (default or specific), one or more events to fire, and status toggle (active/inactive).
- **FR-005**: Validate affiliate URLs for presence and proper format; block save and show validation messages when invalid.
- **FR-006**: For active products, generate a transition link that loads a page which triggers the selected events via browser pixel and sends matching events via Facebook Conversion API using the configured pixel ID.
- **FR-007**: The transition page must automatically redirect visitors to the affiliate URL after initiating tracking, without exceeding the defined redirect budget.
- **FR-008**: Inactive products or products missing a valid pixel configuration must render a clear inactive/unavailable state, must not fire events, and must not redirect.
- **FR-009**: Provide an admin view listing products with their status, assigned pixel, selected events, and a copyable transition link for quick sharing.

### Key Entities *(include if feature involves data)*

- **Pixel Configuration**: Captures pixel ID, label, default flag, and default events used when creating products.
- **Product Link**: Represents an affiliate destination with fields for title, affiliate URL, status, selected events, associated pixel, and generated transition link/slug.
- **Tracking Event**: Records which event names are configured or fired for a given product visit (pixel vs. conversion API), with timestamp and outcome (sent/failed).

### User Experience Standards

- **UX-001**: Admin layout uses a persistent side menu with "Cadastrar Produto", "Cadastrar Pixel", and defaults; highlight the active section for clarity.
- **UX-002**: Forms must show inline validation for missing/invalid affiliate URLs and missing pixel selection; empty states should explain how to add the first pixel/product.
- **UX-003**: Transition page shows a brief status message (e.g., "preparando redirecionamento") and an accessible indication if the link is inactive or if redirection fails.
- **UX-004**: Provide clear status badges for product state (active/inactive) and pixel selection in the list to aid quick scanning.

### Performance Requirements

- **PRF-001**: Transition page should initiate tracking and start redirecting within 2 seconds on baseline mobile connectivity; tracking failures must not delay redirect beyond 3 seconds.
- **PRF-002**: Admin lists (products, pixels) should render in under 2 seconds with up to 50 entries.
- **PRF-003**: Event dispatch (pixel and conversion API) should attempt once per visit per selected event, avoiding duplicate sends within a single page load.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can register a default pixel and create the first active product link with selected events in under 3 minutes.
- **SC-002**: 95% of visits to active transition links redirect to the affiliate destination within 2 seconds of page load.
- **SC-003**: 95% of visits to active links emit all configured events both via browser pixel and conversion API with matching pixel ID and event names.
- **SC-004**: 0% of visits to inactive products trigger redirects or pixel/conversion API events; visitors see the inactive/unavailable message instead.
