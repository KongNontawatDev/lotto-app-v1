import { useEffect, useState } from 'react'

/**
 * Hook สำหรับนับถอยหลังที่ update ทุกวินาที
 */
export const useCountdown = (remainingMs: number) => {
  const [countdown, setCountdown] = useState(remainingMs)

  useEffect(() => {
    setCountdown(remainingMs)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newValue = prev - 1000
        return newValue > 0 ? newValue : 0
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [remainingMs])

  return countdown
}

