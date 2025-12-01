import { useEffect } from 'react'

import { themeTokens } from '@/config/theme'
import { useThemeStore } from '@/hooks/useThemeStore'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const mode = useThemeStore((state) => state.mode)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)

    const tokens = themeTokens[mode]
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [mode])

  return children
}
