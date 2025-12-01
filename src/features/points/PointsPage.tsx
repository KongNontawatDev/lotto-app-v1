import { motion } from 'framer-motion'

import { PageHeroBackground } from '@/components/layout/PageHeroBackground'
import { PageTransition } from '@/components/motion/PageTransition'

import { PointsHistoryList } from './components/PointsHistoryList'
import { PointsSummaryCard } from './components/PointsSummaryCard'
import { RewardsCatalog } from './components/RewardsCatalog'
import { usePointsQuery } from './hooks/usePointsQuery'
import { useRewardsQuery } from './hooks/useRewardsQuery'

export const PointsPage = () => {
  const { data: pointsData, isLoading: isPointsLoading } = usePointsQuery()
  const { data: rewards, isLoading: isRewardsLoading } = useRewardsQuery()

  return (
    <PageTransition>
      <div className="flex flex-col">
        <PageHeroBackground title="แต้มของฉัน" />
        
        {/* Content Card - overlaps hero background */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <motion.div
            className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col gap-6">
              <PointsSummaryCard summary={pointsData?.summary} />
              <PointsHistoryList
                items={pointsData?.history}
                isLoading={isPointsLoading}
              />
              <RewardsCatalog
                items={rewards ?? pointsData?.rewards}
                isLoading={isRewardsLoading}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

