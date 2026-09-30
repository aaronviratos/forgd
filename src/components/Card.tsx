import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

export type CardProps = ViewProps & {
  /** Raised cards (active step card, athlete card, Home header) get a soft shadow; most are flat. */
  raised?: boolean;
  /** Dark "plate" panel, like the Home header. */
  plate?: boolean;
  /** 5px accent bar across the top, used by section cards. */
  accentTop?: boolean;
};

export function Card({ raised, plate, accentTop, style, ...rest }: CardProps) {
  const { colors, shadows, mode } = useTheme();
  // In dark mode a raised surface also gets a faint light edge, since shadows barely show.
  const edge = raised && mode === 'dark' ? 'rgba(255,255,255,0.08)' : undefined;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: plate ? colors.plate : colors.surface,
          borderColor: edge ?? (plate ? colors.plate : colors.line),
        },
        accentTop && { borderTopWidth: 5, borderTopColor: colors.accent },
        raised && shadows.raised,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: space.lg,
    gap: space.md,
  },
});
