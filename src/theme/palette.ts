/**
 * Raw colors from docs/02-design-system.md and the v2 prototype, tuned for legibility.
 *
 * Every text color here passes WCAG AA contrast on every background it can appear on;
 * `palette.test.ts` checks every combination, so a failing edit will break the build.
 * Where the prototype's color failed, it was darkened (light mode) or lightened (dark mode)
 * by the smallest step that passes, keeping its hue.
 */

export type Mode = 'light' | 'dark';

export type AccentKey =
  | 'blaze'
  | 'copper'
  | 'gold'
  | 'lime'
  | 'olive'
  | 'forest'
  | 'teal'
  | 'sky'
  | 'steel'
  | 'royal'
  | 'violet'
  | 'magenta'
  | 'crimson'
  | 'slate';

type AccentMode = {
  /** Fills: buttons, progress bars, active tab. Labels on it use `accentInk`. */
  fill: string;
  /** Accent-colored text and icons on app backgrounds (links, active labels). */
  text: string;
};

export const ACCENTS: Record<AccentKey, { label: string; light: AccentMode; dark: AccentMode }> = {
  // Light `text` values are darker than `fill` so accent text stays readable on light backgrounds.
  blaze: {
    label: 'Blaze',
    light: { fill: '#BF4509', text: '#9D3907' },
    dark: { fill: '#FF6B1A', text: '#FF6B1A' },
  },
  copper: {
    label: 'Copper',
    light: { fill: '#9C4B22', text: '#8E441F' },
    dark: { fill: '#E08D5F', text: '#E08D5F' },
  },
  gold: {
    label: 'Gold',
    light: { fill: '#8F6200', text: '#785200' },
    dark: { fill: '#E8B64A', text: '#E8B64A' },
  },
  lime: {
    label: 'Lime',
    light: { fill: '#4F7300', text: '#446300' },
    dark: { fill: '#B4DE4E', text: '#B4DE4E' },
  },
  olive: {
    label: 'Olive',
    light: { fill: '#5A6B22', text: '#51601F' },
    dark: { fill: '#A7B464', text: '#A7B464' },
  },
  forest: {
    label: 'Forest',
    light: { fill: '#23703F', text: '#206639' },
    dark: { fill: '#6BD192', text: '#6BD192' },
  },
  teal: {
    label: 'Teal',
    light: { fill: '#0F766E', text: '#0D655F' },
    dark: { fill: '#4FD1C5', text: '#4FD1C5' },
  },
  sky: {
    label: 'Sky',
    light: { fill: '#0B6FA8', text: '#095E8F' },
    dark: { fill: '#6CC6F5', text: '#6CC6F5' },
  },
  steel: {
    label: 'Steel blue',
    light: { fill: '#2F5D8A', text: '#2F5C89' },
    dark: { fill: '#7FB0DE', text: '#7FB0DE' },
  },
  royal: {
    label: 'Royal',
    light: { fill: '#3B47C4', text: '#3B47C4' },
    dark: { fill: '#8F9CFF', text: '#8F9CFF' },
  },
  violet: {
    label: 'Violet',
    light: { fill: '#6B3CC4', text: '#6A3BC2' },
    dark: { fill: '#B79CFF', text: '#B79CFF' },
  },
  magenta: {
    label: 'Magenta',
    light: { fill: '#A8206F', text: '#A51F6D' },
    dark: { fill: '#F272C0', text: '#F272C0' },
  },
  crimson: {
    label: 'Crimson',
    light: { fill: '#B0262F', text: '#AB252E' },
    dark: { fill: '#F0626B', text: '#F0626B' },
  },
  slate: {
    label: 'Slate',
    light: { fill: '#4B5563', text: '#4B5563' },
    dark: { fill: '#A9B4C2', text: '#A9B4C2' },
  },
};

export const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[];

/** Text on accent fills: white in light mode, near-black in dark mode (dark-mode fills are bright). */
export const ACCENT_INK: Record<Mode, string> = { light: '#FFFFFF', dark: '#150A02' };

export type SurfaceKey = 'concrete' | 'paper' | 'white' | 'midnight' | 'moss';

export type SurfaceMode = {
  /** App background. */
  bg: string;
  /** Cards and sheets. */
  surface: string;
  /** Inputs and wells. */
  sunk: string;
  /** Primary text. */
  ink: string;
  /** Secondary text (still AA on every background). */
  muted: string;
  /** Decorative dividers and card outlines. Never the only boundary of a control. */
  line: string;
  /** Borders of inputs and other controls: at least 3:1 so fields are easy to find. */
  lineStrong: string;
  /** Dark panels: top bar, athlete card, Home header, menu. Dark in both modes. */
  plate: string;
};

export const SURFACES: Record<
  SurfaceKey,
  { label: string; light: SurfaceMode; dark: SurfaceMode }
> = {
  concrete: {
    label: 'Concrete',
    light: {
      bg: '#D6D3CA',
      surface: '#ECE9E2',
      sunk: '#E0DDD5',
      ink: '#1C1F20',
      muted: '#585C56',
      line: '#A7A398',
      lineStrong: '#77746C',
      plate: '#24292B',
    },
    dark: {
      bg: '#131617',
      surface: '#1D2123',
      sunk: '#101314',
      ink: '#E6E2D8',
      muted: '#8E928A',
      line: '#363C3F',
      lineStrong: '#6A6F71',
      plate: '#252A2C',
    },
  },
  paper: {
    label: 'Paper',
    light: {
      bg: '#F3EFE7',
      surface: '#FFFDF8',
      sunk: '#EEE9DF',
      ink: '#1F1D1A',
      muted: '#6B665C',
      line: '#D9D2C3',
      lineStrong: '#878279',
      plate: '#2A2724',
    },
    dark: {
      bg: '#171513',
      surface: '#221F1C',
      sunk: '#141210',
      ink: '#EDE8DF',
      muted: '#A39C90',
      line: '#3A3530',
      lineStrong: '#6F6C68',
      plate: '#262320',
    },
  },
  white: {
    label: 'White',
    light: {
      bg: '#F4F5F7',
      surface: '#FFFFFF',
      sunk: '#F0F2F5',
      ink: '#15181B',
      muted: '#5F6770',
      line: '#DADFE5',
      lineStrong: '#85888C',
      plate: '#1C2024',
    },
    dark: {
      bg: '#0F1113',
      surface: '#181B1E',
      sunk: '#0C0E10',
      ink: '#E8EAED',
      muted: '#9097A0',
      line: '#2C3136',
      lineStrong: '#65696C',
      plate: '#1C2024',
    },
  },
  midnight: {
    label: 'Midnight',
    light: {
      bg: '#E6EAF0',
      surface: '#F7F9FC',
      sunk: '#EDF1F6',
      ink: '#151B26',
      muted: '#5A6577',
      line: '#C9D2DE',
      lineStrong: '#7F848C',
      plate: '#1B2433',
    },
    dark: {
      bg: '#0E131B',
      surface: '#161D28',
      sunk: '#0B1017',
      ink: '#E3E8F0',
      muted: '#8E9AAE',
      line: '#2A3445',
      lineStrong: '#646B77',
      plate: '#1A2331',
    },
  },
  moss: {
    label: 'Moss',
    light: {
      bg: '#E4E8E1',
      surface: '#F6F8F4',
      sunk: '#EBEFE8',
      ink: '#172019',
      muted: '#5A6659',
      line: '#C7D0C4',
      lineStrong: '#7D837B',
      plate: '#1F2A22',
    },
    dark: {
      bg: '#101511',
      surface: '#18201A',
      sunk: '#0C110D',
      ink: '#E3EAE3',
      muted: '#8FA092',
      line: '#2A362D',
      lineStrong: '#666E68',
      plate: '#1B241E',
    },
  },
};

export const SURFACE_KEYS = Object.keys(SURFACES) as SurfaceKey[];

/** Text on the dark plate, same in both modes. */
export const PLATE_INK = { ink: '#ECE8DE', muted: '#A2A69E', line: '#3B4245' };

/** Status colors: wins, watch items, alerts. Light values darkened slightly for contrast. */
export const STATUS: Record<
  Mode,
  Record<'ok' | 'warn' | 'bad', { color: string; soft: string }>
> = {
  light: {
    ok: { color: '#2C6532', soft: '#D9E8D3' },
    warn: { color: '#7C510A', soft: '#F3E4C4' },
    bad: { color: '#A72A21', soft: '#F4D7D2' },
  },
  dark: {
    ok: { color: '#7DC47F', soft: '#1B2D1C' },
    warn: { color: '#E6B04F', soft: '#352914' },
    bad: { color: '#F06A5E', soft: '#3A1B18' },
  },
};

/** Secondary data color (low values, chips). */
export const STEEL: Record<Mode, string> = { light: '#4B5828', dark: '#A7B464' };

/** Card border color by rank (docs/06). Platinum and Diamond also get the foil animation. */
export const RANK_COLORS = {
  rookie: '#7C848C',
  bronze: '#A8652E',
  silver: '#8390A0',
  gold: '#C8960C',
  platinum: '#2E9C9C',
  diamond: '#6D5BFF',
} as const;
