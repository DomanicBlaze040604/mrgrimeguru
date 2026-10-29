// All preset themes for Mr GrimeGuru.
// Each theme overrides CSS variables and optionally adds a banner.

export interface Theme {
  id: string
  label: string
  emoji: string
  description: string
  /** CSS custom-property overrides injected into :root */
  vars: Record<string, string>
  /** Optional ticker text override (null = keep default) */
  ticker: string | null
  /** Optional hero banner (shown above nav) */
  banner: { text: string; bg: string; color: string } | null
  /** Decorative particles/overlay class added to <body> */
  bodyClass: string | null
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    label: 'Default',
    emoji: '✦',
    description: 'The original Mr GrimeGuru look — yellow, black and orange.',
    vars: {},
    ticker: null,
    banner: null,
    bodyClass: null,
  },
  {
    id: 'diwali',
    label: 'Diwali',
    emoji: '🪔',
    description: 'Festive gold, warm saffron and sparkle. Spread the Diwali glow.',
    vars: {
      '--theme-primary': '#f59e0b',
      '--theme-accent': '#dc2626',
      '--theme-bg': '#1a0a00',
      '--theme-surface': '#2d1500',
      '--theme-text': '#fef3c7',
      '--theme-hero-bg': '#7c2d12',
    },
    ticker: '🪔 Diwali Sale — Buy 1 Get 1 FREE on all cleaners! 🪔  ✦  Clean your home for the festival season  ✦  Free shipping above ₹499',
    banner: { text: '🪔 Diwali Special — 1+1 FREE on all cleaners! Shop now →', bg: '#dc2626', color: '#fef3c7' },
    bodyClass: 'theme-diwali',
  },
  {
    id: 'holi',
    label: 'Holi',
    emoji: '🎨',
    description: 'Splash of colours — vibrant pinks, purples and greens.',
    vars: {
      '--theme-primary': '#ec4899',
      '--theme-accent': '#8b5cf6',
      '--theme-bg': '#fdf2f8',
      '--theme-surface': '#ffffff',
      '--theme-text': '#1e1b4b',
      '--theme-hero-bg': '#fce7f3',
    },
    ticker: '🎨 Happy Holi! Clean up the colour with Mr GrimeGuru 🎨  ✦  1+1 offer on all cleaners  ✦  Free shipping above ₹499',
    banner: { text: '🎨 Happy Holi — Order today and clean the colours away!', bg: '#ec4899', color: '#ffffff' },
    bodyClass: 'theme-holi',
  },
  {
    id: 'christmas',
    label: 'Christmas',
    emoji: '🎄',
    description: 'Festive red and green — because clean homes make the best Christmas.',
    vars: {
      '--theme-primary': '#16a34a',
      '--theme-accent': '#dc2626',
      '--theme-bg': '#f0fdf4',
      '--theme-surface': '#ffffff',
      '--theme-text': '#14532d',
      '--theme-hero-bg': '#dcfce7',
    },
    ticker: '🎄 Christmas Sale — 1+1 FREE on all cleaners! Gift a clean home 🎄  ✦  Free shipping above ₹499',
    banner: { text: '🎄 Christmas Special — Buy 1 Get 1 FREE on all cleaners!', bg: '#16a34a', color: '#ffffff' },
    bodyClass: 'theme-christmas',
  },
  {
    id: 'independence',
    label: 'Independence Day',
    emoji: '🇮🇳',
    description: 'Tiranga pride — saffron, white and green.',
    vars: {
      '--theme-primary': '#ff9933',
      '--theme-accent': '#138808',
      '--theme-bg': '#fffbf0',
      '--theme-surface': '#ffffff',
      '--theme-text': '#000080',
      '--theme-hero-bg': '#fff7ed',
    },
    ticker: '🇮🇳 Happy Independence Day! Clean India, Green India 🇮🇳  ✦  1+1 offer on all cleaners  ✦  Made in India',
    banner: { text: '🇮🇳 Independence Day Special — 1+1 FREE on all cleaners! Jai Hind 🇮🇳', bg: '#ff9933', color: '#ffffff' },
    bodyClass: 'theme-independence',
  },
]

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

