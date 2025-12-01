import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import { USE_MOCK_API } from '@/config/api'
import { initializeStock } from '@/api/mock-cart-service'
import type { RecommendedTicket } from '@/types'

const recommendedUrl = new URL(
  '../../../mockup/recommendedTickets.json',
  import.meta.url,
).href

export const useRecommendedTicketsQuery = () => {
  const query = useQuery({
    queryKey: ['recommended-tickets'],
    queryFn: async () => {
      const { data } = await apiClient.get<RecommendedTicket[]>(recommendedUrl)
      return data
    },
  })

  // Initialize stock state เมื่อโหลด recommended tickets สำเร็จ (เฉพาะเมื่อใช้ mock API)
  useEffect(() => {
    if (USE_MOCK_API && query.data) {
      initializeStock(query.data)
    }
  }, [query.data])

  return query
}

