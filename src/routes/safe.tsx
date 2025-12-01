import { createFileRoute } from '@tanstack/react-router'

import { SafePage } from '@/features/safe/SafePage'

export const Route = createFileRoute('/safe')({
  component: SafePage,
})
