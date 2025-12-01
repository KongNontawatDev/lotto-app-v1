import { Button } from '@/components/ui/button'
import type { CartItem } from '@/types'
import { formatCurrency } from '@/utils'

interface CartSummaryProps {
  items: CartItem[]
}

export const CartSummary = ({ items }: CartSummaryProps) => {
  const safeItems = Array.isArray(items) ? items : []
  const totalQuantity = safeItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = safeItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )

  return (
    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span>จำนวนลอตเตอรี่</span>
          <span className="font-semibold">{totalQuantity} ใบ</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>ยอดรวม</span>
          <span className="text-primary">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      <Button className="mt-4 w-full rounded-full" disabled={!safeItems.length}>
        ไปเลือกช่องทางชำระเงิน
      </Button>
    </div>
  )
}

