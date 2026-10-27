import { createHash } from 'node:crypto'
import { getCleanerOffer } from '../cleaner-offers'

export interface ProductRow {
  id: string; name: string; slug: string; family: string; category_id: string | null;
  description: string; short_description: string; status: string; created_at: string; updated_at: string;
}
export interface VariantRow {
  id: string; product_id: string; name: string; sku: string; price_paise: number;
  compare_at_price_paise: number | null; weight_grams: number | null;
  is_default: boolean; is_active: boolean; created_at: string; updated_at: string;
}
export interface CategoryRow {
  id: string; name: string; slug: string; description: string | null; created_at: string; updated_at: string;
}
export interface MediaRow { product_id: string; variant_id: string | null; type: string; url: string; is_hero: boolean; sort_order: number }
export interface InventoryRow { variant_id: string; quantity: number; reserved_quantity: number }
export interface CatalogRows {
  products: ProductRow[]; variants: VariantRow[]; categories: CategoryRow[]; media: MediaRow[]; inventory: InventoryRow[];
}

// Stable positive 52-bit integers fit both JSON's safe range and a signed long.
// The namespace and algorithm are part of the external integration contract.
export function catalogId(kind: 'product' | 'variant' | 'collection', uuid: string): number {
  return Number.parseInt(createHash('sha256').update(`mrgrimeguru:fastrr:v1:${kind}:${uuid}`).digest('hex').slice(0, 13), 16) + 1
}

function money(paise: number): string {
  if (!Number.isSafeInteger(paise) || paise < 0) throw new Error('Invalid catalog price')
  return (paise / 100).toFixed(2)
}

function html(text: string): string {
  return `<p>${text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!).replace(/\n/g, '<br>')}</p>`
}

function absoluteImage(path: string, origin: string): string {
  const url = new URL(path, origin)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid catalog image URL')
  return url.href
}

export function buildCatalog(rows: CatalogRows, origin: string) {
  const ids = new Set<number>()
  const uniqueId = (kind: 'product' | 'variant' | 'collection', uuid: string) => {
    const id = catalogId(kind, uuid)
    if (ids.has(id)) throw new Error('Duplicate external catalog ID')
    ids.add(id)
    return id
  }
  const inventory = new Map(rows.inventory.map(row => [row.variant_id, row]))
  const products = rows.products
    .filter(product => product.status === 'active' && !['laundry-pods', 'laundry-beads'].includes(product.slug) && !['laundry_pods', 'laundry_beads'].includes(product.family))
    .filter(product => rows.variants.some(variant => variant.product_id === product.id && variant.is_active))
    .map(product => {
      const offer = getCleanerOffer(product.slug)
      const handle = offer?.slug ?? product.slug
      const media = rows.media.filter(item => item.product_id === product.id && item.type === 'image')
        .sort((a, b) => Number(b.is_hero) - Number(a.is_hero) || a.sort_order - b.sort_order)
      const image = { src: absoluteImage(offer ? `/images/products/${handle}-cutout.png` : media[0]?.url ?? `/images/products/${handle}.jpg`, origin) }
      const variants = rows.variants.filter(variant => variant.product_id === product.id && variant.is_active).map(variant => {
        const stock = inventory.get(variant.id)
        const available = stock ? Math.max(0, stock.quantity - stock.reserved_quantity) : 0
        if (!Number.isSafeInteger(available)) throw new Error('Invalid catalog inventory')
        const usesOffer = offer && variant.is_default
        const title = usesOffer ? '500 ml' : variant.name
        const compareAt = usesOffer ? offer.original : variant.compare_at_price_paise
        const variantImage = media.find(item => item.variant_id === variant.id)
        return {
          id: uniqueId('variant', variant.id), title,
          price: money(usesOffer ? offer.price : variant.price_paise),
          compare_at_price: compareAt == null ? null : money(compareAt),
          sku: variant.sku, quantity: available, created_at: variant.created_at, updated_at: variant.updated_at,
          taxable: true, option_values: { Title: title },
          ...(variant.weight_grams == null ? {} : { grams: variant.weight_grams, weight: variant.weight_grams, weight_unit: 'g' }),
          image: offer || !variantImage ? image : { src: absoluteImage(variantImage.url, origin) },
        }
      })
      return {
        categoryId: product.category_id,
        value: {
          id: uniqueId('product', product.id), title: offer?.name ?? product.name,
          body_html: html(offer?.description ?? (product.description || product.short_description)),
          vendor: 'Mr GrimeGuru', product_type: offer?.name ?? rows.categories.find(category => category.id === product.category_id)?.name ?? product.family,
          created_at: product.created_at, handle, updated_at: product.updated_at,
          tags: offer?.family ?? product.family, status: 'active', variants, image,
          options: [{ name: 'Title', values: [...new Set(variants.map(variant => variant.title))] }],
        },
      }
    })
  const collections = rows.categories.filter(category => products.some(product => product.categoryId === category.id)).map(category => {
    const first = products.find(product => product.categoryId === category.id)!.value
    const title = category.slug === 'floor-care' ? 'Multipurpose Cleaning' : category.name
    return { databaseId: category.id, value: {
      id: uniqueId('collection', category.id), title, handle: category.slug,
      body_html: html(category.slug === 'floor-care' ? 'Find your Guru for everyday household messes.' : category.description ?? title),
      created_at: category.created_at, updated_at: category.updated_at, image: first.image,
    } }
  })
  return { products, collections }
}

export class CatalogRequestError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}

export function parseCatalogQuery(params: URLSearchParams, requireCollection = false) {
  const integer = (name: string, fallback?: number) => {
    const raw = params.get(name)
    if (raw === null && fallback !== undefined) return fallback
    if (params.getAll(name).length > 1 || !raw || !/^[1-9]\d*$/.test(raw) || !Number.isSafeInteger(Number(raw))) {
      throw new CatalogRequestError(`${name} must be a positive integer`)
    }
    return Number(raw)
  }
  const page = integer('page', 1)
  const limit = integer('limit', 100)
  if (limit > 100) throw new CatalogRequestError('limit must be between 1 and 100')
  if (!Number.isSafeInteger((page - 1) * limit)) throw new CatalogRequestError('page is too large')
  const collectionId = requireCollection || params.has('collection_id') ? integer('collection_id') : undefined
  return { page, limit, collectionId }
}

export function catalogResponse(catalog: ReturnType<typeof buildCatalog>, kind: 'products' | 'collections', query: ReturnType<typeof parseCatalogQuery>) {
  const { page, limit, collectionId } = query
  const start = (page - 1) * limit
  if (kind === 'collections') {
    const collections = catalog.collections.map(item => item.value)
    return { data: { total: collections.length, collections: collections.slice(start, start + limit) } }
  }
  const collection = collectionId === undefined ? undefined : catalog.collections.find(item => item.value.id === collectionId)
  if (collectionId !== undefined && !collection) throw new CatalogRequestError('Collection not found', 404)
  const products = catalog.products.filter(item => !collection || item.categoryId === collection.databaseId).map(item => item.value)
  return { data: { total: products.length, products: products.slice(start, start + limit) } }
}
