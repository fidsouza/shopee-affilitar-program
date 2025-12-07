# Data Model — Delete existing products from edge/pixel configs

## Entities

### Product
- **Identifiers**: `productId` (string/UUID), `sku` (optional), `name`
- **Attributes**: `category`, `price` (for display only), `status` (active/removed)
- **Relations**: Linked to Edge Configuration entries and Pixel Tracking entries
- **Validation**: `productId` required; name non-empty; status cannot transition back to active through delete flow (irreversible here)

### Edge Configuration Entry
- **Identifiers**: `productId` (foreign key to Product)
- **Attributes**: `placement`/`ruleset` identifiers (if present in config), `addedAt`
- **Relations**: Belongs to one Product; used by edge delivery rules
- **Validation**: Entry must be removed entirely on delete; reject delete if `productId` missing

### Pixel Tracking Entry
- **Identifiers**: `productId` (foreign key to Product)
- **Attributes**: `pixelId`, `conversionSettings` (as defined in existing client), `addedAt`
- **Relations**: Belongs to one Product; consumed by tracking pipeline
- **Validation**: Must be deleted alongside the Product; ensure no events emitted post-delete for `productId`

## State Transitions
- Product: `active` -> `removed` (via delete flow). No revert path within this feature; restoration handled outside scope.
- Edge Configuration Entry: `present` -> `deleted` (removal from config set).
- Pixel Tracking Entry: `present` -> `deleted` (removal from tracking set).

## Derived/Display Data
- Counts of configured products (edge and pixel) must refresh after delete.
- Empty-state derived when zero entries remain.
