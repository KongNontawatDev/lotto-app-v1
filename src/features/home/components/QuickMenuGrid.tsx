import { Link } from '@tanstack/react-router'
import { Leaf, Moon, ShieldCheck, Sparkles } from 'lucide-react'

import { QUICK_MENU } from '@/config/app'

const iconMap = {
  Sparkles,
  Moon,
  Leaf,
  ShieldCheck,
}

export const QuickMenuGrid = () => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {QUICK_MENU.map((item) => {
      const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Sparkles
      return (
        <Link
          key={item.id}
          to={item.href}
          className="rounded-2xl border border-border/40 bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          <Icon className="mb-2 text-primary" size={24} />
          <span className="text-sm font-semibold">{item.label}</span>
        </Link>
      )
    })}
  </div>
)

