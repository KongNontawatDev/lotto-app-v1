import { ChevronRight } from 'lucide-react'

import { LatestResultCardSkeleton } from '@/components/common/Skeleton'
import type { LatestResult } from '@/types'
import { formatThaiDate } from '@/utils'

interface LatestResultCardProps {
  data?: LatestResult
  isLoading?: boolean
}

export const LatestResultCard = ({
  data,
  isLoading,
}: LatestResultCardProps) => {
  if (isLoading) {
    return <LatestResultCardSkeleton />
  }

  return (
  <div className="rounded-xl border border-border/60 bg-card p-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <span className="text-lg">🏆</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">ผลรางวัลงวดล่าสุด</p>
          <p className="text-sm font-medium">
              {formatThaiDate(data?.drawDate ?? new Date().toISOString())}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="text-xs text-muted-foreground">รางวัลที่ 1</p>
          <p className="text-lg font-bold tracking-wider text-primary">
            {data?.firstPrize ?? '------'}
          </p>
        </div>
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    </div>
  </div>
)
}
