import assert from 'node:assert/strict'
const base = process.argv[2] || 'http://localhost:3008'
const canonicalOrigin = 'https://www.mrgrimeguru.com'
const request = path => fetch(new URL(path, base), { headers: { 'User-Agent': 'Googlebot' }, redirect: 'manual' })
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'")
function attribute(tag, name) { return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] }
function meta(html, name) { const tag = [...html.matchAll(/<meta\s[^>]+>/g)].map(match => match[0]).find(tag => attribute(tag, 'name') === name || attribute(tag, 'property') === name); return tag ? attribute(tag, 'content') : undefined }
const sitemapResponse = await request('/sitemap.xml')
assert.equal(sitemapResponse.status, 200)
const sitemap = await sitemapResponse.text()
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => decode(match[1]))
assert.equal(urls.length, 20, '14 public pages plus six articles')
assert.equal(new Set(urls).size, urls.length)
assert.equal(urls.filter(url => url.includes('/blog/')).length, 6)
const pageTitles = new Set()
for (const url of urls) {
  assert.ok(url.startsWith(canonicalOrigin + '/'))
  const path = new URL(url).pathname
  const response = await request(path)
  assert.equal(response.status, 200, path)
  const html = await response.text()
  const canonical = [...html.matchAll(/<link\s[^>]+>/g)].map(match => match[0]).find(tag => attribute(tag, 'rel') === 'canonical')
  assert.equal(canonical && new URL(attribute(canonical, 'href')).href, url, `${path}: canonical`)
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: one H1`)
  assert.ok(!/noindex/.test(meta(html, 'robots') || ''), `${path}: indexable`)
  assert.ok((meta(html, 'description') || '').length > 40, `${path}: description`)
  assert.equal(new URL(meta(html, 'og:url')).href, url, `${path}: OG URL`)
  assert.ok(meta(html, 'og:image'), `${path}: OG image`)
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]
  assert.ok(title && !pageTitles.has(title), `${path}: unique title`)
  pageTitles.add(title)
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
  assert.ok(schemas.some(schema => schema['@type'] === 'Organization'), `${path}: organization`)
  if (path.startsWith('/blog/')) {
    for (const heading of html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)) assert.ok(heading[1].replace(/<[^>]*>/g, '').length < 130, `${path}: headings do not swallow paragraphs`)
    const article = schemas.find(schema => schema['@type'] === 'BlogPosting')
    assert.ok(article?.datePublished && article?.dateModified, `${path}: dated article`)
    assert.ok(schemas.some(schema => schema['@type'] === 'BreadcrumbList'))
  }
  if (path.startsWith('/shop/')) {
    const product = schemas.find(schema => schema['@type'] === 'Product')
    const price = path.includes('kitchen') ? '499.00' : path.includes('multipurpose') ? '799.00' : '699.00'
    assert.equal(product?.offers.price, price)
    assert.equal(product?.offers.priceCurrency, 'INR')
  }
  if (path === '/faq') {
    const faq = schemas.find(schema => schema['@type'] === 'FAQPage')
    assert.equal(faq?.mainEntity.length, 15)
    for (const item of faq.mainEntity) assert.ok(html.includes(item.name.replace(/'/g, '&#x27;')) || html.includes(item.name), `Visible question: ${item.name}`)
  }
  if (path === '/about') assert.ok(html.includes('class="guru-about-shop-link"'), 'About CTA uses the visible, compact button style')
  console.log(`PASS ${path}: canonical, metadata, heading and structured data`)
}
for (const path of ['/cart', '/checkout', '/checkout/return', '/order-success', '/account', '/account/orders', '/login', '/admin']) {
  const response = await request(path)
  assert.match(response.headers.get('x-robots-tag') || '', /noindex/, `${path}: X-Robots-Tag`)
}
for (const [path, expected] of [['/guides', '/blog'], ['/shop/floor-cleaner', '/shop/multipurpose-cleaner'], ['/shop/kitchen-degreaser', '/shop/kitchen-cleaner'], ['/products/shoe-cleaner', '/shop/shoe-cleaner']]) {
  const response = await request(path)
  assert.equal(response.status, 308)
  assert.equal(new URL(response.headers.get('location'), base).pathname, expected)
}
for (const path of ['/blog/not-a-real-guide', '/shop/not-a-real-cleaner']) assert.equal((await request(path)).status, 404)
const robots = await (await request('/robots.txt')).text()
assert.ok(robots.includes(`${canonicalOrigin}/sitemap.xml`))
assert.ok((await (await request('/llms.txt')).text()).includes('support@mrgrimeguru.com'))
const socialImage = await request('/social-image')
assert.equal(socialImage.status, 200)
assert.match(socialImage.headers.get('content-type'), /image\/png/)
assert.ok((await socialImage.arrayBuffer()).byteLength > 10000)
console.log('VERDICT: PASS — 20 sitemap URLs, six guides, product pricing, private noindex, redirects, 404s, robots, llms and social image.')
