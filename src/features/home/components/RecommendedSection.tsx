import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { SectionHeading } from '@/components/common/SectionHeading'
import { LotteryListSkeleton } from '@/components/common/Skeleton'
import { EmptyLottery } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import { cn } from '@/lib/utils'
import type { RecommendedTicket } from '@/types'

import { LotteryCard } from '@/features/lottery/components/LotteryCard'

interface RecommendedSectionProps {
  tickets?: RecommendedTicket[]
  isLoading?: boolean
  /** Number of items to show on mobile (default: show all) */
  maxItemsMobile?: number
}

export const RecommendedSection = ({
  tickets = [],
  isLoading,
  maxItemsMobile,
}: RecommendedSectionProps) => {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (ticket: RecommendedTicket, quantity: number) => {
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(ticket)
    }
  }

  return (
    <section className="space-y-4">
      <SectionHeading
        title="แนะนำเลขเด็ดงวดนี้"
        subtitle="เลือกเลขนำโชค"
        action={
          <Link to="/lottery">
            <Button variant="ghost" size="sm" className="rounded-full border border-border/70 text-[10px] sm:text-xs">
              ดูทั้งหมด
            </Button>
          </Link>
        }
      />
      {isLoading ? (
        <LotteryListSkeleton count={maxItemsMobile || 6} />
      ) : tickets.length === 0 ? (
        <EmptyLottery />
      ) : (
        <motion.div
          className="grid grid-cols-2 gap-3 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id}
              className={cn(
                // Hide extra items on mobile if maxItemsMobile is set
                maxItemsMobile && index >= maxItemsMobile && 'hidden lg:block'
              )}
            >
              <LotteryCard
                ticket={ticket}
                onAddToCart={handleAddToCart}
                index={index}
              />
            </div>
          ))}
        </motion.div>
      )}
    </section>
  )
}
