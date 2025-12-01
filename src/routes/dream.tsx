import { createFileRoute } from '@tanstack/react-router'
import { PageTransition } from '@/components/motion/PageTransition'
import { DreamToNumbersPage } from '@/features/dream/components/DreamToNumbersPage'

export const Route = createFileRoute('/dream')({
  component: DreamPage,
})

function DreamPage() {
  return (
    <PageTransition>
      <DreamToNumbersPage />
    </PageTransition>
  )
}
