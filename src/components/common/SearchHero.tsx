import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Dices, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { FilterValue } from '@/types'
import { randomDigits } from '@/utils'

interface SearchHeroProps {
  /** Hero title */
  title?: string
  /** Hero subtitle */
  subtitle?: string
  /** Callback when search is triggered */
  onSearch?: (params: { number: string; filter: FilterValue }) => void
  /** External digits state (controlled mode) */
  digits?: string[]
  /** External filter state (controlled mode) */
  filter?: FilterValue
  /** Callback when digits change (controlled mode) */
  onDigitsChange?: (digits: string[]) => void
  /** Callback when filter change (controlled mode) */
  onFilterChange?: (filter: FilterValue) => void
}

const filterOptions: { label: string; value: FilterValue }[] = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'หวยเดี่ยว', value: 'single' },
  { label: 'หวยชุด', value: 'set' },
]

export const SearchHero = ({
  title = 'เงินตุง-เป๋าตัง',
  subtitle = 'จำหน่ายสลากกินแบ่งรัฐบาล ที่ถูกต้องตามกฎหมาย',
  onSearch,
  digits: externalDigits,
  filter: externalFilter,
  onDigitsChange,
  onFilterChange,
}: SearchHeroProps) => {
  const inputId = useId()
  
  // Internal state (uncontrolled mode)
  const [internalDigits, setInternalDigits] = useState(['', '', '', '', '', ''])
  const [internalFilter, setInternalFilter] = useState<FilterValue>('all')

  // Use external state if provided, otherwise use internal
  const digits = externalDigits ?? internalDigits
  const filter = externalFilter ?? internalFilter

  const setDigits = (newDigits: string[]) => {
    if (onDigitsChange) {
      onDigitsChange(newDigits)
    } else {
      setInternalDigits(newDigits)
    }
  }

  const setFilter = (newFilter: FilterValue) => {
    if (onFilterChange) {
      onFilterChange(newFilter)
    } else {
      setInternalFilter(newFilter)
    }
  }

  const handleDigitChange = (index: number, value: string) => {
    const safeValue = typeof value === 'string' ? value : ''
    const sanitized = safeValue.replace(/\D/g, '').slice(0, 1)
    const newDigits = [...digits]
    newDigits[index] = sanitized
    setDigits(newDigits)

    // Auto focus next input
    if (sanitized && index < 5) {
      const nextInput = document.getElementById(`${inputId}-digit-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`${inputId}-digit-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleRandom = () => {
    const random = randomDigits(6)
    setDigits(random.split(''))
    onSearch?.({ number: random, filter })
  }

  const handleSearch = () => {
    onSearch?.({ number: digits.join(''), filter })
  }

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    onSearch?.({ number: digits.join(''), filter: value })
  }

  // Get current Thai date
  const currentDate = new Date().toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="relative">
      {/* Background Hero with curved design - extends behind TopNavbar */}
      <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-secondary/80 px-4 pb-28 pt-6 lg:-mt-16 lg:pt-24">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -left-8 top-8 h-32 w-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-12 bottom-20 h-20 w-20 rounded-full bg-secondary/30" />

        {/* Content */}
        <motion.div
          className="relative z-10 mx-auto max-w-5xl text-center text-primary-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold tracking-wide">{title}</h1>
          <p className="mt-1 text-sm opacity-80">{subtitle}</p>
        </motion.div>

        {/* Curved bottom - curve down */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0C240 60 480 80 720 80C960 80 1200 60 1440 0V80H0V0Z"
              className="fill-background"
            />
          </svg>
        </div>
      </div>

      {/* Search Card - inside container */}
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          className="relative z-10 -mt-20 rounded-2xl border border-border/40 bg-card p-5 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Title */}
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-primary">ค้นหาเลขเด็ด!</h2>
            <p className="text-sm text-muted-foreground">งวดวันที่ {currentDate}</p>
          </div>

          {/* Filter Chips */}
          <div className="mb-4 flex justify-center gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleFilterChange(option.value)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                  filter === option.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'border border-border/40 bg-transparent text-muted-foreground hover:border-primary/50 hover:text-primary'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* 6 Digit Inputs */}
          <div className="mb-4 flex justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <Input
                key={index}
                id={`${inputId}-digit-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder={String(index + 1)}
                className="h-16 sm:h-20 flex-1 max-w-16 sm:max-w-24 rounded-xl border-2 border-border/40 bg-muted/30 px-0 py-0 text-center leading-none text-3xl! sm:text-4xl! font-bold placeholder:leading-none placeholder:text-3xl sm:placeholder:text-4xl placeholder:font-semibold placeholder:text-muted-foreground/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/25 shadow-sm"
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleRandom}
              className="flex-1 gap-2 rounded-xl bg-[#1a1a4e] text-white hover:bg-[#1a1a4e]/90"
            >
              <Dices size={18} />
              สุ่มตัวเลข
            </Button>
            <Button
              type="button"
              onClick={handleSearch}
              className="flex-1 gap-2 rounded-xl"
            >
              <Search size={18} />
              ค้นหา
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

