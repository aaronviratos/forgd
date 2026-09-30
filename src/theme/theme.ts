import { mix } from '@/core/color';

import {
  ACCENT_INK,
  ACCENTS,
  type AccentKey,
  type Mode,
  PLATE_INK,
  STATUS,
  STEEL,
  SURFACES,
  type SurfaceKey,
} from './palette';
import { TEXT_SIZES, type TextSize } from './typography';

export type ThemePref = 'system' | 'light' | 'dark';

/** What the user picks in Settings. Stored with their settings (docs/06, settings.ui). */
export type UiPrefs = {
  theme: ThemePref;
  accent: AccentKey;
  surface: SurfaceKey;
  textSize: TextSize;
};

export const DEFAULT_UI_PREFS: UiPrefs = {
  theme: 'system',
  accent: 'blaze',
  surface: 'concrete',
  textSize: 'standard',
};

export type Colors = {
  bg: string;
  surface: string;
  sunk: string;
  ink: string;
  muted: string;
  line: string;
  lineStrong: string;
  /** Accent fill for buttons, progress, active states. */
  accent: string;
  /** Accent-colored text and icons on bg, surface and sunk. */
  accentText: string;
  /** Text on an accent fill. */
  accentInk: string;
  /** Selected backgrounds (accent tinted into the surface). */
  accentSoft: string;
  plate: string;
  plateInk: string;
  plateMuted: string;
  plateLine: string;
  /** Accent on the dark plate (wordmark D, Coach pill). Always the bright variant. */
  accentOnPlate: string;
  ok: string;
  okSoft: string;
  warn: string;
  warnSoft: string;
  bad: string;
  badSoft: string;
  steel: string;
};

export type Theme = {
  mode: Mode;
  colors: Colors;
  /** Multiplier from the in-app Text size setting. */
  textScale: number;
  prefs: UiPrefs;
};

export function resolveMode(pref: ThemePref, system: Mode | null | undefined): Mode {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}

export function buildTheme(prefs: UiPrefs, system: Mode | null | undefined): Theme {
  const mode = resolveMode(prefs.theme, system);
  const s = SURFACES[prefs.surface][mode];
  const a = ACCENTS[prefs.accent][mode];
  const st = STATUS[mode];
  return {
    mode,
    textScale: TEXT_SIZES[prefs.textSize].scale,
    prefs,
    colors: {
      ...s,
      accent: a.fill,
      accentText: a.text,
      accentInk: ACCENT_INK[mode],
      accentSoft: mix(a.fill, s.surface, mode === 'light' ? 0.16 : 0.22),
      plateInk: PLATE_INK.ink,
      plateMuted: PLATE_INK.muted,
      plateLine: PLATE_INK.line,
      accentOnPlate: ACCENTS[prefs.accent].dark.fill,
      ok: st.ok.color,
      okSoft: st.ok.soft,
      warn: st.warn.color,
      warnSoft: st.warn.soft,
      bad: st.bad.color,
      badSoft: st.bad.soft,
      steel: STEEL[mode],
    },
  };
}
