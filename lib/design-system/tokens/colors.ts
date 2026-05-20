/**
 * JobTap design tokens — IvyPanda-inspired orange CTA + navy tech surfaces.
 * Source of truth for JS/TS; mirrors `app/globals.css` CSS variables.
 */
export const colors = {
  primary: '#FF8516',
  primaryHover: '#EA760E',
  primaryActive: '#CF680C',
  primaryLight: '#FFF5EC',
  primaryBorder: '#FFC896',
  /** bg-dark, auth/CTA chrome */
  dark: '#00756A',
  /** Primary heading / strong UI text on light surfaces */
  heading: '#0F1724',
  darkMid: '#1A2540',
  darkLight: '#243050',
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  bgWhite: '#FFFFFF',
  /** App pages / body (`--background`, `bg-background`) */
  background: '#F6FAFF',
  bgLight: '#F9FAFB',
  bgCard: '#FFFFFF',
  /** Site footer strip (globals.css `--footer-background`) */
  footerBackground: '#EFF0F0',
  border: '#E5E7EB',
  borderFocus: '#FF8516',
  /** Header, footer, sidebar, large blog titles */
  navText: '#163141',
  navTextHover: '#0F2330',
  link: '#2F65DA',
  linkHover: '#2547AD',
  success: '#10B981',
  successLight: '#ECFDF5',
  error: '#EF4444',
  errorLight: '#FEF2F2',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
  /** Marketing landing — mint bands + teal strip (globals.css `--landing-*`) */
  landingTeal: '#00756A',
  landingMint: '#E5F5F4',
  landingMintSoft: '#F2FAF9',
  landingHeroFade: '#E5F5F4',
} as const
