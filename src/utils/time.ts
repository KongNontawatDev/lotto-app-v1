export const formatThaiDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatCountdown = (ms: number) => {
  const totalSeconds = Math.max(Math.floor(ms / 1000), 0)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

export const createCountdownTicker = (
  durationMs: number,
  startedAt: number,
) => {
  const elapsed = Date.now() - startedAt
  return Math.max(durationMs - elapsed, 0)
}
