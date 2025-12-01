import { Link, useRouterState } from '@tanstack/react-router'
import {
  Home,
  ShoppingBag,
  Shield,
  Ticket,
  User,
  type LucideIcon,
} from 'lucide-react'
import { memo } from 'react'

import { NAV_ITEMS } from '@/config/app'
import { useCartStore } from '@/hooks/useCartStore'
import { useReservationTimer } from '@/hooks/useReservationTimer'
import { cn } from '@/lib/utils'
import { formatCountdown } from '@/utils'

const iconMap: Record<(typeof NAV_ITEMS)[number]['id'], LucideIcon> = {
  home: Home,
  lottery: Ticket,
  cart: ShoppingBag,
  safe: Shield,
  profile: User,
}

export const BottomNavbar = memo(() => {
  const { location } = useRouterState()
  const items = useCartStore((state) => state.items)
  const countdownMs = useReservationTimer()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 dark:border-white/10 bg-background/95 dark:bg-background/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-3xl px-2 sm:px-4 pb-1 flex items-end justify-between gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.id]
          const isActive = location.pathname === item.href
          const isCart = item.id === 'cart'

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-end text-[10px] font-medium transition-all duration-200',
                isActive 
                  ? 'text-primary dark:text-white' 
                  : 'text-muted-foreground dark:text-white/80',
              )}
            >
              {/* Icon container */}
              <div
                className={cn(
                  'relative border border-transparent transition-all',
                  isCart
                    ? 'p-2 rounded-xl bg-primary text-primary-foreground shadow-sm -translate-y-2'
                    : 'p-0.5',
                )}
              >
                <Icon
                  size={isCart ? 22 : 18}
                  strokeWidth={isCart ? 2.5 : 2}
                  className={cn(
                    !isCart && (isActive ? 'text-primary dark:text-white' : 'text-muted-foreground dark:text-white/80')
                  )}
                />

                {/* Cart count badge - red circle on top right */}
                {isCart && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] rounded-full bg-red-500 text-white font-bold shadow-sm ring-1 ring-background/70 dark:ring-background/70">
                    {totalItems}
                  </span>
                )}
              </div>

              {/* Countdown timer - below icon, above label */}
              {isCart && countdownMs > 0 && (
                <span className="text-[9px] font-bold text-orange-600 dark:text-orange-300 bg-orange-500/20 dark:bg-orange-500/20 px-1.5 py-0.5 rounded -translate-y-1 whitespace-nowrap border border-orange-500/30 dark:border-orange-500/30 shadow-sm">
                  {formatCountdown(countdownMs)}
                </span>
              )}

              {/* Label */}
              <span className={cn(isCart && '-translate-y-1')}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
})
