/**
 * Type scale from docs/02-design-system.md.
 * One typeface everywhere, Atkinson Hyperlegible Next, designed by the Braille Institute
 * so similar letters (I, l, 1; O, 0; b, d) are easy to tell apart.
 * Saira Stencil One is used only for the brand wordmark.
 */

import type { TextStyle } from 'react-native';

/** Font files are loaded in the root layout; custom fonts need one family per weight. */
export const FONT_FILES = {
  400: 'AtkinsonHyperlegibleNext_400Regular',
  500: 'AtkinsonHyperlegibleNext_500Medium',
  600: 'AtkinsonHyperlegibleNext_600SemiBold',
  700: 'AtkinsonHyperlegibleNext_700Bold',
  800: 'AtkinsonHyperlegibleNext_800ExtraBold',
} as const;

export const WORDMARK_FONT = 'SairaStencilOne_400Regular';

export type Weight = keyof typeof FONT_FILES;

export type TextVariant =
  | 'display'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'body'
  | 'bodyStrong'
  | 'small'
  | 'caption'
  | 'overline';

type Spec = { size: number; line: number; weight: Weight; upper?: boolean; tracking?: number };

/**
 * Sizes at the "Standard" text size. Two sizes are slightly above the spec for legibility:
 * caption 12.5 -> 13 and overline 11 -> 12. Nothing a user reads is below 13.
 */
export const TYPE_SCALE: Record<TextVariant, Spec> = {
  display: { size: 34, line: 40, weight: 800 },
  title1: { size: 28, line: 34, weight: 800 },
  title2: { size: 24, line: 30, weight: 800 },
  title3: { size: 20, line: 26, weight: 700 },
  body: { size: 16, line: 24, weight: 400 },
  bodyStrong: { size: 16, line: 24, weight: 600 },
  small: { size: 14, line: 20, weight: 400 },
  caption: { size: 13, line: 18, weight: 600 },
  overline: { size: 12, line: 16, weight: 700, upper: true, tracking: 0.06 },
};

/** The in-app Text size setting. Works on top of the phone's own text size setting. */
export type TextSize = 'standard' | 'large' | 'xlarge';
export const TEXT_SIZES: Record<TextSize, { label: string; scale: number }> = {
  standard: { label: 'Standard', scale: 1 },
  large: { label: 'Large', scale: 1.15 },
  xlarge: { label: 'Largest', scale: 1.3 },
};

/**
 * The phone's accessibility text size still applies, up to this multiple, so very large
 * settings stay readable without breaking layouts.
 */
export const MAX_OS_FONT_SCALE = 1.6;

/** Inputs never go below 16pt (smaller text makes iOS zoom the page). */
export const MIN_INPUT_SIZE = 16;

export function textStyle(variant: TextVariant, scale: number): TextStyle {
  const s = TYPE_SCALE[variant];
  const size = Math.round(s.size * scale * 10) / 10;
  return {
    fontFamily: FONT_FILES[s.weight],
    fontSize: size,
    lineHeight: Math.round(s.line * scale),
    ...(s.upper ? { textTransform: 'uppercase' } : null),
    ...(s.tracking ? { letterSpacing: s.tracking * size } : null),
  };
}
