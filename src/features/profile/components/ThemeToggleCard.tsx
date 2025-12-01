import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/hooks/useThemeStore'

export const ThemeToggleCard = () => {
  const mode = useThemeStore((state) => state.mode)
  const toggleMode = useThemeStore((state) => state.toggleMode)

  return (
    <div className="rounded-3xl border border-border/40 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">โหมดการแสดงผล</p>
          <p className="text-xs text-muted-foreground">
            {mode === 'light' ? 'โหมดสว่าง' : 'โหมดมืด'}
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={toggleMode}
        >
          {mode === 'light' ? (
            <>
              <Moon size={14} className="mr-2" /> เปิดโหมดกลางคืน
            </>
          ) : (
            <>
              <Sun size={14} className="mr-2" /> กลับสู่โหมดสว่าง
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

