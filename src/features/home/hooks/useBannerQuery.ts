import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/libs/axios'
import type { BannerItem } from '@/types'

const bannersUrl = new URL(
  '../../../mockup/banners.json',
  import.meta.url,
).href

export const useBannerQuery = () =>
  useQuery({
    queryKey: ['banner-items'],
    queryFn: async () => {
      const { data } = await apiClient.get<BannerItem[]>(bannersUrl)
      return data
    },
  })

