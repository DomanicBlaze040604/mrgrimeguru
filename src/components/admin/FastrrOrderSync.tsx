'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
export function FastrrOrderSync() {
  const router = useRouter()
  const busy = useRef(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const sync = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setLoading(true)
    let synced = 0
    let failed = 0
    try {
      for (let page = 0; ; page++) {
        const response = await fetch(`/api/admin/fastrr/sync?page=${page}`, { method: 'POST' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to sync Fastrr orders.')
        synced += data.synced
        failed += data.failed
        if (!data.more) break
        setMessage(`Checked ${synced} orders…`)
      }
      setMessage(failed ? `${synced} orders synced; ${failed} need another attempt. Please retry or check Fastrr.` : 'Up to date with Fastrr. Checked confirmed orders from the last 90 days.')
      router.refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sync unavailable. Please retry.') }
    finally { busy.current = false; setLoading(false) }
  }, [router])
  useEffect(() => { const timer = setTimeout(() => void sync(), 0); return () => clearTimeout(timer) }, [sync])
  return <div className="rounded-xl bg-white border border-gray-200 p-4 flex flex-wrap items-center gap-3 text-sm"><button disabled={loading} onClick={() => void sync()} className="rounded-lg bg-[#166534] text-white px-4 py-2 font-semibold disabled:opacity-50">{loading ? 'Checking Fastrr…' : 'Sync Fastrr orders'}</button><p role="status" className="text-gray-600">{message || 'Pull customer and payment details directly from Fastrr.'}</p></div>
}
