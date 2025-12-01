import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

/**
 * Loading component สำหรับแสดงสถานะการโหลด
 */
export const Loading = ({
  className,
  size = 'md',
  text,
  fullScreen = false,
}: LoadingProps) => {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullScreen && 'min-h-screen',
        className,
      )}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary',
          sizeMap[size],
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )

  return content
}

/**
 * Page Loading - สำหรับโหลดทั้งหน้า
 */
export const PageLoading = ({
  text = 'กำลังโหลดข้อมูล...',
  className,
}: Omit<LoadingProps, 'fullScreen'>) => {
  return (
    <Loading
      size="lg"
      text={text}
      fullScreen
      className={cn('py-16', className)}
    />
  )
}

/**
 * Component Loading - สำหรับโหลด component
 */
export const ComponentLoading = ({
  text = 'กำลังโหลด...',
  className,
  size = 'md',
}: Omit<LoadingProps, 'fullScreen'>) => {
  return (
    <Loading
      size={size}
      text={text}
      className={cn('py-8', className)}
    />
  )
}

