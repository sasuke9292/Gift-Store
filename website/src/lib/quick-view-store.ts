import { create } from 'zustand'

export interface QuickViewProduct {
  id: string
  name: string
  price: number
  salePrice?: number | null
  description?: string | null
  shortDescription?: string | null
  images?: string[]
  category?: { name: string } | string | null
  isNew?: boolean
  isBestSeller?: boolean
}

interface QuickViewStore {
  isOpen: boolean
  product: QuickViewProduct | null
  openQuickView: (product: QuickViewProduct) => void
  closeQuickView: () => void
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  isOpen: false,
  product: null,
  openQuickView: (product) => set({ isOpen: true, product }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}))
