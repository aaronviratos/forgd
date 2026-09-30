import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { Text } from './Text';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** 'checkbox' for multi-select chips, 'radio' when only one can be picked. */
  role?: 'checkbox' | 'radio';
};

/**
 * Selectable pill. Selected state is shown by fill, border and a check mark,
 * so it never relies on color alone.
 */
export function Chip({ label, selected, onPress, role = 'checkbox' }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      role={role}
      aria-label={label}
      aria-checked={!!selected}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.accentSoft : colors.surface,
          borderColor: selected ? colors.accent : colors.lineStrong,
          borderWidth: selected ? 2 : 1.5,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text variant="bodyStrong">{selected ? `✓ ${label}` : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touch.min,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
});
