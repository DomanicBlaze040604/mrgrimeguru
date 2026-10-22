import type { Metadata } from 'next'
import { Package, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Inventory — Admin',
}

export default async function AdminInventoryPage() {
  const stockItems = [
    {
      sku: 'GG-POD-30',
      name: 'Laundry Pods 3-in-1 (30 pack)',
      warehouse: 'Bhiwandi Hub (MH)',
      quantity: 450,
      threshold: 50,
      status: 'healthy',
    },
    {
      sku: 'GG-BEAD-250',
      name: 'Laundry Scent Beads (250g)',
      warehouse: 'Gurugram Hub (HR)',
      quantity: 180,
      threshold: 30,
      status: 'healthy',
    },
    {
      sku: 'GG-FLR-1000',
      name: 'Botanical Floor Cleaner (1L)',
      warehouse: 'Bengaluru Hub (KA)',
      quantity: 25,
      threshold: 40,
      status: 'low',
    },
    {
      sku: 'GG-KTC-500',
      name: 'Kitchen Degreaser Spray (500ml)',
      warehouse: 'Bhiwandi Hub (MH)',
      quantity: 12,
      threshold: 30,
      status: 'critical',
    },
    {
      sku: 'GG-SHOE-200',
      name: 'Shoe Foam Cleaner (200ml)',
      warehouse: 'Gurugram Hub (HR)',
      quantity: 310,
      threshold: 50,
      status: 'healthy',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#24333A]">Warehouse & Stock Inventory</h1>
        <p className="text-sm text-[#75828A]">Real-time inventory levels across regional fulfillment hubs</p>
      </div>

      {/* Stock Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="text-xs text-[#75828A] font-semibold mb-1">Total Units in Stock</div>
          <div className="text-3xl font-bold text-[#24333A]">977 Units</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="text-xs text-amber-700 font-semibold mb-1">Low Stock SKUs</div>
          <div className="text-3xl font-bold text-amber-600">2 Items</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <div className="text-xs text-emerald-700 font-semibold mb-1">Stock Health Score</div>
          <div className="text-3xl font-bold text-emerald-600">94.2%</div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Product Formulation
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Fulfillment Hub
                </th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Available Qty
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-[#75828A] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockItems.map((item) => (
                <tr key={item.sku} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-xs text-[#24333A]">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#24333A]">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#52636a]">
                    {item.warehouse}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#24333A]">
                    {item.quantity} units
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      item.status === 'healthy' ? 'bg-emerald-50 text-emerald-700' :
                      item.status === 'low' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {item.status === 'healthy' ? 'Optimal Stock' : item.status === 'low' ? 'Low Stock' : 'Critical Restock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
