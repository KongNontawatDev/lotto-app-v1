export type LotteryKind = 'single' | 'set'

export interface LotteryTicket {
  id: string
  number: string
  drawDate: string
  price: number
  type: LotteryKind
  remaining: number
  image: string
  description?: string
}

export type FilterValue = 'all' | LotteryKind

