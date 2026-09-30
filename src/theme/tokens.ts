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

/** Only three levels: flat (outlined), raised, overlay. */
export const elevation = {
  flat: {},
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  overlay: {
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
} as const;

export const motion = {
  slideIn: 300,
  slideOut: 190,
  pageFade: 260,
  flipHalf: 140,
} as const;
