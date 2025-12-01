import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import {
  Inbox,
  Search,
  ShoppingCart,
  Gift,
  History,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

/**
 * Empty State Component หลัก
 */
export const EmptyState = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const actionButton = action && (
    <Button
      variant="outline"
      className="rounded-full"
      onClick={action.onClick}
      asChild={!!action.href}
    >
      {action.href ? (
        <Link to={action.href}>{action.label}</Link>
      ) : (
        <span>{action.label}</span>
      )}
    </Button>
  )

  return (
    <Empty className={cn('py-12', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && (
          <EmptyDescription>{description}</EmptyDescription>
        )}
      </EmptyHeader>
      {actionButton && <EmptyContent>{actionButton}</EmptyContent>}
    </Empty>
  )
}

/**
 * Empty State สำหรับลอตเตอรี่
 */
export const EmptyLottery = ({
  searchTerm,
  className,
}: {
  searchTerm?: string
  className?: string
}) => {
  return (
    <EmptyState
      icon={Search}
      title="ไม่พบลอตเตอรี่ที่ตรงกับเงื่อนไข"
      description={
        searchTerm
          ? `ไม่พบลอตเตอรี่ที่ตรงกับ "${searchTerm}"`
          : 'ลองเปลี่ยนตัวกรองหรือคำค้นหาใหม่'
      }
      className={className}
    />
  )
}

/**
 * Empty State สำหรับตะกร้า
 */
export const EmptyCart = ({ className }: { className?: string }) => {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="ยังไม่มีลอตเตอรี่ในตะกร้า"
      description="เพิ่มลอตเตอรี่ลงตะกร้าเพื่อเริ่มต้น"
      action={{
        label: 'ไปเลือกลอตเตอรี่',
        href: '/lottery',
      }}
      className={className}
    />
  )
}

/**
 * Empty State สำหรับประวัติแต้ม
 */
export const EmptyPointsHistory = ({
  className,
}: {
  className?: string
}) => {
  return (
    <EmptyState
      icon={History}
      title="ยังไม่มีประวัติการได้รับแต้ม"
      description="เริ่มต้นสะสมแต้มจากการซื้อลอตเตอรี่"
      action={{
        label: 'ไปเลือกลอตเตอรี่',
        href: '/lottery',
      }}
      className={className}
    />
  )
}

/**
 * Empty State สำหรับของรางวัล
 */
export const EmptyRewards = ({ className }: { className?: string }) => {
  return (
    <EmptyState
      icon={Gift}
      title="ยังไม่มีของรางวัล"
      description="ของรางวัลจะปรากฏที่นี่เมื่อพร้อม"
      className={className}
    />
  )
}

/**
 * Empty State สำหรับตั๋วของฉัน
 */
export const EmptyMyTickets = ({ className }: { className?: string }) => {
  return (
    <EmptyState
      icon={Package}
      title="ยังไม่มีตั๋ว"
      description="ตั๋วที่คุณซื้อจะปรากฏที่นี่"
      action={{
        label: 'ไปเลือกลอตเตอรี่',
        href: '/lottery',
      }}
      className={className}
    />
  )
}

/**
 * Empty State สำหรับข้อมูลทั่วไป
 */
export const EmptyData = ({
  title = 'ไม่พบข้อมูล',
  description = 'ลองใหม่อีกครั้งในภายหลัง',
  className,
}: {
  title?: string
  description?: string
  className?: string
}) => {
  return (
    <EmptyState
      icon={Inbox}
      title={title}
      description={description}
      className={className}
    />
  )
}

