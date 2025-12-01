import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { RewardItem } from '@/types'

const rewardsUrl = new URL('../../../mockup/rewards.json', import.meta.url).href

export const useRewardsQuery = () =>
  useQuery({
    queryKey: ['reward-items'],
    queryFn: async () => {
      const { data } = await apiClient.get<RewardItem[]>(rewardsUrl)
      return data
    },
  })

