export type ThemeMode = 'light' | 'dark'

export const BRAND = {
  primary: '#3024AE',
  secondary: '#C86CD7',
  accent: '#4DD1FF',
}

export const lightTheme = {
  '--background': '#F7F7FB',
  '--foreground': '#0F1021',
  '--card': '#FFFFFF',
  '--card-foreground': '#0F1021',
  '--muted': '#ECECF4',
  '--muted-foreground': '#5C5F7B',
  '--border': '#E0E1EE',
  '--primary': BRAND.primary,
  '--primary-foreground': '#FFFFFF',
  '--secondary': BRAND.secondary,
  '--secondary-foreground': '#FFFFFF',
  '--accent': BRAND.accent,
  '--accent-foreground': '#0F1021',
}

export const darkTheme = {
  '--background': '#070711',
  '--foreground': '#F5F5FF',
  '--card': '#111125',
  '--card-foreground': '#F5F5FF',
  '--muted': '#1C1C35',
  '--muted-foreground': '#A1A2C7',
  '--border': '#2A2B45',
  '--primary': BRAND.primary,
  '--primary-foreground': '#FFFFFF',
  '--secondary': BRAND.secondary,
  '--secondary-foreground': '#FFFFFF',
  '--accent': BRAND.accent,
  '--accent-foreground': '#0F1021',
}

export const themeTokens: Record<ThemeMode, Record<string, string>> = {
  light: lightTheme,
  dark: darkTheme,
}
