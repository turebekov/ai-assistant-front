/** Typography scale (px / line-height) — Inter; weights 400–800 */
export const typography = {
  xs: { size: 12, lineHeight: 16 },
  sm: { size: 14, lineHeight: 20 },
  base: { size: 16, lineHeight: 24 },
  lg: { size: 18, lineHeight: 28 },
  xl: { size: 20, lineHeight: 30 },
  '2xl': { size: 24, lineHeight: 32 },
  '3xl': { size: 30, lineHeight: 38 },
  '4xl': { size: 36, lineHeight: 44 },
  '5xl': { size: 48, lineHeight: 56 },
  '6xl': { size: 60, lineHeight: 68 },
} as const

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const
