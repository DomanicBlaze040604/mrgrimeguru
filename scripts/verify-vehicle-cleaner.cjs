// Read-only integration check: actual public catalog, gallery assets and checkout payload.
require('@next/env').loadEnvConfig(process.cwd())
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
function load(file) {
  file = path.resolve(file)
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  new Function('require', 'module', 'exports', source)(name => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name), module, module.exports)
  return module.exports
}
async function main() {
  const { loadCatalog } = load('src/lib/fastrr/handler.ts')
  const { buildCatalog, catalogId } = load('src/lib/fastrr/catalog.ts')
  const { buildCheckoutPayload } = load('src/lib/fastrr/checkout.ts')
  const { checkoutSnapshot } = load('src/lib/fastrr/orders.ts')
  const { getProductSlides, getProductInformation } = load('src/lib/product-gallery.ts')
  const rows = await loadCatalog()
  const car = rows.products.find(p => p.slug === 'vehicle-cleaner')
  assert.ok(car && car.status === 'active', 'Real active database product')
  const variant = rows.variants.find(v => v.product_id === car.id && v.is_default && v.is_active)
  assert.ok(variant && variant.sku === 'MGG-VC-500-BOGO', 'Real offer-pack variant')
  const stock = rows.inventory.find(i => i.variant_id === variant.id)
  assert.ok(stock.quantity > stock.reserved_quantity, 'Public stock permits ordering')
  const { hasAvailableProductStock } = load('src/lib/product-stock.ts')
  assert.ok(hasAvailableProductStock(stock), 'One-to-one inventory permits Add to Cart')
  assert.ok(hasAvailableProductStock([stock]), 'Array-shaped relation also supported')
  assert.equal(hasAvailableProductStock(null), false)
  assert.equal(hasAvailableProductStock({ quantity: 1, reserved_quantity: 1 }), false)
  const origin = 'https://www.mrgrimeguru.com'
  const catalog = buildCatalog(rows, origin)
  assert.equal(catalog.products.length, 4, 'All four cleaners, no laundry placeholders')
  const external = catalog.products.find(p => p.value.handle === 'vehicle-cleaner').value
  assert.equal(external.title, 'Car Cleaner')
  assert.equal(external.variants[0].price, '799.00')
  assert.equal(external.variants[0].compare_at_price, '899.00')
  assert.equal(external.variants[0].title, '2 × 500 ml · Buy 1 Get 1 Free')
  assert.equal(external.variants[0].quantity, stock.quantity - stock.reserved_quantity)
  const items = [{ variant_id: variant.id, quantity: 2 }]
  const payload = buildCheckoutPayload(items, rows, origin)
  assert.equal(payload.cart_data.items[0].variant_id, String(catalogId('variant', variant.id)))
  assert.equal(payload.cart_data.items[0].catalog_data.price, 799)
  assert.equal(payload.cart_data.items[0].quantity, 2, 'Two offer packs, not two single cans')
  assert.match(payload.cart_data.items[0].catalog_data.name, /Buy 1 Get 1 Free/)
  const snapshot = checkoutSnapshot(items, rows, origin)
  assert.ok(JSON.stringify(snapshot).includes('Car Cleaner'), 'Admin order snapshot has new product identity')
  const unavailable = { ...rows, inventory: rows.inventory.map(i => i.variant_id === variant.id ? { ...i, quantity: 0, reserved_quantity: 0 } : i) }
  assert.throws(() => buildCheckoutPayload(items, unavailable, origin), /Not enough stock/)
  const slides = getProductSlides('vehicle-cleaner', 'Car Cleaner', '/images/products/vehicle-cleaner-cutout.png')
  assert.equal(slides.length, 5)
  assert.equal(new Set(slides.map(s => s.src)).size, 5)
  assert.ok(slides[0].promotion)
  assert.ok(slides[2].src.endsWith('-foam.png'))
  for (const slide of slides) assert.ok(fs.statSync(path.join('public', slide.src)).size > 10000, slide.src)
  assert.ok(getProductInformation('vehicle-cleaner').some(section => section.title.includes('two-wheeler')))
  console.log(JSON.stringify({ name: car.name, variantId: variant.id, price: 799, compareAt: 899, availableOfferPacks: external.variants[0].quantity, galleryImages: slides.length, publicCleanerCount: catalog.products.length }))
  console.log('VERDICT: PASS — real public product, 1+1 price/stock, five gallery images, checkout payload and admin snapshot.')
}
main().catch(error => { console.error(`VERDICT: FAIL — ${error.message}`); process.exitCode = 1 })
