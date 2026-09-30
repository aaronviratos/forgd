/**
 * The brand, in one place. The final name is still pending (docs/01-product.md),
 * so nothing else in the app should spell it out.
 */
export const BRAND = {
  /** Shown on the home screen icon, in the store and in copy. */
  name: 'FORGD',
  /** The wordmark is split so the last letter can take the accent color. */
  wordmark: { main: 'FORG', accent: 'D' },
  /** Deep link scheme, e.g. forgd://today. Lowercase letters only. */
  scheme: 'forgd',
} as const;

/**
 * Store identity. This must never change after the first store release,
 * so it is deliberately not tied to the brand name.
 */
export const BUNDLE_ID = 'com.kefalos.app';
