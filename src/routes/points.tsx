import { createFileRoute } from '@tanstack/react-router'

import { PointsPage } from '@/features/points/PointsPage'

export const Route = createFileRoute('/points')({
  component: PointsPage,
})
