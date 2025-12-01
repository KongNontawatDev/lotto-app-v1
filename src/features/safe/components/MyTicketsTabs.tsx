import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyMyTickets } from '@/components/common/EmptyState'
import type { MyTicket } from '@/types'
import { formatThaiDate, formatTicketNumber } from '@/utils'

interface MyTicketsTabsProps {
  tickets: MyTicket[]
  isLoading?: boolean
}

const statusColors: Record<MyTicket['status'], string> = {
  ยังไม่ชำระเงิน: 'bg-amber-100 text-amber-800',
  สำเร็จ: 'bg-emerald-100 text-emerald-700',
  รอออกรางวัล: 'bg-sky-100 text-sky-700',
  ไม่ถูกรางวัล: 'bg-slate-200 text-slate-600',
  ถูกรางวัล: 'bg-purple-100 text-purple-700',
}

export const MyTicketsTabs = ({ tickets, isLoading }: MyTicketsTabsProps) => {
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const currentTickets = safeTickets.filter(
    (ticket) => new Date(ticket.drawDate) >= new Date(),
  )
  const pastTickets = safeTickets.filter(
    (ticket) => new Date(ticket.drawDate) < new Date(),
  )

  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-muted/60">
        <TabsTrigger value="current">งวดปัจจุบัน</TabsTrigger>
        <TabsTrigger value="history">งวดย้อนหลัง</TabsTrigger>
      </TabsList>
      <TabsContent value="current">
        <TicketList items={currentTickets} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="history">
        <TicketList items={pastTickets} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  )
}

const TicketList = ({
  items,
  isLoading,
}: {
  items: MyTicket[]
  isLoading?: boolean
}) => {
  if (isLoading) {
    return (
      <ul className="mt-4 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className="rounded-3xl border border-border/40 bg-card p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-32 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (!items.length) {
    return (
      <div className="mt-4">
        <EmptyMyTickets />
      </div>
    )
  }
  return (
    <ul className="mt-4 space-y-4">
      {items.map((ticket) => (
        <li
          key={ticket.id}
          className="rounded-3xl border border-border/40 bg-card p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={ticket.image}
                alt={ticket.number}
                className="h-20 w-32 rounded-2xl border border-border/40 object-cover"
              />
              <div>
                <p className="text-sm text-muted-foreground">
                  งวด {formatThaiDate(ticket.drawDate)}
                </p>
                <p className="text-lg font-semibold tracking-[0.4em]">
                  {formatTicketNumber(ticket.number)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ซื้อเมื่อ {formatThaiDate(ticket.purchaseDate)}
                </p>
              </div>
            </div>
            <span
              className={`self-start rounded-full px-4 py-1 text-xs font-semibold ${statusColors[ticket.status]}`}
            >
              {ticket.status}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}

