import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { MyTicket } from '@/types'

const myTicketsUrl = new URL(
  '../../../mockup/myTickets.json',
  import.meta.url,
).href

export const useMyTicketsQuery = () =>
  useQuery({
    queryKey: ['my-tickets'],
    queryFn: async () => {
      const { data } = await apiClient.get<MyTicket[]>(myTicketsUrl)
      return data
    },
  })

