const assert = require('node:assert/strict')
async function get(path) {
 const response = await fetch('http://localhost:3000/api/fastrr/' + path)
 return { status: response.status, body: await response.json(), cache: response.headers.get('cache-control') }
}
async function main() {
 const products = await get('products')
 assert.equal(products.status, 200)
 assert.equal(products.cache, 'no-store')
 assert.ok(products.body.data.total > 0)
 assert.ok(products.body.data.products.every(p => p.handle !== 'laundry-pods' && Number.isSafeInteger(p.id)))
 const collections = await get('collections')
 assert.equal(collections.status, 200)
 for (const c of collections.body.data.collections) {
   const filtered = await get('products-by-collection?collection_id=' + c.id)
   assert.equal(filtered.status, 200)
   assert.ok(filtered.body.data.total > 0)
   const alias = await get('products?collection_id=' + c.id)
   assert.deepEqual(alias.body, filtered.body)
 }
 const paged = await get('products?page=2&limit=1')
 assert.equal(paged.body.data.total, products.body.data.total)
 assert.equal(paged.body.data.products.length, 1)
 assert.equal((await get('products?page=0')).status, 400)
 assert.equal((await get('products-by-collection')).status, 400)
 assert.equal((await get('products-by-collection?collection_id=1')).status, 404)
 const empty = await get('products?page=9999')
 assert.equal(empty.status, 200)
 assert.equal(empty.body.data.products.length, 0)
 console.log(JSON.stringify({passed:true,products:products.body.data.total,collections:collections.body.data.collections.map(c => ({id:c.id,title:c.title}))}, null, 2))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
