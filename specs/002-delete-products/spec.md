# Feature Specification: Delete existing products from edge/pixel configs

**Feature Branch**: `[002-delete-products]`  
**Created**: 2025-12-07  
**Status**: Draft  
**Input**: User description: "agora vamos criar uma nova feature. QUeremos deletar os produtos já criados . Vamos colocar uma deletar ao lado da lista de cada produto cadastrado, para que seja possível remove-los das configuradores de edge.Tamb;em vamos implementar isso para o pixel, ter a possibilidade de remover"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remove product from edge configuration list (Priority: P1)

An operator managing edge configurations needs to delete a previously added product directly from the list to keep the configuration current.

**Why this priority**: Prevents stale or incorrect products from being delivered by edge configurations, avoiding wrong offers in production.

**Independent Test**: Select a product in the list, trigger delete, confirm, and verify it disappears and no longer appears in the edge configuration export without affecting other products.

**Acceptance Scenarios**:

1. **Given** a list of configured products, **When** the operator clicks delete for one product and confirms, **Then** the product is removed from the list and from the underlying edge configuration data.
2. **Given** a delete action is triggered, **When** the system cannot complete it (e.g., validation or service failure), **Then** the operator sees an error, the product remains visible, and no configuration change is applied.

---

### User Story 2 - Remove product from pixel tracking setup (Priority: P2)

An operator needs to remove a product from pixel tracking so events stop firing for products that are no longer promoted.

**Why this priority**: Ensures tracking reflects active products only, preventing noise and misattributed conversions.

**Independent Test**: Delete a product from the pixel list and verify it disappears from pixel configuration outputs and no new events are triggered for that product.

**Acceptance Scenarios**:

1. **Given** pixel-configured products are listed, **When** the operator deletes one entry, **Then** the product is removed from pixel configuration data and the list reflects the change immediately.

---

### User Story 3 - Prevent accidental deletions (Priority: P3)

An operator wants reassurance before removing a product, with the ability to cancel if the action was accidental.

**Why this priority**: Reduces risk of losing valid products through misclicks, avoiding interruptions to active campaigns.

**Independent Test**: Initiate a delete action, cancel at the confirmation step, and verify the product remains unchanged with no downstream configuration impact.

**Acceptance Scenarios**:

1. **Given** a delete control is used, **When** the operator cancels at confirmation, **Then** no removal occurs and the list and configurations stay intact.

---

### Edge Cases

- Deleting the last remaining product should present an empty state and keep configurations valid without orphaned references.
- Attempting to delete a product that was already removed in another session should show a non-blocking notice and refresh the list.
- Deletion attempted while offline or during a timeout should not apply partial changes; the product stays until a successful retry.
- Products linked to multiple tracking contexts (edge and pixel) must be removed consistently so no stale tracking remains in either context.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Show a delete control adjacent to each product in the edge configuration list for users with delete permission.
- **FR-002**: Require explicit confirmation before removing any product and allow the operator to cancel without side effects.
- **FR-003**: On confirmation, remove the product from edge configuration data and update the visible list in the same session.
- **FR-004**: Provide the same delete capability for each product in pixel tracking configuration, with confirmation mirroring edge behavior.
- **FR-005**: Ensure deleting a product also removes its pixel tracking entry so no further tracking events are emitted for that product.
- **FR-006**: Surface success feedback once removal completes and refresh summaries (counts/status) to reflect the updated configuration.
- **FR-007**: On failure, display a clear error, keep the product intact, and allow retry without needing a page reload.
- **FR-008**: Block deletion attempts from unauthorized users and inform them they lack permission without revealing configuration details.

### Key Entities *(include if feature involves data)*

- **Product**: An item configured for delivery/tracking; identified by name and unique ID used across edge and pixel contexts.
- **Edge Configuration**: A collection of products used by edge delivery rules; removal should detach the product from any rule using this set.
- **Pixel Tracking Entry**: Product-level tracking definition linked to conversions/events; must be deleted alongside the product to stop tracking.

### User Experience Standards

- **UX-001**: Delete controls must be clearly labeled, reachable via keyboard, and include accessible names indicating the target product.
- **UX-002**: Confirmation and result states must cover loading, success, error, and empty-list scenarios with focus and keyboard flow documented to meet WCAG 2.1 AA.
- **UX-003**: Provide a brief flow capture (wireframe or screenshot) showing the delete control, confirmation step, and updated list/empty state for review.

### Performance Requirements

- **PRF-001**: Deletion actions should reflect in the UI within 2 seconds for 95% of attempts when the list contains up to 200 products.
- **PRF-002**: Track deletion success/failure counts and time-to-update to verify responsiveness and identify regressions.
- **PRF-003**: Handle large lists or concurrent deletions without freezing navigation; list interactions remain responsive during delete operations.

### Assumptions

- Users initiating deletions already have authenticated access to manage configurations.
- Deleting a product is irreversible through this flow; recovery, if needed, will use existing restore/backfill processes outside this feature.
- Edge and pixel configurations share the same product identity, allowing a single delete action to remove both entries.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% of confirmed deletions reflect in both edge and pixel product lists within 2 seconds.
- **SC-002**: 0% of deleted products appear in subsequent edge configuration exports or pixel tracking outputs after removal.
- **SC-003**: 100% of failed deletions present an actionable error message and leave configurations unchanged.
- **SC-004**: At least 90% of operators surveyed report they can remove a product without assistance on first attempt.
