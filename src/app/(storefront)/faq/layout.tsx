import { pageMetadata, breadcrumbs } from '@/lib/seo'
import { JsonLd } from '@/components/storefront/JsonLd'
export const metadata = pageMetadata('Frequently Asked Questions', 'Answers about Mr GrimeGuru products, surface compatibility, orders, payments, shipping and 7-day return requests.', '/faq')
export default function Layout({ children }: { children: React.ReactNode }) { return <><JsonLd data={breadcrumbs([{name:'Home',path:'/'},{name:'Frequently Asked Questions',path:'/faq'}])} />{children}</> }
