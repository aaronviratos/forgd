import type { ViewStyle } from 'react-native';

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
  accent: 'ember',
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

/**
 * Shadows. Each is two layers: a tight contact shadow plus a wide soft one, which reads as
 * more natural than a single blur. Dark mode uses deeper shadows plus a faint top edge,
 * because a shadow alone barely shows on a dark background.
 */
export type Shadows = {
  /** Lifted cards: the athlete card, the active step card, the Home header. */
  raised: ViewStyle;
  /** Things floating above the page: menu, sheets, rest timer. */
  overlay: ViewStyle;
  /** Accent-tinted glow for the + button. */
  accentGlow: ViewStyle;
};

export type Theme = {
  mode: Mode;
  colors: Colors;
  shadows: Shadows;
  /** Multiplier from the in-app Text size setting. */
  textScale: number;
  prefs: UiPrefs;
};

export function resolveMode(pref: ThemePref, system: Mode | null | undefined): Mode {
  if (pref === 'light' || pref === 'dark') return pref;
  return system === 'dark' ? 'dark' : 'light';
}

function buildShadows(mode: Mode, accent: string): Shadows {
  const glow = `0 6px 16px ${accent}${mode === 'light' ? '59' : '66'}`; // ~35-40% alpha
  return mode === 'light'
    ? {
        raised: { boxShadow: '0 1px 2px rgba(22,20,17,0.10), 0 6px 18px rgba(22,20,17,0.10)' },
        overlay: { boxShadow: '0 2px 6px rgba(22,20,17,0.10), 0 18px 44px rgba(22,20,17,0.24)' },
        accentGlow: { boxShadow: `0 1px 2px rgba(22,20,17,0.18), ${glow}` },
      }
    : {
        raised: { boxShadow: '0 1px 2px rgba(0,0,0,0.55), 0 8px 22px rgba(0,0,0,0.45)' },
        overlay: { boxShadow: '0 4px 12px rgba(0,0,0,0.55), 0 24px 56px rgba(0,0,0,0.65)' },
        accentGlow: { boxShadow: `0 1px 2px rgba(0,0,0,0.6), ${glow}` },
      };
}

export function buildTheme(prefs: UiPrefs, system: Mode | null | undefined): Theme {
  const mode = resolveMode(prefs.theme, system);
  const s = SURFACES[prefs.surface][mode];
  const a = ACCENTS[prefs.accent][mode];
  const st = STATUS[mode];
  return {
    mode,
    shadows: buildShadows(mode, a.fill),
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

/**
 * Reads saved appearance settings (profiles.ui), keeping only valid values, so an old
 * or hand-edited value can never break the app. Unknown or missing keys are left out.
 */
export function parseUiPrefs(json: string | null | undefined): Partial<UiPrefs> {
  let raw: unknown;
  try {
    raw = JSON.parse(json ?? '{}');
  } catch {
    return {};
  }
  if (!raw || typeof raw !== 'object') return {};
  const r = raw as Record<string, unknown>;
  const out: Partial<UiPrefs> = {};
  if (r.theme === 'system' || r.theme === 'light' || r.theme === 'dark') out.theme = r.theme;
  if (typeof r.accent === 'string' && r.accent in ACCENTS) out.accent = r.accent as AccentKey;
  if (typeof r.surface === 'string' && r.surface in SURFACES) out.surface = r.surface as SurfaceKey;
  if (typeof r.textSize === 'string' && r.textSize in TEXT_SIZES) {
    out.textSize = r.textSize as TextSize;
  }
  return out;
}
