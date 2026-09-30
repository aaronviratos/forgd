/** Spacing, radius and elevation from docs/02-design-system.md. Use these, never raw numbers. */

export const space = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  /** Side padding of every screen. */
  gutter: 16,
} as const;

export const radius = {
  input: 8,
  card: 14,
  sheet: 20,
  pill: 999,
} as const;

/** Minimum touch target (Apple and Google guidance is 44pt/48dp; we use 48 for primary actions). */
export const touch = {
  min: 44,
  primary: 48,
} as const;

/** Elevation has three levels: flat (outlined), raised, overlay. Shadows live in the theme
 * (theme.shadows) because light and dark mode need different ones. */

/** Durations in ms (docs/02, Motion). */
export const motion = {
  /** Section content sliding in from the side you tapped. */
  slideIn: 300,
  slideOut: 190,
  /** Page entrance when switching tabs (fade up 8pt). */
  pageFade: 260,
  /** Menu dropping from the top bar. */
  menu: 220,
  /** Half of the card flip. */
  flipHalf: 140,
} as const;
