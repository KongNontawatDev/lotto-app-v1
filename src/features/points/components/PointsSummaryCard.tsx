import { Progress } from '@/components/ui/progress'
import type { PointsSummary } from '@/types'

interface PointsSummaryCardProps {
  summary?: PointsSummary
}

export const PointsSummaryCard = ({ summary }: PointsSummaryCardProps) => (
  <section className="space-y-4 rounded-3xl border border-border/40 bg-card p-6 text-center shadow-sm">
    <p className="text-sm text-muted-foreground">แต้มสะสมทั้งหมด</p>
    <p className="text-4xl font-bold text-primary">
      {summary?.totalPoints?.toLocaleString('th-TH') ?? '0'}
    </p>
    <Progress value={Math.min((summary?.totalPoints ?? 0) / 10, 100)} />
    <ul className="text-sm text-muted-foreground">
      <li>แต้มไม่สามารถแปลงเป็นเงินสดได้</li>
      <li>แต้มได้รับจากการซื้อสลากและเล่นเกมสะสมของรางวัล</li>
    </ul>
  </section>
)

