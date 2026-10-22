import type { Metadata } from 'next'
import { Settings, ShieldCheck, CheckCircle2, Key, Bell, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Settings — Admin',
}

export default function AdminSettingsPage() {
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const hasGroq = Boolean(process.env.GROQ_API_KEY)
  const hasRazorpay = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#24333A]">Store & Integration Settings</h1>
        <p className="text-sm text-[#75828A]">Configure store preferences, free shipping thresholds, and API services</p>
      </div>

      {/* Integration Statuses Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#24333A] flex items-center gap-2">
          <Key className="w-5 h-5 text-[#347F99]" /> Connected Integrations & Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <div className="text-xs text-[#75828A] font-semibold mb-1">Supabase Database</div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {hasSupabase ? 'Connected (pkaxwlyijkafokxxbbap)' : 'Demo Fallback'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <div className="text-xs text-[#75828A] font-semibold mb-1">Groq Mascot AI</div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#347F99]">
              <CheckCircle2 className="w-4 h-4 text-[#347F99]" />
              {hasGroq ? 'Live Llama 3.1' : 'Built-in Knowledge Engine'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#D6E8ED]">
            <div className="text-xs text-[#75828A] font-semibold mb-1">Razorpay Payments</div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-purple-700">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              {hasRazorpay ? 'Live Gateway' : 'Ready (Dev / COD Mode)'}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping & Thresholds Form */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#24333A] flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#347F99]" /> Shipping Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-1">
              Free Shipping Threshold (INR)
            </label>
            <input
              type="number"
              defaultValue={499}
              className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl font-bold text-[#24333A]"
            />
            <p className="text-xs text-[#75828A] mt-1">Orders at or above this value get automatic free shipping.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24333A] mb-1">
              Standard Shipping Charge (INR)
            </label>
            <input
              type="number"
              defaultValue={49}
              className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl font-bold text-[#24333A]"
            />
            <p className="text-xs text-[#75828A] mt-1">Applied to orders below the free threshold.</p>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#24333A]">Store Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-xs text-[#75828A]">Support Email</span>
            <span className="font-semibold text-[#24333A]">hello@mrgrimeguru.com</span>
          </div>
          <div>
            <span className="block text-xs text-[#75828A]">Helpline Phone</span>
            <span className="font-semibold text-[#24333A]">+91 98765 43210</span>
          </div>
          <div>
            <span className="block text-xs text-[#75828A]">Brand Currency</span>
            <span className="font-semibold text-[#24333A]">Indian Rupee (INR ₹)</span>
          </div>
          <div>
            <span className="block text-xs text-[#75828A]">Headquarters</span>
            <span className="font-semibold text-[#24333A]">Bandra BKC, Mumbai 400051</span>
          </div>
        </div>
      </div>
    </div>
  )
}
