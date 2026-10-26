import { handleCatalog } from '@/lib/fastrr/handler'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  return handleCatalog(request, 'collections')
}
