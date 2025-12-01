import { useStore } from 'zustand'

import { themeStore, type ThemeStore } from '@/stores/theme-store'

export const useThemeStore = <T,>(selector: (state: ThemeStore) => T) =>
  useStore(themeStore, selector)
