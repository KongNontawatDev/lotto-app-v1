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

export interface BannerItem {
  id: string
  title: string
  subtitle: string
  image: string
  href?: string
}

export interface LatestResult {
  drawDate: string
  firstPrize: string
  lastTwoDigits: string
  frontThree: string[]
  backThree: string[]
}

export interface RecommendedTicket extends LotteryTicket {
  highlight?: string
}

export interface CartItem extends LotteryTicket {
  cartId: string
  reservedAt: number
  quantity: number
}

export interface MyTicket {
  id: string
  number: string
  drawDate: string
  purchaseDate: string
  status:
    | 'ยังไม่ชำระเงิน'
    | 'สำเร็จ'
    | 'รอออกรางวัล'
    | 'ไม่ถูกรางวัล'
    | 'ถูกรางวัล'
  image: string
}

export interface PointsSummary {
  totalPoints: number
  description: string[]
}

export interface PointsHistoryItem {
  id: string
  title: string
  date: string
  points: number
}

export interface RewardItem {
  id: string
  name: string
  pointsRequired: number
  image: string
}

export interface PointsPayload {
  summary: PointsSummary
  history: PointsHistoryItem[]
  rewards: RewardItem[]
}

export interface UserProfile {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  loyaltyLevel: string
}

export type FilterValue = 'all' | LotteryKind
