import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils'

import type { LotteryTicket } from '../types'

interface LotteryCardProps {
  ticket: LotteryTicket
  onAddToCart?: (ticket: LotteryTicket, quantity: number) => void
  index?: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
}

export const LotteryCard = ({
  ticket,
  onAddToCart,
  index = 0,
}: LotteryCardProps) => {
  const [quantity, setQuantity] = useState(1)
  const isLowStock = ticket.remaining <= 2
  const hasMultiple = ticket.remaining > 1

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group relative gap-0 overflow-hidden border border-border/40 py-0 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
        {/* Ticket Image - Main Focus */}
        <div className="relative overflow-hidden">
          <motion.img
            src={ticket.image}
            alt={`ลอตเตอรี่เลข ${ticket.number}`}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay gradient */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <CardContent className="flex items-center justify-between px-1.5 sm:px-2 py-1 sm:py-1.5">
          {/* Price */}
          <div className="leading-tight">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">ราคา</p>
            <p className="text-sm sm:text-base font-bold text-primary">
              {formatCurrency(ticket.price)}
            </p>
          </div>

          {/* Remaining */}
          <div className="text-right leading-tight">
            <p className="text-[9px] sm:text-[10px] text-muted-foreground">คงเหลือ</p>
            <p
              className={cn(
                'text-xs sm:text-sm font-semibold',
                isLowStock ? 'text-red-500' : 'text-foreground'
              )}
            >
              {ticket.remaining}{' '}
              <span className="text-[10px] sm:text-xs font-normal text-muted-foreground">
                ใบ
              </span>
            </p>
          </div>
        </CardContent>

        {onAddToCart && (
          <CardFooter className="gap-1 sm:gap-1.5 px-1.5 sm:px-2 pb-1.5 sm:pb-2 pt-0">
            {hasMultiple && (
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-7 sm:h-8 w-12 sm:w-14 shrink-0 rounded-full border border-border/40 bg-background px-1 sm:px-2 text-center text-[10px] sm:text-xs font-medium focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30"
              >
                {Array.from({ length: ticket.remaining }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  )
                )}
              </select>
            )}
            <Button
              onClick={() => onAddToCart(ticket, quantity)}
              className="h-7 sm:h-8 flex-1 gap-1 sm:gap-1.5 rounded-full bg-linear-to-r from-primary to-primary/90 text-[10px] sm:text-xs shadow-sm transition-all hover:shadow-md"
              size="sm"
              disabled={ticket.remaining <= 0}
            >
              <ShoppingCart size={10} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">หยิบใส่ตะกร้า</span>
              <span className="sm:hidden">หยิบ</span>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
