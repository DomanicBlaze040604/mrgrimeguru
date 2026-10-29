# Fastrr / Shiprocket catalog onboarding

The three catalog endpoints are implemented and tested locally. These public URLs become available after deploying this code and connecting the domain to the deployment.

## Details to share

- Domain Name: https://www.mrgrimeguru.com
- Products API: https://www.mrgrimeguru.com/api/fastrr/products?page=1&limit=100
- Products by Collection API: https://www.mrgrimeguru.com/api/fastrr/products-by-collection?collection_id=3115105571797983&page=1&limit=100
- Collections API: https://www.mrgrimeguru.com/api/fastrr/collections?page=1&limit=100
- Shiprocket Company ID: [add manually]
- Email ID: support@mrgrimeguru.com
- Phone: +91 87798 17007
- Contact address: Shop no E1, Mukund Nagar CHS Ltd, Andheri Kurla Road, Marol Pipeline, JB Nagar, near Mukund Hospital, Andheri East, Mumbai 400059, India
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
- Only active products and active variants are included. Laundry Pods is excluded while coming soon. The retired Laundry Beads listing is also excluded. Other active database products remain included. Default cleaner variants are labeled 500 ml (no Buy 1 Get 1 offer) and use the same introductory prices as the storefront and server-side order calculation; other active variants use their stored prices.
- Stock is quantity minus reserved quantity, clamped at zero; missing stock records produce zero. Unknown shipping weights are omitted rather than invented. Verify stored variant weights, SKUs and pack sizes before enabling live Fastrr checkout.
- IDs are deterministic positive numeric longs derived from the existing UUIDs: SHA-256 of `mrgrimeguru:fastrr:v1:<product|variant|collection>:<uuid>`, first 13 hex digits interpreted as an integer, plus 1. They fit JSON's safe integer range. Do not change this mapping after the first sync. Collision detection fails the feed rather than publishing duplicate IDs. Future order integration must use the same mapping to resolve Fastrr IDs back to stored UUIDs.
- The catalog endpoints do not initiate payment. The separate checkout integration below prepares the token and opens the provider widget.

## Checkout setup

The purchase flow is **Buy now → /cart (review) → Proceed to Checkout → Shiprocket Checkout**. The old `/checkout` contact/address form now redirects to `/cart`. Delivery details, coupons and payment are entered in the provider widget. Prices include tax; the cart does not add GST again.

Configure these **server-only environment variables** using the hosting dashboard (never use `NEXT_PUBLIC_` for credentials):

```text
FASTRR_ENVIRONMENT=staging
FASTRR_API_KEY=<provided by Shiprocket>
FASTRR_API_SECRET=<provided by Shiprocket>
FASTRR_PUBLIC_SITE_URL=https://www.mrgrimeguru.com
```

Use the credentials for the selected environment. Both credentials and an explicit `staging` or `production` environment are required; an unconfigured site returns 503 and preserves the cart. No mock payment or Razorpay fallback is used by this flow.

- `POST /api/fastrr/checkout` accepts `{ "items": [{ "variant_id": "database-variant-uuid", "quantity": 1 }] }` from this website's cart. Client prices, discounts and redirect URLs are ignored. It resolves active variants through the same catalog as the feeds, checks available inventory, combines duplicate variants, and rejects unsupported/unavailable items.
- The server sends the documented `/api/v1/access-token/checkout` request with `X-Api-Key` and Base64 `X-Api-HMAC-SHA256` of the exact JSON body, using the API secret. The numeric external variant IDs remain identical to the catalog feeds. `catalog_data` supplies the authoritative current price (rupees), name and image. Configure any coupon promotions in Fastrr; the removed local coupon preview is not passed as a trusted discount.
- The browser loads the documented `shopify.js` and `shopify.css` assets and calls `HeadlessCheckout.addToCart(event, token, { fallbackUrl, isInitiatedFromApp: true })`. Staging uses `fastrr-api-dev.pickrr.com` / `customcheckoutfastrr.netlify.app`; production uses `checkout-api.shiprocket.com` / `checkout-ui.shiprocket.com`.
- Fallback returns to `/cart?checkout=unavailable` with a message and saved cart. The return URL is `/checkout/return`. This page does **not** trust `oid` / `ost` query parameters as payment proof, mark an order paid, or clear the cart.
- Before going live: have Shiprocket sync the catalog, enable the custom checkout for the domain, configure shipping (free at ₹499+, otherwise ₹49), tax-inclusive pricing, offers, payment methods and 7-day policy, and test a complete staging order. Confirm current inventory/pack weights in the database. Only then set the production environment and credentials.
- **Remaining order integration:** signed order webhook ingestion, verified order status, local account/order synchronization, inventory reservation/reconciliation, cart clearing after verified completion, and refund automation are not implemented here. Coordinate these with Shiprocket before live activation to avoid duplicate fulfillment or overselling. This preparation does not change existing payment endpoints or production configuration.

## Checks

- Pure contract tests: `node tests-fastrr.cjs`
- Checkout contract and mocked provider/API tests: `node tests-fastrr-checkout.cjs`
- Local live API checks with the dev server on port 3000: `node tests-fastrr-live.cjs`
- TypeScript: `npx tsc --noEmit`
- Production build: `npm run build`

After deployment, run the three public URLs above once before sharing them with the onboarding team. Company ID and legal entity are intentionally left for manual entry. Live checkout has not been exercised without merchant credentials.
