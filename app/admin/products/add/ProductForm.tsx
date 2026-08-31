'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  Plus,
  Trash2,
  ImageOff,
  X,
  RotateCcw,
  Info,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { createProduct } from './actions'

type Category = { id: string; name: string }
type SubCategory = { id: string; name: string; category_id: string }
type SubSubCategory = { id: string; name: string; sub_category_id: string }

type Variation = {
  key: string
  size: string
  color: string
  color_hex: string
  stock: string
  price: string
  compare_at_price: string
  image: File | null
}

function emptyVariation(): Variation {
  return {
    key: crypto.randomUUID(),
    size: '',
    color: '',
    color_hex: '',
    stock: '0',
    price: '',
    compare_at_price: '',
    image: null,
  }
}

// ---- SKU auto-numbering helpers ----------------------------------------
// Counters are kept in localStorage, one per label, so numbering continues
// from wherever it last left off for that label (e.g. "TL18-BAG" -> 0007
// next time even after a page refresh). Swap this for a server-driven
// counter (e.g. a DB sequence per label) if you want it shared across users.

const SKU_COUNTER_PREFIX = 'sku_counter:'

function normalizeLabel(label: string) {
  return label.trim().toUpperCase().replace(/\s+/g, '-')
}

function getNextSkuNumber(label: string): number {
  if (typeof window === 'undefined' || !label) return 1
  const key = SKU_COUNTER_PREFIX + label
  const raw = window.localStorage.getItem(key)
  const next = raw ? parseInt(raw, 10) + 1 : 1
  return Number.isFinite(next) ? next : 1
}

function commitSkuNumber(label: string, usedNumber: number) {
  if (typeof window === 'undefined' || !label) return
  const key = SKU_COUNTER_PREFIX + label
  window.localStorage.setItem(key, String(usedNumber))
}

function buildSku(label: string, num: number) {
  const padded = String(num).padStart(4, '0')
  return label ? `${label}-${padded}` : ''
}
// -------------------------------------------------------------------------

function ImagePicker({
  file,
  onChange,
  label,
}: {
  file: File | null
  onChange: (f: File | null) => void
  label: string
}) {
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-300">
            <ImageOff size={18} />
          </div>
        )}
      </div>
      <label className="cursor-pointer rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:border-black hover:text-black">
        {file ? 'Change image' : 'Upload image'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-stone-300 hover:text-rose-500"
          aria-label="Remove image"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default function ProductForm({
  categories,
  subCategories,
  subSubCategories,
}: {
  categories: Category[]
  subCategories: SubCategory[]
  subSubCategories: SubSubCategory[]
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [categoryId, setCategoryId] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [variations, setVariations] = useState<Variation[]>([emptyVariation()])

  // Label the user types (e.g. "TL18-BAG") drives the auto-generated SKU.
  const [skuLabel, setSkuLabel] = useState('')
  const [skuNumber, setSkuNumber] = useState<number>(1)

  const normalizedLabel = normalizeLabel(skuLabel)
  const generatedSku = buildSku(normalizedLabel, skuNumber)

  // Whenever the label changes, look up (or start) that label's next number.
  useEffect(() => {
    setSkuNumber(getNextSkuNumber(normalizedLabel))
  }, [normalizedLabel])

  const filteredSubCategories = useMemo(
    () => subCategories.filter((s) => s.category_id === categoryId),
    [subCategories, categoryId]
  )
  const filteredSubSubCategories = useMemo(
    () => subSubCategories.filter((s) => s.sub_category_id === subCategoryId),
    [subSubCategories, subCategoryId]
  )

  function updateVariation(key: string, patch: Partial<Variation>) {
    setVariations((prev) => prev.map((v) => (v.key === key ? { ...v, ...patch } : v)))
  }

  function removeVariation(key: string) {
    setVariations((prev) => prev.filter((v) => v.key !== key))
  }

  function resetAll() {
    setVariations([emptyVariation()])
    setMainImage(null)
    setCategoryId('')
    setSubCategoryId('')
    setSkuLabel('')
    setError(null)
    setSuccess(false)
    ;(document.getElementById('add-product-form') as HTMLFormElement)?.reset()
  }

  function handleSubmit(formData: FormData) {
    setError(null)
    setSuccess(false)

    if (!normalizedLabel) {
      setError('Enter a label to generate the SKU.')
      return
    }

    if (mainImage) formData.set('image', mainImage)

    // Submit the auto-generated SKU (input is read-only, so set it explicitly).
    formData.set('sku', generatedSku)
    formData.set('sku_label', normalizedLabel)

    formData.set('variation_count', String(variations.length))
    variations.forEach((v, i) => {
      formData.set(`variations[${i}][size]`, v.size)
      formData.set(`variations[${i}][color]`, v.color)
      formData.set(`variations[${i}][color_hex]`, v.color_hex)
      formData.set(`variations[${i}][stock]`, v.stock)
      formData.set(`variations[${i}][price]`, v.price)
      formData.set(`variations[${i}][compare_at_price]`, v.compare_at_price)
      if (v.image) formData.set(`variations[${i}][image]`, v.image)
    })

    startTransition(async () => {
      try {
        await createProduct(formData)
        // Only persist the counter once the save actually succeeds, so a
        // failed submit doesn't burn a SKU number.
        commitSkuNumber(normalizedLabel, skuNumber)

        setSuccess(true)
        setVariations([emptyVariation()])
        setMainImage(null)
        setCategoryId('')
        setSubCategoryId('')
        // Keep the same label, but move straight to the next number so the
        // next product for this label is ready to go.
        setSkuNumber(skuNumber + 1)
        ;(document.getElementById('add-product-form') as HTMLFormElement)?.reset()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    })
  }

  const inputClass =
    'w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition-colors focus:border-black'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-stone-500'

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-6 py-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Add Product</h1>
          <p className="mt-1 text-sm font-medium text-stone-600">
            {variations.length} variation{variations.length === 1 ? '' : 's'} · assign a category and add size/color options
          </p>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-black hover:text-black active:scale-[0.99]"
        >
          <RotateCcw size={15} strokeWidth={2} />
          Clear Form
        </button>
      </div>

      <form id="add-product-form" action={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
              <Info size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black">Product Details</h2>
              <p className="text-xs text-stone-400">Core info shown across the storefront</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelClass}>Label</label>
              <input
                value={skuLabel}
                onChange={(e) => setSkuLabel(e.target.value)}
                required
                placeholder="TL18-BAG"
                className={inputClass}
              />
              <p className="text-[11px] text-stone-400">
                A short prefix — the SKU number continues from wherever this label last left off.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>SKU Number (auto-generated)</label>
              <input
                name="sku"
                value={generatedSku}
                readOnly
                placeholder="Enter a label first"
                className={`${inputClass} cursor-not-allowed bg-stone-50 text-stone-500`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelClass}>Product Name</label>
              <input name="name" required placeholder="Signature Tote" className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <select
                name="category_id"
                required
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value)
                  setSubCategoryId('')
                }}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Sub Category</label>
              <select
                name="sub_category_id"
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                disabled={!categoryId}
                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <option value="">
                  {categoryId ? 'Select sub category (optional)' : 'Choose a category first'}
                </option>
                {filteredSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelClass}>Sub Sub Category</label>
              <select
                name="sub_sub_category_id"
                disabled={!subCategoryId}
                className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-xs`}
              >
                <option value="">
                  {subCategoryId ? 'Select sub sub category (optional)' : 'Choose a sub category first'}
                </option>
                {filteredSubSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                rows={4}
                placeholder="A short, storefront-facing description of the product…"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2 border-t border-stone-100 pt-5">
              <label className={labelClass}>Overall Product Image</label>
              <p className="mb-2 text-xs text-stone-400">
                The single main image for this product (used when no specific variation image applies).
              </p>
              <ImagePicker file={mainImage} onChange={setMainImage} label="Product image" />
            </div>
          </div>
        </div>

        {/* Variations */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
                <Layers size={15} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-black">Variations</h2>
                <p className="text-xs text-stone-400">
                  One row per size/color combo — each can have its own stock, price, and image
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVariations((prev) => [...prev, emptyVariation()])}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-stone-300 px-3.5 py-2.5 text-xs font-semibold text-stone-700 transition-colors hover:border-black hover:text-black"
            >
              <Plus size={14} />
              Add Variation
            </button>
          </div>

          <div className="space-y-4">
            {variations.map((v, i) => (
              <div
                key={v.key}
                className="rounded-xl border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-stone-300"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-md bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-stone-500 ring-1 ring-stone-200">
                    Variation {i + 1}
                  </span>
                  {variations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariation(v.key)}
                      className="text-stone-400 hover:text-rose-500"
                      aria-label="Remove variation"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">Size</label>
                    <input
                      value={v.size}
                      onChange={(e) => updateVariation(v.key, { size: e.target.value })}
                      placeholder="M"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">Color</label>
                    <input
                      value={v.color}
                      onChange={(e) => updateVariation(v.key, { color: e.target.value })}
                      placeholder="Black"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">Swatch</label>
                    <input
                      type="color"
                      value={v.color_hex || '#000000'}
                      onChange={(e) => updateVariation(v.key, { color_hex: e.target.value })}
                      className="h-[42px] w-full cursor-pointer rounded-xl border border-stone-300 bg-white p-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">Stock Amount</label>
                    <input
                      type="number"
                      min={0}
                      value={v.stock}
                      onChange={(e) => updateVariation(v.key, { stock: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">Selling Price</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={v.price}
                      onChange={(e) => updateVariation(v.key, { price: e.target.value })}
                      placeholder="0.00"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-stone-500">
                      Compare-at Price
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={v.compare_at_price}
                      onChange={(e) =>
                        updateVariation(v.key, { compare_at_price: e.target.value })
                      }
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2 space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-medium text-stone-500">
                      Image for this variation
                    </label>
                    <ImagePicker
                      file={v.image}
                      onChange={(f) => updateVariation(v.key, { image: f })}
                      label={`${v.color || 'Variation'} image`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-600">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            Product created successfully.
          </div>
        )}

        {/* Sticky submit bar */}
        <div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-stone-200 bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-black px-10 py-3 text-sm font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}