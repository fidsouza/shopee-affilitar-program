# Phase 0 Research — Delete existing products from edge/pixel configs

## Findings

### Decision: Use existing Next.js App Router + shadcn/ui patterns for delete controls with modal confirmation
- **Rationale**: Maintains visual and accessibility consistency; modal/confirm pattern already understood by operators and satisfies “prevent accidental deletions.”
- **Alternatives considered**: Inline destructive buttons without confirmation (too risky); toast-only undo (doesn’t align with irreversibility assumption); custom dialog library (adds dependency churn).

### Decision: Invoke Vercel Edge Config updates via existing `frontend/src/lib/edge-config.ts` helpers, with optimistic UI only after success
- **Rationale**: Reuses current SDK integration and avoids duplicated client logic; delaying list removal until success prevents partial state drift called out in spec.
- **Alternatives considered**: Direct HTTP to Edge Config API (bypasses shared helpers and validation); optimistic removal with rollback (adds complexity without user benefit for small lists).

### Decision: Remove pixel entries via the current Facebook Pixel + Conversion API client wrapper and sync UI after confirmation
- **Rationale**: Keeps tracking data consistent with edge config deletions; leverages existing lean client already used for creation flows; aligns with requirement that no events fire for deleted products.
- **Alternatives considered**: Leaving pixel removal to a batch sync later (risks stale tracking); building a new client layer (unneeded duplication).

### Decision: Enforce delete permissions in the UI guard plus server-side handler
- **Rationale**: Spec requires blocking unauthorized deletes; dual checks prevent spoofed requests and reduce UX confusion.
- **Alternatives considered**: UI-only guard (insufficient) or server-only guard with hidden actions (worse UX feedback).

### Decision: Observability via success/failure counts and latency for delete actions
- **Rationale**: Supports constitution performance budget (<2s UI, backend p95 <300ms) and helps detect regression spikes or API errors.
- **Alternatives considered**: Relying solely on client toasts (no aggregate view); adding new telemetry stack (overkill for scope).
