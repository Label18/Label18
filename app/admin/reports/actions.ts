'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type CategoryReportRow = {
  categoryId: string | null
  categoryName: string
  orderCount: number
  itemCount: number
  revenue: number
}
type Bucket = { name: string; orderIds: Set<string>; itemCount: number; revenue: number }
const buckets = new Map<string, Bucket>()
export async function getCategoryReport(
  startISO: string,
  endISO: string
): Promise<CategoryReportRow[]> {
  // 1. Completed orders in the date range
  const { data: orders, error: ordersError } = await supabase
    .from('pos_orders')
    .select('id')
    .gte('created_at', startISO)
    .lte('created_at', endISO)
    .eq('status', 'completed')

  if (ordersError) {
    console.error('getCategoryReport orders error:', ordersError.message)
    return []
  }

  const orderIds = (orders ?? []).map((o) => o.id)
  if (orderIds.length === 0) return []

  // 2. Line items for those orders, joined through product -> category
  const { data: items, error: itemsError } = await supabase
    .from('pos_order_items')
    .select(
      `
      pos_order_id, quantity, line_total,
      product:products ( id, category_id, category:categories ( id, name ) )
      `
    )
    .in('pos_order_id', orderIds)

  if (itemsError) {
    console.error('getCategoryReport items error:', itemsError.message)
    return []
  }

type Bucket = { name: string; orderIds: Set<string>; itemCount: number; revenue: number }
const buckets = new Map<string, Bucket>()

  for (const item of items ?? []) {
    const product = Array.isArray(item.product) ? item.product[0] : item.product
    const category = product?.category
      ? Array.isArray(product.category)
        ? product.category[0]
        : product.category
      : null

    const key = category?.id ?? 'uncategorized'
    const name = category?.name ?? 'Uncategorized'

    if (!buckets.has(key)) {
      buckets.set(key, { name, orderIds: new Set(), itemCount: 0, revenue: 0 })
    }
    const bucket = buckets.get(key)!
    bucket.orderIds.add(item.pos_order_id)
    bucket.itemCount += item.quantity
    bucket.revenue += Number(item.line_total)
  }

  return Array.from(buckets.entries())
    .map(([id, b]) => ({
      categoryId: id === 'uncategorized' ? null : id,
      categoryName: b.name,
      orderCount: b.orderIds.size,
      itemCount: b.itemCount,
      revenue: b.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
}