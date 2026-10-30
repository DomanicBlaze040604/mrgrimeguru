import { redirect } from 'next/navigation'

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ oid?: string }> }) {
  const { oid } = await searchParams
  // Legacy query parameters cannot prove a payment or create an order reference.
  redirect(typeof oid === 'string' && /^[a-f0-9]{24}$/.test(oid) ? `/checkout/return?oid=${oid}` : '/account/orders')
}
