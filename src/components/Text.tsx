import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { Colors } from '@/theme/theme';
import { MAX_OS_FONT_SCALE, textStyle, type TextVariant } from '@/theme/typography';

export type TextTone =
  'ink' | 'muted' | 'accent' | 'accentInk' | 'ok' | 'warn' | 'bad' | 'plateInk' | 'plateMuted';

const TONE: Record<TextTone, keyof Colors> = {
  ink: 'ink',
  muted: 'muted',
  accent: 'accentText',
  accentInk: 'accentInk',
  ok: 'ok',
  warn: 'warn',
  bad: 'bad',
  plateInk: 'plateInk',
  plateMuted: 'plateMuted',
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  center?: boolean;
};

/**
 * All text in the app goes through this, so size, font, color and scaling stay consistent.
 * Titles are marked as headers for screen readers.
 */
export function Text({ variant = 'body', tone = 'ink', center, style, ...rest }: TextProps) {
  const theme = useTheme();
  const isHeading = variant === 'display' || variant.startsWith('title');
  return (
    <RNText
      role={isHeading ? 'heading' : undefined}
      maxFontSizeMultiplier={MAX_OS_FONT_SCALE}
      style={[
        textStyle(variant, theme.textScale),
        { color: theme.colors[TONE[tone]] },
        center && { textAlign: 'center' },
        style,
      ]}
      {...rest}
    />
  );
}
