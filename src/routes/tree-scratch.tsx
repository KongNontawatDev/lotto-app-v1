import { createFileRoute } from '@tanstack/react-router'
import { PageTransition } from '@/components/motion/PageTransition'
import { TreeScratchPage } from '@/features/tree-scratch/components/TreeScratchPage'

export const Route = createFileRoute('/tree-scratch')({
  component: TreeScratchPageRoute,
})

function TreeScratchPageRoute() {
  return (
    <PageTransition>
      <TreeScratchPage />
    </PageTransition>
  )
}
