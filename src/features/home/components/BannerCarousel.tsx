import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { BannerSkeleton } from '@/components/common/Skeleton'
import type { BannerItem } from '@/types'

interface BannerCarouselProps {
  banners?: BannerItem[]
  isLoading?: boolean
}

const AUTO_PLAY_MS = 4000

export const BannerCarousel = ({
  banners = [],
  isLoading,
}: BannerCarouselProps) => {
  const safeBanners = Array.isArray(banners) ? banners : []
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goToSlide = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > index ? 1 : -1)
      setIndex(newIndex)
    },
    [index]
  )

  const nextSlide = useCallback(() => {
    if (!safeBanners.length) return
    setDirection(1)
    setIndex((prev) => (prev + 1) % safeBanners.length)
  }, [safeBanners.length])

  useEffect(() => {
    if (!safeBanners.length) return
    const timer = window.setInterval(nextSlide, AUTO_PLAY_MS)
    return () => window.clearInterval(timer)
  }, [safeBanners.length, nextSlide])

  if (isLoading) {
    return <BannerSkeleton />
  }

  if (!safeBanners.length) {
    return null
  }

  const current = safeBanners[index]
  if (!current) return null

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl bg-muted"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {/* Image container */}
      <div className="relative aspect-[2/1] w-full sm:aspect-[3/1]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={current.id}
            src={current.image}
            alt={current.title}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {safeBanners.map((banner, dotIndex) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`ไปยังสไลด์ ${dotIndex + 1}`}
            onClick={() => goToSlide(dotIndex)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === dotIndex
                ? 'w-6 bg-white'
                : 'w-2 bg-white/60 hover:bg-white/80'
            )}
          />
        ))}
      </div>
    </motion.div>
  )
}
