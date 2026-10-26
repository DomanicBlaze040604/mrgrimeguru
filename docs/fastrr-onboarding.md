# Fastrr / Shiprocket catalog onboarding

The three catalog endpoints are implemented and tested locally. These public URLs become available after deploying this code and connecting the domain to the deployment.

## Details to share

- Domain Name: https://www.mrgrimeguru.com
- Products API: https://www.mrgrimeguru.com/api/fastrr/products?page=1&limit=100
- Products by Collection API: https://www.mrgrimeguru.com/api/fastrr/products-by-collection?collection_id=3115105571797983&page=1&limit=100
- Collections API: https://www.mrgrimeguru.com/api/fastrr/collections?page=1&limit=100
- Shiprocket Company ID: [add manually]
- Email ID: support@mrgrimeguru.com
- Phone: [add manually]
- Business entity: [add manually]

The collection ID above is the Kitchen Cleaning collection in the current database. Fetch Collections to obtain the available IDs. Products API also supports `collection_id` directly, as shown in the provider's documentation.

## Contract and deployment

Reference: https://documenter.getpostman.com/view/25617008/2sB34bL3ig

- GET, public catalog data only; no customer, order or payment information is exposed.
- Products responses: `{ "data": { "total": 4, "products": [...] } }`.
- Collections responses: `{ "data": { "total": 4, "collections": [...] } }`.
- `total` is the full filtered count, before pagination. Defaults: page 1, limit 100. Limits 1–100 are accepted. Later pages return an empty array when exhausted.
- Invalid parameters return 400; an unknown collection returns 404; unavailable or invalid catalog data returns 503 with Retry-After. Responses are not cached, so stock updates are reflected on the next request.
- Catalog uses the configured Supabase database and public read policies. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the deployment. No service-role key is needed by these feeds.
- FASTRR_PUBLIC_SITE_URL defaults to https://www.mrgrimeguru.com and supplies absolute image URLs. Configure it if the production domain changes. Set NEXT_PUBLIC_SITE_URL to the production domain for site metadata too.
- Only active products and active variants are included. Laundry Pods is excluded while coming soon. Other existing active database products remain included. Default cleaner variants are labeled 500 ml (no Buy 1 Get 1 offer) and use the same introductory prices as the storefront and server-side order calculation; other active variants use their stored prices.
- Stock is quantity minus reserved quantity, clamped at zero; missing stock records produce zero. Unknown shipping weights are omitted rather than invented. Verify stored variant weights, SKUs and pack sizes before enabling live Fastrr checkout.
- IDs are deterministic positive numeric longs derived from the existing UUIDs: SHA-256 of `mrgrimeguru:fastrr:v1:<product|variant|collection>:<uuid>`, first 13 hex digits interpreted as an integer, plus 1. They fit JSON's safe integer range. Do not change this mapping after the first sync. Collision detection fails the feed rather than publishing duplicate IDs. Future order integration must use the same mapping to resolve Fastrr IDs back to stored UUIDs.
- These are the requested catalog endpoints. Checkout tokens, order creation/webhooks, refunds and the Fastrr checkout widget are separate integrations and are not enabled by these routes.

## Checks

- Pure contract tests: `node tests-fastrr.cjs`
- Local live API checks with the dev server on port 3000: `node tests-fastrr-live.cjs`
- TypeScript: `npx tsc --noEmit`
- Production build: `npm run build`

After deployment, run the three public URLs above once before sharing them with the onboarding team. Company ID, phone and legal entity are intentionally left for manual entry.
