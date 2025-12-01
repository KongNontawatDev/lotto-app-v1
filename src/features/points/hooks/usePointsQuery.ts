import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { PointsPayload } from '@/types'

const pointsUrl = new URL('../../../mockup/points.json', import.meta.url).href

export const usePointsQuery = () =>
  useQuery({
    queryKey: ['points-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get<PointsPayload>(pointsUrl)
      return data
    },
  })

