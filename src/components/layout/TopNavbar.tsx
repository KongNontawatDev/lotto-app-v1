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

export const TopNavbar = memo(() => {
  const { location } = useRouterState()
  const items = useCartStore((state) => state.items)
  const countdownMs = useReservationTimer()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 relative bg-transparent">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-white dark:text-white">เงินตุง-เป๋าตัง</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.id]
              const isActive = location.pathname === item.href
              const isCart = item.id === 'cart'

              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white/20 dark:bg-white/10 text-white dark:text-white'
                      : 'text-white/80 dark:text-white/80 hover:bg-white/10 dark:hover:bg-white/5 hover:text-white dark:hover:text-white',
                    isCart && 'pr-3',
                  )}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span className="hidden sm:inline">{item.label}</span>

                  {/* Cart count badge */}
                  {isCart && totalItems > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                      {totalItems}
                    </span>
                  )}

                  {/* Countdown timer for cart */}
                  {isCart && countdownMs > 0 && (
                    <span className="hidden lg:flex items-center gap-1 rounded bg-orange-500/30 dark:bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-white dark:text-orange-300 border border-orange-400/50 dark:border-orange-500/30">
                      {formatCountdown(countdownMs)}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
})

