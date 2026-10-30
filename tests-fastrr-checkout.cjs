const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const { createHmac } = require('node:crypto')
function load(file, mocks = {}) {
  file = path.resolve(file)
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
  new Function('require', 'module', 'exports', source)(name => mocks[name] ?? (name.startsWith('.') ? load(path.resolve(path.dirname(file), name + '.ts'), mocks) : require(name)), module, module.exports)
  return module.exports
}
const checkout = load('src/lib/fastrr/checkout.ts')
const { checkoutConfig, parseCheckoutItems, buildCheckoutPayload, signCheckoutBody, requestCheckoutToken } = checkout
const { catalogId } = load('src/lib/fastrr/catalog.ts')
const origin = 'https://www.mrgrimeguru.com'
const config = checkoutConfig({ FASTRR_API_KEY: 'test-key', FASTRR_API_SECRET: 'test-secret', FASTRR_ENVIRONMENT: 'staging' })
function rows() {
  const stamp = '2026-10-29T00:00:00Z'
  return {
    products: [{ id: 'p1', name: 'Kitchen Cleaner', slug: 'kitchen-degreaser', family: 'kitchen_degreaser', category_id: null, description: '', short_description: '', status: 'active', created_at: stamp, updated_at: stamp }],
    variants: [{ id: 'v1', product_id: 'p1', name: 'Default', sku: 'KITCHEN', price_paise: 99900, compare_at_price_paise: null, weight_grams: null, is_default: true, is_active: true, created_at: stamp, updated_at: stamp }],
    inventory: [{ variant_id: 'v1', quantity: 5, reserved_quantity: 2 }], categories: [], media: [],
  }
}
const payload = () => buildCheckoutPayload(parseCheckoutItems({ items: [{ variant_id: 'v1', quantity: 1 }] }), rows(), origin)

test('requires explicit environment and secrets; fixed provider endpoints', () => {
  for (const env of [{}, { FASTRR_API_KEY: 'key', FASTRR_API_SECRET: 'secret' }, { FASTRR_API_KEY: 'key', FASTRR_API_SECRET: 'secret', FASTRR_ENVIRONMENT: 'typo' }]) assert.throws(() => checkoutConfig(env), { status: 503 })
  assert.equal(config.apiBase, 'https://fastrr-api-dev.pickrr.com')
  assert.equal(checkoutConfig({ FASTRR_API_KEY: 'k', FASTRR_API_SECRET: 's', FASTRR_ENVIRONMENT: 'production' }).apiBase, 'https://checkout-api.shiprocket.com')
})
test('rejects invalid quantities and empty or oversized carts; combines duplicates', () => {
  for (const quantity of [0, -1, 1.5, '1', null, 100]) assert.throws(() => parseCheckoutItems({ items: [{ variant_id: 'v1', quantity }] }), { status: 400 })
  for (const body of [null, {}, { items: [] }, { items: Array(21).fill({ variant_id: 'v1', quantity: 1 }) }]) assert.throws(() => parseCheckoutItems(body), { status: 400 })
  assert.deepEqual(parseCheckoutItems({ items: [{ variant_id: 'v1', quantity: 1 }, { variant_id: 'v1', quantity: 2 }] }), [{ variant_id: 'v1', quantity: 3 }])
  assert.throws(() => parseCheckoutItems({ items: [{ variant_id: 'v1', quantity: 99 }, { variant_id: 'v1', quantity: 1 }] }), { status: 400 })
})
test('ignores tampered client prices, discounts, IDs and redirects; uses catalog IDs and rupees', () => {
  const input = parseCheckoutItems({ items: [{ variant_id: 'v1', quantity: 1, price_paise: 1, catalog_data: { price: 0 } }], discount: 9999, redirect_url: 'https://evil.test' })
  const result = buildCheckoutPayload(input, rows(), origin, new Date('2026-10-29T00:00:00Z'))
  assert.equal(result.cart_data.items[0].variant_id, String(catalogId('variant', 'v1')))
  assert.equal(result.cart_data.items[0].catalog_data.price, 499)
  assert.equal(result.cart_data.items[0].catalog_data.image_url, `${origin}/images/products/kitchen-cleaner-cutout.png`)
  assert.equal(result.redirect_url, `${origin}/checkout/return`)
  assert.equal(result.timestamp, '2026-10-29T00:00:00.000Z')
  assert.equal(result.cart_data.cart_discount, undefined)
})
test('rejects unavailable, inactive, coming-soon, unknown or insufficient stock items', () => {
  for (const mutate of [r => { r.products[0].status = 'draft' }, r => { r.products[0].slug = 'laundry-pods' }, r => { r.variants[0].is_active = false }, r => { r.inventory = [] }]) {
    const data = rows(); mutate(data)
    assert.throws(() => buildCheckoutPayload([{ variant_id: 'v1', quantity: 1 }], data, origin), { status: 409 })
  }
  assert.throws(() => buildCheckoutPayload([{ variant_id: 'fake', quantity: 1 }], rows(), origin), { status: 409 })
  assert.throws(() => buildCheckoutPayload(parseCheckoutItems({ items: [{ variant_id: 'v1', quantity: 2 }, { variant_id: 'v1', quantity: 2 }] }), rows(), origin), { status: 409 })
})
test('signs the exact serialized provider body; mocked provider receives documented contract', async () => {
  const value = payload()
  const token = await requestCheckoutToken(value, config, async (url, options) => {
    assert.equal(url, `${config.apiBase}/api/v1/access-token/checkout`)
    assert.equal(options.method, 'POST')
    assert.equal(options.headers['X-Api-Key'], 'test-key')
    assert.equal(options.headers['X-Api-HMAC-SHA256'], createHmac('sha256', 'test-secret').update(options.body).digest('base64'))
    assert.equal(options.body, JSON.stringify(value))
    return Response.json({ ok: true, result: { token: 'test-checkout-token', data: { order_id: '000000000000000000000001' } } })
  })
  assert.deepEqual(token, {token: 'test-checkout-token', orderId: '000000000000000000000001'})
  assert.notEqual(signCheckoutBody('{}', 'a'), signCheckoutBody('{}', 'b'))
})
test('provider errors and malformed success responses never become successful checkout', async () => {
  for (const response of [Response.json({ secret: 'do-not-expose' }, { status: 500 }), Response.json({ ok: false }), Response.json({ ok: true, result: { token: '' } })]) {
    await assert.rejects(() => requestCheckoutToken(payload(), config, async () => response), { status: 502 })
  }
})
test('API protects origin, hides secrets and preserves no-store responses', async () => {
  const { POST } = load('src/app/api/fastrr/checkout/route.ts', { '@/lib/fastrr/handler': { loadCatalog: async () => rows() }, '@/lib/fastrr/checkout': checkout, 'next/headers': {cookies:async()=>({set:()=>{}})}, '@/lib/fastrr/orders': {checkoutSnapshot:()=>({}),saveCheckoutSnapshot:async()=>{}}, '@/lib/fastrr/session': load('src/lib/fastrr/session.ts') })
  const old = { key: process.env.FASTRR_API_KEY, secret: process.env.FASTRR_API_SECRET, env: process.env.FASTRR_ENVIRONMENT, fetch: global.fetch }
  const request = (body, requestOrigin = origin) => new Request(`${origin}/api/fastrr/checkout`, { method: 'POST', headers: { origin: requestOrigin, 'Content-Type': 'application/json' }, body })
  try {
    delete process.env.FASTRR_API_KEY
    let res = await POST(request('{"items":[]}'))
    assert.equal(res.status, 503)
    assert.equal(res.headers.get('cache-control'), 'no-store')
    res = await POST(request('{}', 'https://evil.test'))
    assert.equal(res.status, 403)
    Object.assign(process.env, { FASTRR_API_KEY: 'test-key', FASTRR_API_SECRET: 'test-secret', FASTRR_ENVIRONMENT: 'staging' })
    res = await POST(request('{'))
    assert.equal(res.status, 400)
    global.fetch = async () => Response.json({ ok: true, result: { token: 'mock-token', data: { order_id: '000000000000000000000001' } } })
    res = await POST(request('{"items":[{"variant_id":"v1","quantity":1}]}'))
    const data = await res.json()
    assert.equal(res.status, 200)
    assert.equal(data.token, 'mock-token')
    assert.equal(data.scriptUrl, 'https://customcheckoutfastrr.netlify.app/assets/js/channels/shopify.js')
    assert.ok(!JSON.stringify(data).includes('test-secret'))
  } finally {
    for (const [key, value] of [['FASTRR_API_KEY', old.key], ['FASTRR_API_SECRET', old.secret], ['FASTRR_ENVIRONMENT', old.env]]) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
    global.fetch = old.fetch
  }
})

const {signGuestOrder,verifyGuestOrder} = load('src/lib/fastrr/session.ts')
const orders = load('src/lib/fastrr/orders.ts')
const oid='000000000000000000000001'
const snapshot=()=>orders.checkoutSnapshot([{variant_id:'v1',quantity:1}],rows(),origin)
const verified=()=>({order_id:oid,status:'SUCCESS',cart_data:{items:[{variant_id:String(catalogId('variant','v1')),quantity:1}]},shipping_address:{first_name:'Guest',last_name:'Buyer',phone:'9999999999',line1:'Test address',city:'Mumbai',state:'Maharashtra',pincode:'400059',country:'India'},payment_type:'PREPAID',payment_status:'Success',subtotal_price:499,total_amount_payable:499,shipping_charges:0,total_discount:0})

test('guest order authorization rejects tampering, other orders, wrong key and expiration',()=>{
  const value=signGuestOrder(oid,'key',1900000000000)
  assert.equal(verifyGuestOrder(value,oid,'key',1800000000000),true)
  assert.equal(verifyGuestOrder(value,oid,'other',1800000000000),false)
  assert.equal(verifyGuestOrder(value,oid,'key',1900000000001),false)
  assert.equal(verifyGuestOrder(value,'000000000000000000000002','key',1800000000000),false)
  assert.equal(verifyGuestOrder(value+'.extra',oid,'key',1800000000000),false)
  assert.equal(verifyGuestOrder(undefined,oid,'key'),false)
})
test('confirmed guest order preserves customer, products, prices and payment metadata',()=>{
  const r=orders.confirmedOrderRecords(verified(),snapshot())
  assert.equal(r.order.payment_status,'paid')
  assert.equal(r.order.total_paise,49900)
  assert.equal(r.order.guest_email,'')
  assert.equal(r.order.shipping_address.postal_code,'400059')
  assert.equal(r.order.shipping_address.phone,'9999999999')
  assert.equal(r.items[0].variant_id,'v1')
  assert.equal(r.items[0].unit_price_paise,49900)
  assert.equal(r.payment.provider,'fastrr')
  assert.equal(r.payment.metadata.payment_type,'PREPAID')
  assert.equal(r.order.id,orders.confirmedOrderRecords(verified(),snapshot()).order.id)
})
test('COD is confirmed but never marked paid; unverified or pending payments never confirm',()=>{
  const o=verified();o.payment_type='CASH_ON_DELIVERY';o.payment_status='Pending'
  assert.equal(orders.confirmedOrderRecords(o,snapshot()).order.payment_status,'pending')
  for(const status of ['CREATED','INITIATED','FAILED']) assert.equal(orders.confirmedOrderRecords({...verified(),status},snapshot()),null)
  assert.equal(orders.confirmedOrderRecords({...verified(),payment_status:'Pending'},snapshot()),null)
  assert.equal(orders.confirmedOrderRecords({...verified(),payment_status:'Failed'},snapshot()),null)
})
test('reject mismatched items, prices, incomplete customer data and unexplained totals',()=>{
  for(const mutate of [o=>o.cart_data.items[0].quantity=2,o=>o.subtotal_price=1,o=>o.total_amount_payable=1,o=>o.shipping_address=null]){
    const o=verified();mutate(o);assert.throws(()=>orders.confirmedOrderRecords(o,snapshot()))
  }
  const o=verified();o.total_discount=50;o.total_amount_payable=449
  assert.equal(orders.confirmedOrderRecords(o,snapshot()).order.discount_paise,5000)
})
test('status endpoint rejects forged success query and missing guest cookie before contacting provider',async()=>{
  let fetched=false
  const {POST}=load('src/app/api/fastrr/status/route.ts',{'next/headers':{cookies:async()=>({get:()=>undefined})},'@/lib/fastrr/checkout':{...checkout,checkoutConfig:()=>config},'@/lib/fastrr/provider':load('src/lib/fastrr/provider.ts'),'@/lib/fastrr/orders':{syncFastrrOrder:async()=>{fetched=true}},'@/lib/fastrr/session':load('src/lib/fastrr/session.ts')})
  const res=await POST(new Request(origin+'/api/fastrr/status?ost=SUCCESS',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify({orderId:oid})}))
  assert.equal(res.status,403);assert.equal(fetched,false)
})

test('order sync retries partial writes safely, is idempotent, and preserves later refunds',async()=>{
  const tables={orders:new Map(),order_items:new Map(),payments:new Map()};let failLines=true
  const db={storage:{from:()=>({download:async()=>({data:new Blob([JSON.stringify(snapshot())]),error:null})})},from:table=>{
    let operation,values,options,filters=[]
    const query={upsert(v,o){operation='upsert';values=v;options=o;return query},update(v){operation='update';values=v;return query},eq(k,v){filters.push([k,v]);return query},then(resolve,reject){return Promise.resolve().then(()=>{
      if(table==='order_items'&&failLines){failLines=false;return{error:{message:'simulated transient failure'}}}
      if(operation==='upsert')for(const row of Array.isArray(values)?values:[values]){if(!tables[table].has(row.id)||!options.ignoreDuplicates)tables[table].set(row.id,structuredClone(row))}
      if(operation==='update')for(const row of tables[table].values()){if(filters.every(([k,v])=>row[k]===v))Object.assign(row,values)}
      return{error:null}
    }).then(resolve,reject)}};return query
  }}
  const oldUrl=process.env.NEXT_PUBLIC_SUPABASE_URL,oldKey=process.env.SUPABASE_SERVICE_ROLE_KEY
  process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='test'
  try{
    const lib=load('src/lib/fastrr/orders.ts',{'@supabase/supabase-js':{createClient:()=>db},'./provider':{fetchProviderOrder:async()=>verified()}})
    await assert.rejects(()=>lib.syncFastrrOrder(oid))
    assert.equal([...tables.orders.values()][0].status,'pending')
    const result=await lib.syncFastrrOrder(oid)
    assert.equal(result.state,'confirmed')
    await lib.syncFastrrOrder(oid)
    assert.deepEqual(Object.values(tables).map(t=>t.size),[1,1,1])
    const saved=[...tables.orders.values()][0];saved.status='refunded';saved.payment_status='refunded'
    const payment=[...tables.payments.values()][0];payment.status='refunded'
    await lib.syncFastrrOrder(oid)
    assert.equal(saved.status,'refunded');assert.equal(saved.payment_status,'refunded');assert.equal(payment.status,'refunded')
  }finally{
    if(oldUrl===undefined)delete process.env.NEXT_PUBLIC_SUPABASE_URL;else process.env.NEXT_PUBLIC_SUPABASE_URL=oldUrl
    if(oldKey===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=oldKey
  }
})
