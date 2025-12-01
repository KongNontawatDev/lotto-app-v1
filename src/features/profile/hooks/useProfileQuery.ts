import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { UserProfile } from '@/types'

const profileUrl = new URL('../../../mockup/profile.json', import.meta.url).href

export const useProfileQuery = () =>
  useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data } = await apiClient.get<UserProfile>(profileUrl)
      return data
    },
  })

