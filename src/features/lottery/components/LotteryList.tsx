import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LotteryListSkeleton, PageSkeleton } from '@/components/common/Skeleton'
import { EmptyLottery } from '@/components/common/EmptyState'
import { ComponentLoading } from '@/components/common/Loading'
import { useCartStore } from '@/hooks/useCartStore'

import { useLotteryQuery } from '../hooks/useLotteryQuery'
import { useLotteryFilterStore } from '../stores/useLotteryFilterStore'
import type { LotteryTicket } from '../types'

import { LotteryCard } from './LotteryCard'

const PAGE_SIZE = 6

export const LotteryList = () => {
  const { data: tickets = [], isLoading, isError } = useLotteryQuery()
  const { searchTerm, filterType, page, nextPage } = useLotteryFilterStore()
  const addItem = useCartStore((state) => state.addItem)

  // Filter tickets based on search term and filter type
  const filteredTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return []
    return tickets.filter((ticket) => {
      // Filter by type
      const matchFilter = filterType === 'all' || ticket.type === filterType

      // Filter by number (contains match)
      // If searchTerm is empty, show all
      // If searchTerm exists, check if ticket number contains the search term
      const matchNumber = searchTerm
        ? ticket.number.includes(searchTerm)
        : true

      return matchFilter && matchNumber
    })
  }, [tickets, filterType, searchTerm])

  // Paginate
  const visibleTickets = filteredTickets.slice(0, page * PAGE_SIZE)
  const hasMore = filteredTickets.length > visibleTickets.length
  const totalCount = filteredTickets.length

  const handleAddToCart = (ticket: LotteryTicket, quantity: number) => {
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(ticket)
    }
  }

  if (isLoading) {
    return (
      <PageSkeleton>
        <LotteryListSkeleton count={6} />
      </PageSkeleton>
    )
  }

  if (isError) {
    return (
      <ComponentLoading
        text="เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
        size="lg"
      />
    )
  }

  if (filteredTickets.length === 0) {
    return <EmptyLottery searchTerm={searchTerm} />
  }

  return (
    <section className="space-y-6">
      {/* Results count */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <p className="text-sm text-muted-foreground">
          แสดง {visibleTickets.length} จาก {totalCount} รายการ
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visibleTickets.map((ticket, index) => (
            <LotteryCard
              key={ticket.id}
              ticket={ticket}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Load more button */}
      {hasMore && (
        <motion.div
          className="flex justify-center pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            size="lg"
            onClick={nextPage}
            className="gap-1.5 sm:gap-2 rounded-full border-dashed border-primary/50 px-4 sm:px-8 text-xs sm:text-sm text-primary transition-all hover:border-primary hover:bg-primary/5"
          >
            <span>โหลดเพิ่ม</span>
            <ChevronDown size={14} className="sm:w-[18px] sm:h-[18px] animate-bounce" />
          </Button>
        </motion.div>
      )}

      {/* End of list indicator */}
      {!hasMore && visibleTickets.length > 0 && (
        <motion.div
          className="flex justify-center pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-muted-foreground">— แสดงครบทุกรายการแล้ว —</p>
        </motion.div>
      )}
    </section>
  )
}
