import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CartListSkeleton } from '@/components/common/Skeleton'
import { EmptyCart } from '@/components/common/EmptyState'
import { RESERVATION_DURATION_MS } from '@/stores/cart-store'
import type { CartItem } from '@/types'
import {
  formatCountdown,
  formatCurrency,
  formatThaiDate,
  formatTicketNumber,
} from '@/utils'

interface CartListProps {
  items: CartItem[]
  onRemove: (cartId: string) => void | Promise<void>
}

/**
 * Component สำหรับแสดง countdown ที่ update ทุกวินาที
 */
const CountdownDisplay = ({ reservedAt }: { reservedAt: number }) => {
  const [remaining, setRemaining] = useState(() => {
    return Math.max(RESERVATION_DURATION_MS - (Date.now() - reservedAt), 0)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = Math.max(
        RESERVATION_DURATION_MS - (Date.now() - reservedAt),
        0,
      )
      setRemaining(newRemaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [reservedAt])

  const isExpired = remaining <= 0

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${
        isExpired
          ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
          : 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30'
      }`}
    >
      {isExpired
        ? 'หมดเวลาจอง'
        : `เหลือเวลา ${formatCountdown(remaining)}`}
    </span>
  )
}

interface CartListWithLoadingProps extends CartListProps {
  isLoading?: boolean
}

export const CartList = ({
  items,
  onRemove,
  isLoading,
}: CartListWithLoadingProps) => {
  if (isLoading) {
    return <CartListSkeleton count={3} />
  }

  const safeItems = Array.isArray(items) ? items : []
  if (!safeItems.length) {
    return <EmptyCart />
  }

  return (
    <ul className="space-y-4">
      {safeItems.map((item) => (
        <li
          key={item.cartId}
          className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card p-4 shadow-sm sm:flex-row sm:items-center"
        >
          <img
            src={item.image}
            alt={item.number}
            className="h-24 w-full rounded-2xl border border-border/40 object-cover sm:w-40"
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  งวด {formatThaiDate(item.drawDate)}
                </p>
                <p className="text-xl font-semibold tracking-[0.4em]">
                  {formatTicketNumber(item.number)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="ลบออกจากตะกร้า"
                onClick={() => onRemove(item.cartId)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full bg-muted px-3 py-1">
                {item.type === 'single' ? 'หวยเดี่ยว' : 'หวยชุด'}
              </span>
              <span>จำนวน {item.quantity} ใบ</span>
              <span className="font-semibold text-primary">
                {formatCurrency(item.price * item.quantity)}
              </span>
              <CountdownDisplay reservedAt={item.reservedAt} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

