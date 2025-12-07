# Implementation Plan: Affiliate Pixel Redirect Pages

**Branch**: `[001-affiliate-pixel-pages]` | **Date**: 2025-12-06 | **Spec**: `/home/ronan/dev-dirs/shopee-vendor/specs/001-affiliate-pixel-pages/spec.md`
**Input**: Feature specification from `/specs/001-affiliate-pixel-pages/spec.md`

## Summary

Build an MVP admin (no auth) to register Facebook Pixel configs with default Meta events and create affiliate redirect pages (Shopee/AliExpress/Mercado Livre/Amazon). Each active product generates a transition page that fires selected events via browser pixel and Facebook Conversion API, then redirects to the affiliate URL within the defined budget; inactive pages show an unavailable state without firing events. Tech: Next.js (App Router) with Vite-based tooling, TypeScript on Node 20, Yarn, shadcn UI components, and Vercel Edge Config/Edge Storage for low-latency config + link data.

## Technical Context

**Language/Version**: TypeScript on Node.js 20 (per user)  
**Primary Dependencies**: Next.js (App Router) with Vite-based tooling, React 18, shadcn/ui for components, Vercel Edge Config SDK, Facebook Pixel + Conversion API client (lean HTTP implementation)  
**Storage**: Vercel Edge Config / Edge Storage for pixel configs, defaults, and product link data  
**Testing**: None for MVP (per user; add later)  
**Target Platform**: Web (Next.js app with Edge runtime for redirect pages)  
**Project Type**: Web application (admin + transition pages)  
**Performance Goals**: Transition page fires events and starts redirect ≤2s on baseline mobile; no redirect delay beyond 3s on tracking failure; admin lists render ≤2s for up to 50 items; zero duplicates per page load  
**Constraints**: Must run on Edge runtime for redirect handlers; avoid server-side latency >300ms for config fetch; adhere to WCAG 2.1 AA for admin UI states (loading/empty/error/success); no auth in MVP  
**Scale/Scope**: MVP with tens of products/pixels; traffic bursts on transition links (assume up to low thousands/day, ~20 RPS burst per link, <5 RPS average overall)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clean Code Discipline: use ESLint/Prettier + TypeScript types; minimal deps (Next.js, shadcn, Vercel Edge Config). Automated tests deferred per user MVP request — requires documented waiver plus manual acceptance checklist.
- Consistent User Experience: shadcn/ui components with shared theme; define loading/empty/error/success states for pixels/products and transition page inactive state; keyboard focus + aria labeling to meet WCAG 2.1 AA.
- Performance & Efficiency: budgets declared (transition start ≤2s, redirect ≤3s worst-case failure, admin lists ≤2s for 50 items); observability via edge logs/console for tracking results and config fetch timing; regressions treated as blockers unless waiver recorded.

## Project Structure

### Documentation (this feature)

```text
specs/001-affiliate-pixel-pages/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # Phase 2 output (future)
```

### Source Code (repository root)

```text
frontend/
├── app/                 # Next.js App Router (admin UI + transition routes)
├── components/          # shadcn/ui-based shared components
├── lib/                 # edge config client, validation, analytics helpers
├── styles/              # design tokens/theme
├── edge/                # edge runtime handlers (redirect, tracking)
└── public/
```

**Structure Decision**: Single Next.js frontend under `/frontend` using App Router with Edge routes for transition pages; no separate backend service. Specs remain in `/specs/001-affiliate-pixel-pages/*`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Automated tests deferred | MVP request to ship quickly; will rely on manual acceptance and edge logs | Adding automated tests now would delay MVP scope; follow-up task to introduce tests once flows stabilize |
