import { createFileRoute } from '@tanstack/react-router'

import { LotteryPage } from '@/features/lottery/LotteryPage'

export const Route = createFileRoute('/lottery')({
  component: LotteryPage,
})
