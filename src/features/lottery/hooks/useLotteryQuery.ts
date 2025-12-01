import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import { USE_MOCK_API } from '@/config/api'
import { initializeStock } from '@/api/mock-cart-service'

import type { LotteryTicket } from '../types'

const lotteriesUrl = new URL(
  '../../../mockup/lotteries.json',
  import.meta.url,
).href

export const useLotteryQuery = () => {
  const query = useQuery({
    queryKey: ['lottery-list'],
    queryFn: async () => {
      const { data } = await apiClient.get<LotteryTicket[]>(lotteriesUrl)
      return data
    },
    initialData: [],
  })

  // Initialize stock state เมื่อโหลด lotteries สำเร็จ (เฉพาะเมื่อใช้ mock API)
  useEffect(() => {
    if (USE_MOCK_API && query.data) {
      initializeStock(query.data)
    }
  }, [query.data])

  return query
}

