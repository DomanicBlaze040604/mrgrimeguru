import { createClient } from '@/lib/supabase/server'
import { fetchProviderOrderList } from '@/lib/fastrr/provider'
import { syncFastrrOrder } from '@/lib/fastrr/orders'

export const runtime = 'nodejs'
export const maxDuration = 60
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' }
  if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Forbidden' }, { status: 403, headers })
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) return Response.json({ error: 'Sign in as an administrator.' }, { status: 401, headers })
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['owner', 'administrator', 'operations', 'customer_support'].includes(profile.role)) return Response.json({ error: 'Forbidden' }, { status: 403, headers })
  try {
    const page = Number(new URL(request.url).searchParams.get('page') ?? 0)
    if (!Number.isSafeInteger(page) || page < 0 || page > 10000) return Response.json({ error: 'Invalid page' }, { status: 400, headers })
    const list = await fetchProviderOrderList(page)
    let synced = 0
    let failed = 0
    for (let index = 0; index < list.data.length; index += 2) {
      const results = await Promise.allSettled(list.data.slice(index, index + 2).map(order => syncFastrrOrder(order.id)))
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.state === 'confirmed') synced++
        else failed++
      }
    }
    return Response.json({ synced, failed, more: (page + 1) * 10 < list.total }, { headers })
  } catch {
    return Response.json({ error: 'Fastrr sync is unavailable. Existing orders are still shown. Please retry.' }, { status: 503, headers })
  }
}
