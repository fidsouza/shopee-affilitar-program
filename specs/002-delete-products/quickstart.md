# Quickstart — Delete existing products from edge/pixel configs

1) **Checkout branch**: `git checkout 002-delete-products`
2) **Install deps** (if needed): `cd /home/ronan/dev-dirs/shopee-vendor/frontend && npm install`
3) **Run app**: `npm run dev` (ensure env for Vercel Edge Config + pixel client is configured as in existing setup)
4) **Lint/Tests**: `npm test && npm run lint` (tests currently alias lint; ensure both commands pass)
5) **Manual verify**:
   - Load the product list page; confirm delete buttons show beside each product.
   - Trigger delete for a product, confirm, and ensure it disappears; on reload it stays removed.
   - Repeat delete flow on pixel page; ensure pixel entry is removed and default selection still valid.
   - Simulate failure/offline (e.g., block network) and confirm error appears while the item remains with ability to retry.
   - Check console logs for delete latency and success/failure; ensure UI response under ~2s per operation.
