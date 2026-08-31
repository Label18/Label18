'use client'

import { useEffect, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { getCategoryReport, type CategoryReportRow } from './actions'

type Preset = 'today' | 'week' | 'month' | 'custom'

function presetRange(preset: Preset): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  if (preset === 'week') {
    start.setDate(start.getDate() - start.getDay())
  } else if (preset === 'month') {
    start.setDate(1)
  }
  return { start, end }
}

function toInputDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function ReportsClient() {
  const [preset, setPreset] = useState<Preset>('today')
  const [startDate, setStartDate] = useState(() => toInputDate(presetRange('today').start))
  const [endDate, setEndDate] = useState(() => toInputDate(presetRange('today').end))
  const [rows, setRows] = useState<CategoryReportRow[]>([])
  const [loaded, setLoaded] = useState(false)
  const [pending, startTransition] = useTransition()

  function applyPreset(p: Preset) {
    setPreset(p)
    if (p === 'custom') return
    const { start, end } = presetRange(p)
    setStartDate(toInputDate(start))
    setEndDate(toInputDate(end))
  }

  useEffect(() => {
    startTransition(async () => {
      const startISO = new Date(`${startDate}T00:00:00`).toISOString()
      const endISO = new Date(`${endDate}T23:59:59`).toISOString()
      const data = await getCategoryReport(startISO, endISO)
      setRows(data)
      setLoaded(true)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate])

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0)
  const totalItems = rows.reduce((s, r) => s + r.itemCount, 0)
  const maxRevenue = Math.max(1, ...rows.map((r) => r.revenue))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-black">Reports</h1>
        <p className="mt-1 text-sm text-stone-600">Orders and revenue by product category.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as Preset[]).map((p) => (
            <button
              key={p}
              onClick={() => applyPreset(p)}
              className={`rounded-lg px-3.5 py-2 text-sm font-semibold ${
                preset === p ? 'bg-black text-white' : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setPreset('custom')
              setStartDate(e.target.value)
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-black outline-none focus:border-black"
          />
          <span className="text-stone-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setPreset('custom')
              setEndDate(e.target.value)
            }}
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-black outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Total Revenue
          </p>
          <p className="mt-1 text-2xl font-bold text-black">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Categories Sold
          </p>
          <p className="mt-1 text-2xl font-bold text-black">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Items Sold
          </p>
          <p className="mt-1 text-2xl font-bold text-black">{totalItems}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500">
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Orders</th>
              <th className="px-6 py-3 font-semibold">Items Sold</th>
              <th className="px-6 py-3 font-semibold">Revenue</th>
              <th className="px-6 py-3 font-semibold w-1/3">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.categoryId ?? 'uncategorized'} className="border-t border-stone-100">
                <td className="px-6 py-3.5 font-medium text-black">{r.categoryName}</td>
                <td className="px-6 py-3.5 text-stone-600">{r.orderCount}</td>
                <td className="px-6 py-3.5 text-stone-600">{r.itemCount}</td>
                <td className="px-6 py-3.5 font-semibold text-black">
                  ₹{r.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-3.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {loaded && rows.length === 0 && !pending && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-stone-500">
                  No completed orders in this date range.
                </td>
              </tr>
            )}
            {pending && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Loader2 size={16} className="mx-auto animate-spin text-stone-400" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}