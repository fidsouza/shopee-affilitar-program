# Quickstart - Affiliate Pixel Redirect Pages

## Prerequisites
- Node.js 20
- Yarn
- Vercel account with Edge Config enabled; obtain the Edge Config connection string.

## Setup
1) `yarn create next-app frontend --typescript --use-yarn --app`
2) Install deps (after scaffold):
   - `cd frontend`
   - `yarn add next@latest react@18 react-dom@18 @vercel/edge-config`
   - `yarn add -D typescript @types/node @types/react eslint prettier`
   - Add shadcn/ui setup (run `yarn dlx shadcn-ui@latest init` when ready).
   - Add Vite for component sandbox (`yarn add -D vite @vitejs/plugin-react`).
3) Env: create `.env.local` in `frontend/`:
   - `EDGE_CONFIG=<vercel_edge_config_connection_string>`
   - `FB_PIXEL_API_TOKEN=<optional conversion API token if required>`

## Running
- Dev (Next): `yarn dev` from `frontend/` (Edge routes for transition pages).
- Component sandbox (Vite, optional): `yarn vite` from `frontend/`.

## Data flows
- Admin UI reads/writes pixel + product configs via Edge Config keys and indexes.
- Transition route `/t/[slug]` fetches config from Edge, dedupes events, sends Conversion API, then triggers browser pixel and redirects.

## Validation (manual for MVP)
- Add a pixel with default events; confirm it appears as default.
- Create product with allowed affiliate URL, events, active status; copy transition link.
- Visit transition link: verify inactive state shows when status=inactive; active link fires events once then redirects within budget.
