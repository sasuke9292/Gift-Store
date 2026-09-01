import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
  category?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId)
          
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          } else {
            return { items: [...state.items, item] }
          }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: 'gift-store-cart',
    }
  )
)

export interface FavoriteItem {
  id: string
  name: string
  price: number
  salePrice?: number | null
  image?: string
  category?: string
  isNew?: boolean
  isBestSeller?: boolean
}

interface FavoritesStore {
  items: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: string) => void
  hasFavorite: (id: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) {
            return state
          }
          return { items: [...state.items, item] }
        })
      },
      removeFavorite: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },
      hasFavorite: (id) => {
        return get().items.some((i) => i.id === id)
      },
      clearFavorites: () => set({ items: [] }),
    }),
    {
      name: 'gift-store-favorites',
    }
  )
)
