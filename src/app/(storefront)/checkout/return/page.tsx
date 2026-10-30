import { CheckoutResult } from '@/components/storefront/CheckoutResult'
export const metadata = { title: 'Your order — Mr GrimeGuru', robots: { index: false, follow: false } }
export default async function CheckoutReturnPage({ searchParams }: { searchParams: Promise<{ oid?: string }> }) {
  const { oid } = await searchParams
  return <CheckoutResult orderId={typeof oid === 'string' ? oid : ''} />
}
