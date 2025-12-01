import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import { cartStore } from '@/stores/cart-store'
import type { CartItem } from '@/types'

const cartUrl = new URL('../../../mockup/cart.json', import.meta.url).href

export const useCartQuery = () => {
  const query = useQuery({
    queryKey: ['cart-bootstrap'],
    queryFn: async () => {
      const { data } = await apiClient.get<CartItem[]>(cartUrl)
      return data
    },
    initialData: [],
  })

  useEffect(() => {
    if (query.data && cartStore.getState().items.length === 0) {
      cartStore.getState().hydrate(query.data)
    }
  }, [query.data])

  return query
}

