/**
 * Legibility guard: every theme a user can pick must pass WCAG AA.
 * 15 accents x 5 backgrounds x light/dark = 150 themes, each checked pair by pair.
 */
import { contrast, mix } from '@/core/color';

import { ACCENT_KEYS, PLATE_GLOW, SURFACE_KEYS } from './palette';
import { buildTheme, type Colors, DEFAULT_UI_PREFS } from './theme';

const TEXT = 4.5; // normal text
const UI = 3; // control borders and non-text indicators (WCAG 1.4.11)

type Pair = [fg: keyof Colors, bg: keyof Colors, min: number];

const PAIRS: Pair[] = [
  // Text on app backgrounds
  ...(['ink', 'muted', 'accentText', 'ok', 'warn', 'bad', 'steel'] as const).flatMap((fg) =>
    (['bg', 'surface', 'sunk'] as const).map((bg): Pair => [fg, bg, TEXT]),
  ),
  // Labels on fills and tinted backgrounds
  ['accentInk', 'accent', TEXT],
  ['ink', 'accentSoft', TEXT],
  ['ink', 'okSoft', TEXT],
  ['ink', 'warnSoft', TEXT],
  ['ink', 'badSoft', TEXT],
  ['ok', 'okSoft', TEXT],
  ['warn', 'warnSoft', TEXT],
  ['bad', 'badSoft', TEXT],
  // The dark plate (top bar, card, Home header)
  ['plateInk', 'plate', TEXT],
  ['plateMuted', 'plate', TEXT],
  ['accentOnPlate', 'plate', TEXT],
  // Control borders and accent indicators must be findable
  ...(['bg', 'surface', 'sunk'] as const).map((bg): Pair => ['lineStrong', bg, UI]),
  ...(['bg', 'surface'] as const).map((bg): Pair => ['accent', bg, UI]),
];

const combos = ACCENT_KEYS.flatMap((accent) =>
  SURFACE_KEYS.flatMap((surface) =>
    (['light', 'dark'] as const).map((mode) => ({ accent, surface, mode })),
  ),
);

describe('theme contrast', () => {
  it.each(combos)('$accent on $surface ($mode) is legible', ({ accent, surface, mode }) => {
    const { colors } = buildTheme({ ...DEFAULT_UI_PREFS, accent, surface, theme: mode }, null);
    const failures = PAIRS.filter(([fg, bg, min]) => contrast(colors[fg], colors[bg]) < min).map(
      ([fg, bg, min]) =>
        `${fg} on ${bg}: ${contrast(colors[fg], colors[bg]).toFixed(2)} (needs ${min})`,
    );
    // Plate text stays readable where the accent glow is strongest (Home header).
    const glow = mix(colors.accentOnPlate, colors.plate, PLATE_GLOW);
    for (const fg of ['plateInk', 'plateMuted'] as const) {
      if (contrast(colors[fg], glow) < TEXT) {
        failures.push(`${fg} on the plate glow: ${contrast(colors[fg], glow).toFixed(2)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

describe('color math', () => {
  it('matches known WCAG values', () => {
    expect(contrast('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });
});
