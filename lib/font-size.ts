export const FONT_SIZES = [14, 16, 20, 24] as const

export type FontSizePx = (typeof FONT_SIZES)[number]

export const DEFAULT_FONT_SIZE: FontSizePx = 16

export function normalizeFontSize(value: unknown): FontSizePx {
  const n = Number(value)
  if (FONT_SIZES.includes(n as FontSizePx)) {
    return n as FontSizePx
  }
  return DEFAULT_FONT_SIZE
}

/** Tailwind classes for transcript / suggestion panels */
export function fontSizePanelClass(px: FontSizePx): string {
  const map: Record<FontSizePx, string> = {
    14: 'text-sm',
    16: 'text-base',
    20: 'text-xl',
    24: 'text-2xl',
  }
  return `${map[px]} leading-relaxed`
}
