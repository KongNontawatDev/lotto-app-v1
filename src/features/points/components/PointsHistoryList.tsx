import { PointsHistoryListSkeleton } from '@/components/common/Skeleton'
import { EmptyPointsHistory } from '@/components/common/EmptyState'
import type { PointsHistoryItem } from '@/types'

interface PointsHistoryListProps {
  items?: PointsHistoryItem[]
  isLoading?: boolean
}

export const PointsHistoryList = ({
  items = [],
  isLoading,
}: PointsHistoryListProps) => {
  if (isLoading) {
    return <PointsHistoryListSkeleton count={5} />
  }

  if (!items.length) {
    return <EmptyPointsHistory />
  }

  return (
    <section className="space-y-3 rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold">ประวัติการได้รับแต้ม</h3>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-border/40 px-3 py-2"
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
            <span className="font-semibold text-primary">+{item.points}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

