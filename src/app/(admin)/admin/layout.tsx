import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

const ADMIN_ROLES = ['owner', 'administrator', 'operations', 'content_editor', 'customer_support']

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    redirect('/?error=unauthorized')
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
      <AdminSidebar userRole={profile.role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={{ ...profile, id: user.id }} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
