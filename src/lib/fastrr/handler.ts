import { createClient } from '@supabase/supabase-js'
import { buildCatalog, catalogResponse, CatalogRequestError, parseCatalogQuery, type CatalogRows } from './catalog'

async function loadCatalog(): Promise<CatalogRows> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Catalog database is not configured')
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  // Fetch complete tables in deterministic batches; do not silently truncate at Supabase's row limit.
  const read = async <T>(table: string, columns: string): Promise<T[]> => {
    const rows: T[] = []
    for (let start = 0; ; start += 500) {
      const { data, error } = await client.from(table).select(columns).order('id').range(start, start + 499)
      if (error) throw new Error(`Catalog read failed: ${table}`)
      rows.push(...(data as unknown as T[]))
      if (data.length < 500) return rows
    }
  }
  const [products, variants, categories, media, inventory] = await Promise.all([
    read<CatalogRows['products'][number]>('products', 'id,name,slug,family,category_id,description,short_description,status,created_at,updated_at'),
    read<CatalogRows['variants'][number]>('product_variants', 'id,product_id,name,sku,price_paise,compare_at_price_paise,weight_grams,is_default,is_active,created_at,updated_at'),
    read<CatalogRows['categories'][number]>('product_categories', 'id,name,slug,description,created_at,updated_at'),
    read<CatalogRows['media'][number]>('product_media', 'product_id,variant_id,type,url,is_hero,sort_order'),
    read<CatalogRows['inventory'][number]>('inventory', 'variant_id,quantity,reserved_quantity'),
  ])
  return { products, variants, categories, media, inventory }
}

export async function handleCatalog(request: Request, kind: 'products' | 'collections', requireCollection = false) {
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  try {
    const query = parseCatalogQuery(new URL(request.url).searchParams, requireCollection)
    const origin = process.env.FASTRR_PUBLIC_SITE_URL || 'https://www.mrgrimeguru.com'
    const catalog = buildCatalog(await loadCatalog(), origin)
    return Response.json(catalogResponse(catalog, kind, query), { headers })
  } catch (error) {
    if (error instanceof CatalogRequestError) return Response.json({ error: error.message }, { status: error.status, headers })
    console.error('[Fastrr catalog]', error instanceof Error ? error.message : 'Unknown error')
    // Never publish fallback products, fabricated inventory, or database credentials.
    return Response.json({ error: 'Catalog temporarily unavailable. Please retry.' }, { status: 503, headers: { ...headers, 'Retry-After': '60' } })
  }
}
