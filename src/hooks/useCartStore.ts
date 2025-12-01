import { useStore } from 'zustand'

import { cartStore, type CartStore } from '@/stores/cart-store'

export const useCartStore = <T,>(selector: (state: CartStore) => T) =>
  useStore(cartStore, selector)
