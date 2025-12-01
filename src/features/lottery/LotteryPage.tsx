import { SearchHero } from '@/components/common/SearchHero'
import { PageTransition } from '@/components/motion/PageTransition'

import { LotteryList } from './components/LotteryList'
import { useLotteryFilterStore } from './stores/useLotteryFilterStore'

export const LotteryPage = () => {
  const { digits, setDigits, filterType, setFilterType, triggerSearch } =
    useLotteryFilterStore()

  return (
    <PageTransition>
      <div className="flex flex-col">
        {/* Search Hero - full width */}
        <SearchHero
          title="ลอตเตอรี่"
          subtitle="ค้นหาเลขเด็ด เลือกเลขนำโชค"
          digits={digits}
          filter={filterType}
          onDigitsChange={setDigits}
          onFilterChange={setFilterType}
          onSearch={() => triggerSearch()}
        />

        {/* Lottery List */}
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
          <LotteryList />
        </div>
      </div>
    </PageTransition>
  )
}
