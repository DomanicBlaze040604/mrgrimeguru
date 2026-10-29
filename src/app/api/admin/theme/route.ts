import { createClient } from '@/lib/supabase/server'
import { THEMES } from '@/lib/themes'

export const runtime = 'nodejs'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['active_theme', 'theme_banner'])

    const settings = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
    const themeId = (settings['active_theme'] as string) ?? 'default'
    const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0]

    return Response.json({ themeId, theme })
  } catch {
    return Response.json({ themeId: 'default', theme: THEMES[0] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const themeId = typeof body?.themeId === 'string' ? body.themeId : 'default'
    if (!THEMES.find(t => t.id === themeId)) {
      return Response.json({ error: 'Unknown theme' }, { status: 400 })
    }

    const supabase = await createClient()
    await supabase.from('site_settings').upsert(
      { key: 'active_theme', value: JSON.stringify(themeId), updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

    const theme = THEMES.find(t => t.id === themeId)!
    return Response.json({ ok: true, themeId, theme })
  } catch {
    return Response.json({ error: 'Failed to save theme' }, { status: 500 })
  }
}

