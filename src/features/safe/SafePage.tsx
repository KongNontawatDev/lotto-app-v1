import { motion } from 'framer-motion'

import { PageHeroBackground } from '@/components/layout/PageHeroBackground'
import { PageTransition } from '@/components/motion/PageTransition'

import { MyTicketsTabs } from './components/MyTicketsTabs'
import { useMyTicketsQuery } from './hooks/useMyTicketsQuery'

export const SafePage = () => {
  const { data: tickets = [], isLoading } = useMyTicketsQuery()

  return (
    <PageTransition>
      <div className="flex flex-col">
        <PageHeroBackground title="ตู้เซฟลอตเตอรี่ของฉัน" />
        
        {/* Content Card - overlaps hero background */}
        <div className="mx-auto w-full max-w-5xl px-4">
          <motion.div
            className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MyTicketsTabs tickets={tickets} isLoading={isLoading} />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

