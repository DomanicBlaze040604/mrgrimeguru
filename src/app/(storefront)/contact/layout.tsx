import { pageMetadata, breadcrumbs } from '@/lib/seo'
import { JsonLd } from '@/components/storefront/JsonLd'
export const metadata = pageMetadata('Contact & Customer Support', 'Contact Mr GrimeGuru at +91 87798 17007 or support@mrgrimeguru.com. Find our Mumbai address and WhatsApp support.', '/contact')
export default function Layout({ children }: { children: React.ReactNode }) { return <><JsonLd data={breadcrumbs([{name:'Home',path:'/'},{name:'Contact & Customer Support',path:'/contact'}])} />{children}</> }
