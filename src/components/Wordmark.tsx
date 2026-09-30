import { Text } from 'react-native';

import { BRAND } from '@/config/brand';
import { useTheme } from '@/theme/ThemeProvider';
import { WORDMARK_FONT } from '@/theme/typography';

/** FORG + accent D. Sits on the dark plate, so it uses plate colors in both modes. */
export function Wordmark({ size = 23 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <Text
      accessibilityLabel={BRAND.name}
      maxFontSizeMultiplier={1.2}
      style={{
        fontFamily: WORDMARK_FONT,
        fontSize: size,
        letterSpacing: size * 0.06,
        color: colors.plateInk,
      }}
    >
      {BRAND.wordmark.main}
      <Text style={{ color: colors.accentOnPlate }}>{BRAND.wordmark.accent}</Text>
    </Text>
  );
}
