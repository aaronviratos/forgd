import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Tap } from './motion';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { Text } from './Text';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** primary: the one main action on a screen (accent). secondary: everything else. link: inline. */
  variant?: 'primary' | 'secondary' | 'link';
  disabled?: boolean;
  loading?: boolean;
  /** Stretch to the full width of the container. */
  block?: boolean;
  /** Read by screen readers when the label alone is not enough. */
  accessibilityHint?: string;
};

export function Button({
  label,
  onPress,
  variant = 'secondary',
  disabled,
  loading,
  block,
  accessibilityHint,
}: ButtonProps) {
  const { colors } = useTheme();
  const inactive = disabled || loading;

  if (variant === 'link') {
    return (
      <Tap
        role="button"
        aria-label={label}
        aria-disabled={inactive}
        accessibilityHint={accessibilityHint}
        disabled={inactive}
        onPress={onPress}
        hitSlop={12}
        style={[styles.link]}
      >
        <Text variant="bodyStrong" tone={inactive ? 'muted' : 'accent'} style={styles.underline}>
          {label}
        </Text>
      </Tap>
    );
  }

  const primary = variant === 'primary';
  // Disabled buttons keep readable text (muted on sunk) instead of fading out.
  const bg = inactive ? colors.sunk : primary ? colors.accent : colors.surface;
  const border = inactive ? colors.line : primary ? colors.accent : colors.lineStrong;
  const tone = inactive ? 'muted' : primary ? 'accentInk' : 'ink';

  return (
    <Tap
      role="button"
      aria-label={label}
      aria-disabled={inactive}
      aria-busy={loading}
      accessibilityHint={accessibilityHint}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: border,
          minHeight: primary ? touch.primary : touch.min,
        },
        block && styles.block,
      ]}
    >
      <View style={styles.row}>
        {loading && <ActivityIndicator color={colors.muted} style={styles.spinner} />}
        <Text variant="bodyStrong" tone={tone}>
          {label}
        </Text>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: space.xl,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  block: { alignSelf: 'stretch' },
  row: { flexDirection: 'row', alignItems: 'center' },
  spinner: { marginRight: space.sm },
  link: { alignSelf: 'flex-start', paddingVertical: space.xs },
  underline: { textDecorationLine: 'underline' },
});
