import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Ticket,
} from 'lucide-react'
import Sidebar from '../components/Sidebar' // adjust import path to wherever Sidebar.tsx lives

type Stat = {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down'
  icon: React.ReactNode
}

const STATS: Stat[] = [
  { label: 'Revenue (30d)', value: '₹8,42,600', delta: '+12.4%', trend: 'up', icon: <IndianRupee size={18} strokeWidth={1.75} /> },
  { label: 'Orders', value: '386', delta: '+6.1%', trend: 'up', icon: <ShoppingBag size={18} strokeWidth={1.75} /> },
  { label: 'Products Live', value: '214', delta: '-1.2%', trend: 'down', icon: <Package size={18} strokeWidth={1.75} /> },
  { label: 'New Customers', value: '57', delta: '+18.9%', trend: 'up', icon: <Users size={18} strokeWidth={1.75} /> },
]

type Order = {
  id: string
  customer: string
  item: string
  amount: string
  status: 'Paid' | 'Pending' | 'Refunded'
  date: string
}

const ORDERS: Order[] = [
  { id: '#TL18-2291', customer: 'Ananya Rao', item: 'Signature Tote — Black', amount: '₹18,500', status: 'Paid', date: 'Today, 11:42 AM' },
  { id: '#TL18-2290', customer: 'Karan Mehta', item: 'Leather Weekender', amount: '₹32,000', status: 'Pending', date: 'Today, 10:05 AM' },
  { id: '#TL18-2289', customer: 'Sara Iqbal', item: 'Mini Crossbody — Tan', amount: '₹11,200', status: 'Paid', date: 'Yesterday, 6:20 PM' },
  { id: '#TL18-2288', customer: 'Ritvik Shah', item: 'Card Holder — Gold Clasp', amount: '₹4,800', status: 'Refunded', date: 'Yesterday, 2:14 PM' },
  { id: '#TL18-2287', customer: 'Meera Nair', item: 'Signature Tote — Burgundy', amount: '₹18,500', status: 'Paid', date: '2 days ago' },
]

function statusStyles(status: Order['status']) {
  switch (status) {
    case 'Paid':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'Pending':
      return 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/25'
    case 'Refunded':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  }
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#F5F2EB]">
      <Sidebar />

      <main className="ml-72 px-10 py-10">
        {/* Header */}
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]/70">
              Overview
            </p>
            <h1 className="mt-1.5 text-[28px] font-light tracking-tight text-white">
              Good morning, Admin
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Here&apos;s what&apos;s happening across The Label 18 today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white">
              <Ticket size={15} strokeWidth={1.75} />
              New Coupon
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A059] px-4 py-2.5 text-sm font-semibold text-[#030303] transition-all hover:brightness-110 active:scale-[0.99]">
              <Plus size={15} strokeWidth={2} />
              Add Product
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]">
                  {stat.icon}
                </span>
                <span
                  className={[
                    'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
                    stat.trend === 'up'
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-rose-500/20 bg-rose-500/10 text-rose-400',
                  ].join(' ')}
                >
                  {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.delta}
                </span>
              </div>
              <p className="mt-4 text-2xl font-light tracking-tight text-white">{stat.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="mt-9 rounded-2xl border border-white/10 bg-[#0A0A0A]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="text-base font-medium text-white">Recent Orders</h2>
              <p className="mt-0.5 text-xs text-white/40">Latest transactions across the store</p>
            </div>
            <a
              href="/admin/orders"
              className="text-xs font-medium uppercase tracking-wider text-[#D4AF37] transition-colors hover:text-[#E6D5B8]"
            >
              View all
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-white/35">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Item</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-white/60">{order.id}</td>
                    <td className="px-6 py-4 text-white/90">{order.customer}</td>
                    <td className="px-6 py-4 text-white/60">{order.item}</td>
                    <td className="px-6 py-4 text-white/90">{order.amount}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusStyles(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/40">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}