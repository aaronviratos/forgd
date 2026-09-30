/**
 * Color math used by the theme and by the contrast tests.
 * Contrast follows WCAG 2: 4.5:1 for normal text, 3:1 for large text and control borders.
 */

type RGB = [number, number, number];

function toRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Expected a #RRGGBB color, got "${hex}"`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
}

function toHex(rgb: RGB): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.round(Math.max(0, Math.min(255, v)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colors, from 1 (none) to 21 (black on white). */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Blend `color` over `base`; amount 0 gives base, 1 gives color. */
export function mix(color: string, base: string, amount: number): string {
  const c = toRgb(color);
  const b = toRgb(base);
  return toHex([0, 1, 2].map((i) => b[i] + (c[i] - b[i]) * amount) as RGB);
}
