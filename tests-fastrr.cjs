const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
// Load the pure TypeScript formatter without adding a test-runtime dependency.
const loaded = new Map()
function load(file) {
  file = path.resolve(file)
  if (loaded.has(file)) return loaded.get(file).exports
  const module = { exports: {} }
  loaded.set(file, module)
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  new Function('require', 'module', 'exports', source)(name => name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts')) : require(name), module, module.exports)
  return module.exports
}
const { buildCatalog, catalogId, catalogResponse, parseCatalogQuery } = load('src/lib/fastrr/catalog.ts')
const stamp = '2026-10-26T00:00:00Z'
const product = (id, slug, category_id = 'category-1') => ({ id, slug, name: slug, family: slug.replaceAll('-', '_'), category_id, status: 'active', description: '<script>bad</script>', short_description: '', created_at: stamp, updated_at: stamp })
const variant = (id, product_id) => ({ id, product_id, name: 'Original', sku: id, price_paise: 12345, compare_at_price_paise: 15000, weight_grams: 560, is_default: true, is_active: true, created_at: stamp, updated_at: stamp })
function fixture() {
  return { products: [product('p1', 'kitchen-degreaser'), product('p2', 'shoe-cleaner', 'category-2'), product('pods', 'laundry-pods'), product('beads', 'laundry-beads'), { ...product('draft', 'draft'), status: 'draft' }], variants: [variant('v1', 'p1'), variant('v2', 'p2'), variant('vp', 'pods'), variant('vb', 'beads'), variant('vd', 'draft'), { ...variant('inactive', 'p1'), is_active: false }], categories: ['category-1', 'category-2', 'empty'].map(id => ({ id, name: id, slug: id, description: '', created_at: stamp, updated_at: stamp })), inventory: [{ variant_id: 'v1', quantity: 10, reserved_quantity: 3 }, { variant_id: 'v2', quantity: 2, reserved_quantity: 4 }], media: [] }
}
const origin = 'https://www.mrgrimeguru.com'
test('numeric IDs stay stable, safe and namespaced', () => {
  assert.equal(catalogId('product', 'abc'), catalogId('product', 'abc'))
  assert.notEqual(catalogId('product', 'abc'), catalogId('variant', 'abc'))
  assert.ok(Number.isSafeInteger(catalogId('product', 'abc')))
  assert.ok(catalogId('product', 'abc') > 0)
})
test('catalog excludes coming-soon/draft/inactive items and empty collections', () => {
  const catalog = buildCatalog(fixture(), origin)
  assert.equal(catalog.products.length, 2)
  assert.equal(catalog.collections.length, 2)
  assert.equal(catalog.products[0].value.variants.length, 1)
  const ids = [...catalog.products.flatMap(p => [p.value.id, ...p.value.variants.map(v => v.id)]), ...catalog.collections.map(c => c.value.id)]
  assert.equal(new Set(ids).size, ids.length)
})
test('offer pricing, canonical images and reserved inventory match the storefront', () => {
  const catalog = buildCatalog(fixture(), origin)
  const kitchen = catalog.products[0].value
  assert.equal(kitchen.handle, 'kitchen-cleaner')
  assert.equal(kitchen.title, 'Kitchen Cleaner')
  assert.equal(kitchen.variants[0].title, '500 ml')
  assert.equal(kitchen.variants[0].price, '499.00')
  assert.equal(kitchen.variants[0].compare_at_price, '599.00')
  assert.equal(kitchen.variants[0].quantity, 7)
  assert.equal(kitchen.image.src, origin + '/images/products/kitchen-cleaner-cutout.png')
  assert.equal(catalog.products[1].value.variants[0].price, '599.00')
  assert.equal(catalog.products[1].value.variants[0].quantity, 0)
})
test('non-default variants retain their actual price; missing stock is zero', () => {
  const rows = fixture()
  rows.variants.push({ ...variant('other', 'p1'), is_default: false })
  const other = buildCatalog(rows, origin).products[0].value.variants[1]
  assert.equal(other.price, '123.45')
  assert.equal(other.quantity, 0)
})
test('filtered totals and pages reflect collections; unknown collection is 404', () => {
  const catalog = buildCatalog(fixture(), origin)
  const query = parseCatalogQuery(new URLSearchParams('page=2&limit=1'))
  assert.equal(catalogResponse(catalog, 'products', query).data.total, 2)
  assert.equal(catalogResponse(catalog, 'products', query).data.products[0].handle, 'shoe-cleaner')
  const id = catalog.collections[0].value.id
  const filtered = catalogResponse(catalog, 'products', { page: 1, limit: 100, collectionId: id })
  assert.equal(filtered.data.total, 1)
  assert.equal(filtered.data.products[0].handle, 'kitchen-cleaner')
  assert.deepEqual(catalogResponse(catalog, 'products', { page: 20, limit: 100 }).data.products, [])
  assert.throws(() => catalogResponse(catalog, 'products', { page: 1, limit: 100, collectionId: 1 }), e => e.status === 404)
})
test('invalid and duplicate query parameters fail before a database call', () => {
  for (const value of ['page=0', 'page=-1', 'page=1.5', 'limit=101', 'limit=0', 'page=x', 'page=1&page=2', 'collection_id=', 'collection_id=9007199254740992']) {
    assert.throws(() => parseCatalogQuery(new URLSearchParams(value)), e => e.status === 400)
  }
  assert.throws(() => parseCatalogQuery(new URLSearchParams(), true), e => e.status === 400)
})
test('duplicate catalog IDs and unsafe prices fail closed', () => {
  const rows = fixture()
  rows.variants.push(variant('v1', 'p1'))
  assert.throws(() => buildCatalog(rows, origin), /Duplicate/)
  const invalid = fixture()
  invalid.variants[0] = { ...invalid.variants[0], is_default: false, price_paise: 1.5 }
  assert.throws(() => buildCatalog(invalid, origin), /Invalid catalog price/)
})
