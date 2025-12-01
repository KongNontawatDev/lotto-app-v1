import { createStore } from 'zustand/vanilla'

import type { ThemeMode } from '@/config/theme'

const STORAGE_KEY = 'gentung-theme-mode'

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null
  if (stored) return stored
  return 'light'
}

export type ThemeStore = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

export const themeStore = createStore<ThemeStore>((set, get) => ({
  mode: getInitialMode(),
  setMode: (mode) => {
    set({ mode })
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, mode)
    }
  },
  toggleMode: () => {
    const nextMode = get().mode === 'light' ? 'dark' : 'light'
    get().setMode(nextMode)
  },
}))
