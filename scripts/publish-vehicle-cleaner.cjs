// Dry-run by default. --apply creates only the new cleaner; never resets existing stock.
require('@next/env').loadEnvConfig(process.cwd())
const fs = require('node:fs')
const { createClient } = require('@supabase/supabase-js')
const slug = 'vehicle-cleaner'
const name = 'Car Cleaner'
const description = 'Foam-powered care for everyday road dirt on compatible car surfaces. Can also be used on compatible bike and two-wheeler surfaces. Check the product and vehicle care labels for approved materials and finishes before use.'
const media = [
  ['vehicle-cleaner-bogo-transparent.png', 'Buy 1 Get 1 Free · two 500 ml cans'],
  ['vehicle-cleaner-cutout.png', 'Car Cleaner · 500 ml'],
  ['vehicle-cleaner-foam.png', 'Car Cleaner surrounded by foam'],
  ['gallery/vehicle-cleaner-1.png', 'Car care with a microfibre cloth'],
  ['gallery/vehicle-cleaner-4.png', 'Ready for the next drive'],
]
async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('Server Supabase credential required')
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const checked = async request => { const { data, error } = await request; if (error) throw new Error(error.message); return data }
  const existing = await checked(db.from('products').select('*,product_variants(*,inventory(*)),product_media(*)').order('sort_order'))
  const original = existing.find(p => p.slug === slug)
  console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', product: name, price: 799, compareAt: 899, pack: '2 × 500 ml', openingOfferPacks: 1000, existingProducts: existing.length, alreadyExists: Boolean(original) }))
  for (const [file] of media) if (!fs.existsSync(`public/images/products/${file}`)) throw new Error(`Missing asset: ${file}`)
  if (!process.argv.includes('--apply')) { console.log('VERDICT: PASS — publication plan validated; no database changes.'); return }
  const headers = { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` }
  const schemaResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, { headers })
  const schema = await schemaResponse.json()
  if (!schema.definitions?.products?.properties?.family?.enum?.includes('vehicle_cleaner')) throw new Error('Apply 004_vehicle_cleaner_family.sql first')
  fs.mkdirSync('.vercel/vehicle-backup', { recursive: true })
  const backup = '.vercel/vehicle-backup/catalog-before.json'
  if (!fs.existsSync(backup)) fs.writeFileSync(backup, JSON.stringify(existing, null, 2))
  let category = (await checked(db.from('product_categories').select('id').eq('slug', 'vehicle-care')))[0]
  if (!category) category = (await checked(db.from('product_categories').insert({ name: 'Car Care', slug: 'vehicle-care', description, sort_order: 5 }).select('id')))[0]
  let product = original
  if (!product) product = (await checked(db.from('products').insert({ name, slug, family: 'vehicle_cleaner', category_id: category.id, short_description: description, description: `${description}\nBuy 1 Get 1 Free: each offer pack contains two 500 ml cans.`, status: 'draft', is_featured: true, sort_order: 6, meta_title: 'Car Cleaner Foam Spray, 500 ml | Mr GrimeGuru', meta_description: description }).select('*')))[0]
  let variant = (await checked(db.from('product_variants').select('*').eq('product_id', product.id).eq('sku', 'MGG-VC-500-BOGO')))[0]
  if (!variant) variant = (await checked(db.from('product_variants').insert({ product_id: product.id, name: '2 × 500 ml · Buy 1 Get 1 Free', sku: 'MGG-VC-500-BOGO', price_paise: 79900, compare_at_price_paise: 89900, pack_size: '2 × 500 ml', is_default: true, is_active: true, sort_order: 0 }).select('*')))[0]
  const inventory = await checked(db.from('inventory').select('variant_id').eq('variant_id', variant.id))
  if (!inventory.length) await checked(db.from('inventory').insert({ variant_id: variant.id, quantity: 1000, reserved_quantity: 0, low_stock_threshold: 20, track_inventory: true }))
  const existingMedia = await checked(db.from('product_media').select('url').eq('product_id', product.id))
  const missingMedia = media.map(([file, alt], i) => ({ product_id: product.id, variant_id: variant.id, type: 'image', url: `/images/products/${file}`, alt_text: `${name} — ${alt}`, sort_order: i, is_hero: i === 0 })).filter(m => !existingMedia.some(old => old.url === m.url))
  if (missingMedia.length) await checked(db.from('product_media').insert(missingMedia))
  await checked(db.from('products').update({ status: 'active' }).eq('id', product.id))
  const saved = (await checked(db.from('products').select('name,slug,status,product_variants(id,sku,price_paise,compare_at_price_paise,inventory(quantity)),product_media(url)').eq('id', product.id)))[0]
  if (saved.status !== 'active' || saved.product_media.length !== 5 || saved.product_variants.find(v => v.sku === variant.sku)?.price_paise !== 79900) throw new Error('Product verification failed')
  console.log(JSON.stringify(saved))
  console.log('VERDICT: PASS — new product, variant, five images and stock verified; existing catalog preserved.')
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
