import { SiteHeader } from '@/components/storefront/SiteHeader'
import { SiteFooter } from '@/components/storefront/SiteFooter'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartInfoPanel } from '@/components/cart/CartInfoPanel'
import { ChatLauncher } from '@/components/chat/ChatLauncher'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <CartInfoPanel />
      <ChatLauncher />
    </div>
  )
}
