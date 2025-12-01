import { motion } from 'framer-motion'
import { Filter, Layers, TicketMinus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { useLotteryFilterStore } from '../stores/useLotteryFilterStore'
import type { FilterValue } from '../types'

interface FilterOption {
  label: string
  value: FilterValue
  icon: React.ReactNode
}

const filterOptions: FilterOption[] = [
  { label: 'ทั้งหมด', value: 'all', icon: <Filter size={14} /> },
  { label: 'หวยเดี่ยว', value: 'single', icon: <TicketMinus size={14} /> },
  { label: 'หวยชุด', value: 'set', icon: <Layers size={14} /> },
]

export const LotteryFilterChips = () => {
  const { filterType, setFilterType } = useLotteryFilterStore()

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {filterOptions.map((option) => {
        const isActive = option.value === filterType

        return (
          <Button
            key={option.value}
            size="sm"
            variant={isActive ? 'default' : 'ghost'}
            className={cn(
              'relative gap-1.5 rounded-full border transition-all duration-200',
              isActive
                ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                : 'border-border/40 bg-card text-muted-foreground hover:border-primary/50 hover:text-primary'
            )}
            onClick={() => setFilterType(option.value)}
          >
            {option.icon}
            {option.label}
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 -z-10 rounded-full bg-primary"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
          </Button>
        )
      })}
    </motion.div>
  )
}

