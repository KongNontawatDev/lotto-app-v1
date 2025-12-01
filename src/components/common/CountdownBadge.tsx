import { formatCountdown } from '@/utils'

interface CountdownBadgeProps {
  remainingMs: number
}

export const CountdownBadge = ({ remainingMs }: CountdownBadgeProps) => {
  if (remainingMs <= 0) return null
  return (
    <span className="text-[10px] sm:text-xs font-semibold tracking-wide px-2 py-0.5 rounded-full bg-destructive/90 text-destructive-foreground whitespace-nowrap">
      {formatCountdown(remainingMs)}
    </span>
  )
}
