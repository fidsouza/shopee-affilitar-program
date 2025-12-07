# Implementation Plan: Delete existing products from edge/pixel configs

**Branch**: `[002-delete-products]` | **Date**: 2025-12-07 | **Spec**: `/home/ronan/dev-dirs/shopee-vendor/specs/002-delete-products/spec.md`
**Input**: Feature specification from `/specs/002-delete-products/spec.md`

## Summary

Add delete controls for each product entry in edge configurations and pixel tracking lists, requiring confirmation, handling errors gracefully, and keeping edge/pixel product data consistent. Implementation will use existing Next.js (App Router) frontend with React 18 + shadcn/ui, Vercel Edge Config SDK for configuration persistence, and the current Facebook Pixel/Conversion API client for tracking removal.

## Technical Context
**Language/Version**: TypeScript on Node.js 20  
**Primary Dependencies**: Next.js (App Router) with React 18, shadcn/ui components, Vercel Edge Config SDK, Facebook Pixel + Conversion API client (existing lean HTTP impl)  
**Storage**: Vercel Edge Config for product configuration and pixel mapping data (per existing setup)  
**Testing**: npm test && npm run lint  
**Target Platform**: Web admin (Next.js) and Vercel edge-backed configs; browser clients for pixel tracking configuration UI  
**Project Type**: Web application (frontend with edge-backed config/pixel integration)  
**Performance Goals**: UI delete operations reflect within 2s for 95% of attempts (spec), align with constitution defaults for backend p95 <300ms where applicable  
**Constraints**: Reuse current technology stack and design system; preserve WCAG 2.1 AA; no new major dependencies; guard against accidental deletes via confirmation  
**Scale/Scope**: Lists up to ~200 products per view; concurrent operators expected to be low (admin use)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clean Code Discipline: npm lint/test already defined; new delete flows will include unit coverage for list behaviors and error handling; no new dependencies planned. **Gate: PASS**
- Consistent User Experience: will use existing shadcn/ui patterns, document loading/empty/error/success plus confirmation UI, maintain keyboard/focus/ARIA. **Gate: PASS**
- Performance & Efficiency: performance budget set (UI <2s for 95% deletes; backend p95 <300ms), will log deletion success/failure counts and latency via existing observability hooks. **Gate: PASS**

**Post-Phase 1 Re-check**: PASS — design keeps existing stack, defines budgets/observability, and documents accessibility states.

## Project Structure

### Documentation (this feature)

```text
specs/002-delete-products/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md (created in /speckit.tasks phase)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/           # Next.js App Router routes/layouts
│   ├── components/    # Shared UI components (incl. shadcn/ui usage)
│   └── lib/           # Edge config, validation, utilities
└── node_modules/      # Existing dependencies
```

**Structure Decision**: Web-only Next.js (App Router) frontend; feature changes confined to `frontend/src/app` (pages/routes for products) and supporting libs in `frontend/src/lib` plus components as needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
