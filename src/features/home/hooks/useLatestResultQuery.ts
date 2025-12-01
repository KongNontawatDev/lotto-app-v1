import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { LatestResult } from '@/types'

const latestResultUrl = new URL(
  '../../../mockup/latestResult.json',
  import.meta.url,
).href

export const useLatestResultQuery = () =>
  useQuery({
    queryKey: ['latest-result'],
    queryFn: async () => {
      const { data } = await apiClient.get<LatestResult>(latestResultUrl)
      return data
    },
  })

