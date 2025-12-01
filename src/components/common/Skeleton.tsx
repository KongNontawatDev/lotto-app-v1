import { Skeleton as BaseSkeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Skeleton สำหรับ Card ลอตเตอรี่
 */
export const LotteryCardSkeleton = ({
  className,
}: {
  className?: string
}) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border/40 bg-card p-4',
        className,
      )}
    >
      <BaseSkeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-2">
        <BaseSkeleton className="h-6 w-24" />
        <BaseSkeleton className="h-4 w-32" />
        <BaseSkeleton className="h-8 w-full" />
      </div>
      <BaseSkeleton className="h-10 w-full rounded-full" />
    </div>
  )
}

/**
 * Skeleton สำหรับ List ของลอตเตอรี่
 */
export const LotteryListSkeleton = ({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 lg:grid-cols-3',
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <LotteryCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * Skeleton สำหรับ Cart Item
 */
export const CartItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card p-4 shadow-sm sm:flex-row sm:items-center">
      <BaseSkeleton className="h-24 w-full rounded-2xl sm:w-40" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2">
            <BaseSkeleton className="h-4 w-32" />
            <BaseSkeleton className="h-6 w-40" />
          </div>
          <BaseSkeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <BaseSkeleton className="h-6 w-20 rounded-full" />
          <BaseSkeleton className="h-4 w-16" />
          <BaseSkeleton className="h-4 w-24" />
          <BaseSkeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton สำหรับ Cart List
 */
export const CartListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <ul className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index}>
          <CartItemSkeleton />
        </li>
      ))}
    </ul>
  )
}

/**
 * Skeleton สำหรับ Points History Item
 */
export const PointsHistoryItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/40 px-3 py-2">
      <div className="space-y-2">
        <BaseSkeleton className="h-4 w-32" />
        <BaseSkeleton className="h-3 w-24" />
      </div>
      <BaseSkeleton className="h-5 w-16" />
    </div>
  )
}

/**
 * Skeleton สำหรับ Points History List
 */
export const PointsHistoryListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <section className="space-y-3 rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <BaseSkeleton className="h-6 w-48" />
      <ul className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <li key={index}>
            <PointsHistoryItemSkeleton />
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Skeleton สำหรับ Reward Card
 */
export const RewardCardSkeleton = () => {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border/40 p-3">
      <BaseSkeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-2">
        <BaseSkeleton className="h-5 w-32" />
        <BaseSkeleton className="h-4 w-40" />
      </div>
      <BaseSkeleton className="h-10 w-full rounded-full" />
    </article>
  )
}

/**
 * Skeleton สำหรับ Rewards Catalog
 */
export const RewardsCatalogSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <section className="space-y-4 rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <BaseSkeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, index) => (
          <RewardCardSkeleton key={index} />
        ))}
      </div>
    </section>
  )
}

/**
 * Skeleton สำหรับ Banner
 */
export const BannerSkeleton = () => {
  return (
    <BaseSkeleton className="h-48 w-full rounded-2xl lg:h-64" />
  )
}

/**
 * Skeleton สำหรับ Latest Result Card
 */
export const LatestResultCardSkeleton = () => {
  return (
    <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
      <BaseSkeleton className="mb-4 h-6 w-40" />
      <div className="space-y-3">
        <BaseSkeleton className="h-12 w-full" />
        <BaseSkeleton className="h-8 w-32" />
        <BaseSkeleton className="h-4 w-48" />
      </div>
    </div>
  )
}

/**
 * Page Skeleton - สำหรับโหลดทั้งหน้า
 */
export const PageSkeleton = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn('space-y-6 py-6', className)}>
      {children}
    </div>
  )
}

