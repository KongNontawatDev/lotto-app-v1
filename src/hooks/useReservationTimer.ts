import { useEffect, useState } from 'react'

import { RESERVATION_DURATION_MS } from '@/stores/cart-store'
import { useCartStore } from './useCartStore'

export const useReservationTimer = () => {
  const items = useCartStore((state) => state.items)
  const clearExpired = useCartStore((state) => state.clearExpired)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    // เรียก clearExpired ทันทีเมื่อ component mount
    clearExpired()
    
    // อัพเดท now ทุกวินาทีเพื่อให้ countdown update
    const tickInterval = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)
    
    // ตั้ง interval ตรวจสอบทุก 1 วินาที
    const clearInterval = window.setInterval(() => {
      clearExpired()
    }, 1000)
    
    return () => {
      window.clearInterval(tickInterval)
      window.clearInterval(clearInterval)
    }
  }, [clearExpired])

  const soonestExpiry = items.reduce((acc, item) => {
    const remaining = RESERVATION_DURATION_MS - (now - item.reservedAt)
    if (remaining <= 0) return acc
    return Math.min(acc, remaining)
  }, Number.POSITIVE_INFINITY)

  return Number.isFinite(soonestExpiry) ? soonestExpiry : 0
}
