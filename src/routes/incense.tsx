import { createFileRoute } from '@tanstack/react-router'
import { PageTransition } from '@/components/motion/PageTransition'
import { LuckyIncensePage } from '@/features/incense/components/LuckyIncensePage'

export const Route = createFileRoute('/incense')({
  component: IncensePage,
})

function IncensePage() {
  return (
    <PageTransition>
      <LuckyIncensePage />
    </PageTransition>
  )
}
