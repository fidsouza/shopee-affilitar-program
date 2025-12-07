# Research - Affiliate Pixel Redirect Pages

## Edge traffic assumptions (resolves NEEDS CLARIFICATION)
- **Decision:** Plan for up to ~20 RPS burst per transition link (social traffic spikes) with average <5 RPS across all links; stay within Vercel Edge Config read budgets and avoid per-visit writes.
- **Rationale:** MVP scope is tens of products/pixels; typical affiliate campaigns generate low sustained load but may spike briefly after shares. Edge Config reads are O(1) and well-suited for fast, read-mostly access.
- **Alternatives considered:** Treat as purely low-traffic (<1 RPS) — too optimistic for social spikes; assume high-traffic (>100 RPS) — would force early shard/replica design not justified by MVP data.

## Vercel Edge Config usage
- **Decision:** Store pixel configs (id, label, default flag, default events) and product link records (slug, name, affiliate URL, pixelRef, events[], active flag) in Edge Config as JSON entries keyed by namespace (`pixels:*`, `products:*`) plus a compact index for listings.
- **Rationale:** Edge Config gives low-latency global reads and avoids cold starts; storing compact index enables admin lists without scanning all keys client-side. Write frequency is low (admin actions only), matching Edge Config characteristics.
- **Alternatives considered:** Persist to serverless DB (e.g., Supabase/Planetscale) — adds latency and infra overhead; file-based storage — not deployable to edge and lacks runtime mutability.

## Next.js + Vite + shadcn approach
- **Decision:** Build the app with Next.js (App Router) running on Node 20; use Vite for component/dev tooling (e.g., preview sandbox) while production pages use Next’s Edge runtime for transition routes. shadcn/ui supplies composable UI primitives.
- **Rationale:** Aligns with user ask for both Next.js and Vite while keeping production runtime stable on Next/Edge; Vite aids fast local component iteration without affecting deploy pipeline.
- **Alternatives considered:** Pure Next.js without Vite — conflicts with user instruction; pure Vite SPA — loses built-in routing/edge API support needed for redirect + conversion API handling.

## Edge transition/redirect pattern
- **Decision:** Use Edge Route handlers to fetch product config from Edge Config, dedupe events per request, send Conversion API via fetch with short timeout, trigger browser pixel via embedded script, and initiate redirect after events start (target ≤2s). If inactive/missing pixel, render an accessible inactive page with no sends.
- **Rationale:** Edge runtime minimizes latency to start tracking; centralizing logic in a handler ensures validation and dedup before rendering client script; timeout keeps redirect budget.
- **Alternatives considered:** Client-only fetch of config — slower and exposes config mutation; serverless function (non-edge) — higher latency vs edge for global users.

## Facebook Pixel + Conversion API event handling
- **Decision:** Support Meta standard events required by spec: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Lead`, `Purchase`, `AddPaymentInfo`, `CompleteRegistration`. Use event_id-based dedup (shared between pixel and CAPI), send each event once per load, and guard against duplicate selection on product config.
- **Rationale:** Covers requested default/selection set; event_id dedup is Meta-recommended and prevents double counting across pixel/CAPI; single-send guard matches PRF-003.
- **Alternatives considered:** Fire all selected events only client-side — misses server-side reliability; generate unique IDs per channel — prevents dedup and risks double-counting.
