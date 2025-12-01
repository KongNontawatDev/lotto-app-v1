import { Button } from '@/components/ui/button'
import { RewardsCatalogSkeleton } from '@/components/common/Skeleton'
import { EmptyRewards } from '@/components/common/EmptyState'
import type { RewardItem } from '@/types'

interface RewardsCatalogProps {
  items?: RewardItem[]
  isLoading?: boolean
}

export const RewardsCatalog = ({
  items = [],
  isLoading,
}: RewardsCatalogProps) => {
  if (isLoading) {
    return <RewardsCatalogSkeleton count={4} />
  }

  if (!items.length) {
    return <EmptyRewards />
  }

  return (
    <section className="space-y-4 rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <h3 className="text-lg font-semibold">ของรางวัลที่แลกได้</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-border/40 p-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-32 rounded-xl object-cover"
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                ต้องการ {item.pointsRequired.toLocaleString('th-TH')} แต้ม
              </p>
            </div>
            <Button variant="outline" className="rounded-full">
              แลกของรางวัล
            </Button>
          </article>
        ))}
      </div>
    </section>
  )
}

