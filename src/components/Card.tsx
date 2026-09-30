import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { elevation, radius, space } from '@/theme/tokens';

export type CardProps = ViewProps & {
  /** Raised cards (active step card, athlete card) get a soft shadow; most cards are flat. */
  raised?: boolean;
  /** Dark "plate" panel, like the Home header. */
  plate?: boolean;
  /** 5px accent bar across the top, used by section cards. */
  accentTop?: boolean;
};

export function Card({ raised, plate, accentTop, style, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: plate ? colors.plate : colors.surface,
          borderColor: plate ? colors.plate : colors.line,
        },
        accentTop && { borderTopWidth: 5, borderTopColor: colors.accent },
        raised && elevation.raised,
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
