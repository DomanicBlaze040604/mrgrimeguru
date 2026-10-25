import '../storefront.css'
import { SiteHeader } from '@/components/storefront/SiteHeader'
import { SiteFooter } from '@/components/storefront/SiteFooter'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { FloatingProductVideo } from '@/components/storefront/FloatingProductVideo'


export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="guru-storefront min-h-screen flex flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <FloatingProductVideo />
      
    </div>
  )
}
