import { useMemo, useState } from 'react'

import { SearchHero } from '@/components/common/SearchHero'
import { PageTransition } from '@/components/motion/PageTransition'
import type { FilterValue } from '@/types'

import { BannerCarousel } from './components/BannerCarousel'
import { LatestResultCard } from './components/LatestResultCard'
import { QuickMenuGrid } from './components/QuickMenuGrid'
import { RecommendedSection } from './components/RecommendedSection'
import { useBannerQuery } from './hooks/useBannerQuery'
import { useLatestResultQuery } from './hooks/useLatestResultQuery'
import { useRecommendedTicketsQuery } from './hooks/useRecommendedTicketsQuery'

export const HomePage = () => {
  const { data: latestResult, isLoading: isLatestLoading } =
    useLatestResultQuery()
  const { data: banners, isLoading: isBannerLoading } = useBannerQuery()
  const {
    data: recommended,
    isLoading: isRecommendedLoading,
  } = useRecommendedTicketsQuery()
  const [filter, setFilter] = useState<FilterValue>('all')
  const [searchNumber, setSearchNumber] = useState('')

  const visibleTickets = useMemo(() => {
    if (!recommended || !Array.isArray(recommended)) return []
    const filtered = recommended.filter((ticket) => {
      const matchFilter = filter === 'all' || ticket.type === filter
      const matchNumber = searchNumber
        ? ticket.number.includes(searchNumber)
        : true
      return matchFilter && matchNumber
    })
    // Limit to max 6 items for home page
    return filtered.slice(0, 6)
  }, [filter, recommended, searchNumber])

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Search Hero - full width */}
        <SearchHero
          onSearch={({ filter: nextFilter, number }) => {
            setFilter(nextFilter)
            setSearchNumber(number)
          }}
        />

        {/* Content section */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
          <LatestResultCard data={latestResult} isLoading={isLatestLoading} />
          <BannerCarousel banners={banners} isLoading={isBannerLoading} />
          
          <RecommendedSection
            tickets={visibleTickets}
            isLoading={isRecommendedLoading}
            maxItemsMobile={3}
          />
          
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">เมนูลัด</h2>
            <QuickMenuGrid />
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
