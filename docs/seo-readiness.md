# Search readiness and analytics

## Public routes

Canonical host: `https://www.mrgrimeguru.com`.

`/sitemap.xml` contains 14 public pages and the six published guides. It excludes account, admin, cart, checkout, API, unavailable product and legacy alias URLs. Article modification dates come from the content database; static pages do not advertise an artificial daily modification date. Product and article image URLs are included.

Public pages have specific titles, descriptions, canonical URLs and Open Graph/Twitter previews. `/social-image` renders the current brand and three cleaners at 1200 × 630. The website and organization schemas identify the actual brand and support details. Product schema uses the same displayed pricing as the purchase panel. No unverified aggregate ratings are added. Article and breadcrumb schemas accompany guides; FAQ schema uses the same questions and answers as the visible FAQ interface.

Legacy cleaner URLs redirect permanently to current product URLs. `/guides` redirects to `/blog`. Unknown products/articles return 404. Private pages use noindex metadata and HTTP headers; robots.txt disallows admin/API crawling while allowing public content. `/llms.txt` provides a factual navigation summary; it is an emerging convention, not a ranking guarantee.

## Editorial content

Six guides are published in Supabase `blog_posts`. The original three record IDs, author IDs and publication dates are preserved. Three guides were added. The original records were backed up in ignored `.vercel/seo-backup/blog-posts.json` before updating.

The blog listing, article renderer, metadata and sitemap now query the actual database schema (`status`, `featured_image_url`, etc.). Published content refreshes on a five-minute cache. Admin edits remain supported. Content is rendered as text with `##` section headings, never as unsanitized HTML. The local JSON seed is an outage fallback and the reviewed input for the one-time publishing script; do not rerun that script over later editorial changes.

## Tracking

- GA4: `G-K0PBNFRZFW`, standard Google tag initialization loaded after the page becomes interactive. GA4's enhanced-measurement browser-history setting handles SPA page views; no additional manual GA page-view events are layered on top. Verify the stream's enhanced-measurement setting and Realtime/DebugView in the owner's Analytics account.
- Meta Pixel: `891508377308340`, initialized once. A deduplicated PageView runs on initial readiness and subsequent public pathname changes. Automatic configuration is disabled; no advanced matching or customer fields are added. Standard noscript image fallback is present.
- Tags are not initially loaded on account, admin, checkout, login or order-result routes. A library already loaded during public browsing may remain active across client-side navigation; no claim is made that all vendor automatic measurements are suppressed on later private routes.
- Privacy and cookie disclosures name both providers. Ad blockers/browser privacy settings may prevent delivery. Browser loading of the scripts is verified separately from receipt in vendor reporting dashboards; dashboard receipt requires owner-account verification.

## Presentation

DM Sans replaces stretched Syne UI lettering; packaging-inspired hero text and the existing offer badge remain distinct. Each active combo has exactly three swipeable gallery views: complete bundle, foam products, and lifestyle scenes. Bundle prices and IDs come from the server-rendered active catalog, preserving cart behavior. Reduced motion, keyboard controls, focus pause and viewport-aware autoplay are supported without arrow buttons.

## Verification and deployment

Run `npm run build`, lint the changed TypeScript files, then run `node scripts/verify-seo.mjs http://localhost:3008` against a production server. Repeat the HTTP checks against the canonical host after deployment. The validator checks all sitemap URLs, unique titles, descriptions, canonicals, H1s, structured-data JSON, product prices, six dated articles, concise article headings, private noindex headers, permanent redirects, real 404s, robots, llms.txt and the PNG social image.

Manual browser checks cover desktop and 390px mobile layouts, gallery swipes/dots/autoplay, bundle cart pricing, article navigation, computed DM Sans fonts, image loading and script IDs.

## Search Console handoff

The owner confirmed the domain property is verified and showed its empty Sitemaps screen in another browser. After production validation, submit:

`https://www.mrgrimeguru.com/sitemap.xml`

Use URL Inspection on the homepage and key product/article pages to request indexing where appropriate. A sitemap submission is a discovery hint; indexing, rich results and rankings remain Google's decisions. No #1 ranking or particular third-party AI-readiness score is promised.

References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [GA4 page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views).
