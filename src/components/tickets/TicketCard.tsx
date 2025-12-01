import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LotteryTicket } from '@/types'
import { formatCurrency, formatThaiDate, formatTicketNumber } from '@/utils'

interface TicketCardProps {
  ticket: LotteryTicket
  onAddToCart?: (ticket: LotteryTicket) => void
  actionLabel?: string
  /** Compact mode for smaller cards */
  compact?: boolean
}

export const TicketCard = ({
  ticket,
  onAddToCart,
  actionLabel = 'หยิบใส่ตะกร้า',
  compact = false,
}: TicketCardProps) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className={cn('space-y-2', compact ? 'p-3' : 'space-y-3')}>
        <img
          src={ticket.image}
          alt={`Lottery ticket ${ticket.number}`}
          className={cn(
            'w-full rounded-lg border border-border/40',
            compact && 'aspect-[16/10] object-cover'
          )}
        />
        <div className="flex flex-col gap-0.5">
          <span className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
            งวด {formatThaiDate(ticket.drawDate)}
          </span>
          <p className={cn('font-bold tracking-wider', compact ? 'text-base' : 'text-xl')}>
            {formatTicketNumber(ticket.number)}
          </p>
          {!compact && (
            <span className="text-xs uppercase text-muted-foreground">
              {ticket.type === 'single' ? 'หวยเดี่ยว' : 'หวยชุด'}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn(
        'flex items-center justify-between',
        compact ? 'px-3 pb-2 text-xs' : 'text-sm'
      )}>
        <span className="font-semibold text-primary">
          {formatCurrency(ticket.price)}
        </span>
        {!compact && (
          <span className="text-muted-foreground">
            คงเหลือ {ticket.remaining} ใบ
          </span>
        )}
      </CardContent>
      {onAddToCart && (
        <CardFooter className={compact ? 'p-3 pt-0' : ''}>
          <Button
            size={compact ? 'sm' : 'default'}
            className={cn('w-full rounded-full', compact && 'text-xs')}
            onClick={() => onAddToCart(ticket)}
          >
            {compact ? (
              <>
                <ShoppingCart size={14} className="mr-1" />
                ใส่ตะกร้า
              </>
            ) : (
              actionLabel
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  </motion.div>
)
