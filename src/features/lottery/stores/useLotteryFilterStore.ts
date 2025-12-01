import { create } from 'zustand'

import type { FilterValue } from '../types'

interface LotteryFilterState {
  /** 6 individual digit values */
  digits: string[]
  /** Combined search term from digits */
  searchTerm: string
  /** Filter by lottery type */
  filterType: FilterValue
  /** Current page for pagination */
  page: number
}

interface LotteryFilterActions {
  /** Set a single digit at the given index */
  setDigit: (index: number, value: string) => void
  /** Set all 6 digits at once */
  setDigits: (digits: string[]) => void
  /** Trigger search with current digits */
  triggerSearch: () => void
  /** Set filter type */
  setFilterType: (type: FilterValue) => void
  /** Reset page to 1 */
  resetPage: () => void
  /** Go to next page */
  nextPage: () => void
  /** Reset all filters */
  resetFilters: () => void
}

type LotteryFilterStore = LotteryFilterState & LotteryFilterActions

const initialDigits = ['', '', '', '', '', '']

export const useLotteryFilterStore = create<LotteryFilterStore>((set, get) => ({
  digits: initialDigits,
  searchTerm: '',
  filterType: 'all',
  page: 1,

  setDigit: (index, value) => {
    const digits = [...get().digits]
    const safeValue = typeof value === 'string' ? value : ''
    digits[index] = safeValue.replace(/\D/g, '').slice(0, 1)
    set({ digits })
  },

  setDigits: (digits) => {
    const safeDigits = Array.isArray(digits) ? digits : []
    set({ digits: safeDigits.slice(0, 6) })
  },

  triggerSearch: () => {
    const searchTerm = get().digits.join('')
    set({ searchTerm, page: 1 })
  },

  setFilterType: (filterType) => {
    set({ filterType, page: 1 })
  },

  resetPage: () => {
    set({ page: 1 })
  },

  nextPage: () => {
    set((state) => ({ page: state.page + 1 }))
  },

  resetFilters: () => {
    set({
      digits: initialDigits,
      searchTerm: '',
      filterType: 'all',
      page: 1,
    })
  },
}))

