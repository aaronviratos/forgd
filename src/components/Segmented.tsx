import { StyleSheet, View } from 'react-native';
import { Tap } from './motion';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { Text } from './Text';

export type SegmentedProps<T extends string | boolean> = {
  options: { value: T; label: string }[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Read by screen readers as the group name. */
  label: string;
};

/** Side-by-side choices; used for Yes/No fields and short option sets. */
export function Segmented<T extends string | boolean>({
  options,
  value,
  onChange,
  label,
}: SegmentedProps<T>) {
  const { colors } = useTheme();
  return (
    <View
      role="radiogroup"
      aria-label={label}
      style={[styles.group, { borderColor: colors.lineStrong, backgroundColor: colors.sunk }]}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Tap
            key={String(o.value)}
            role="radio"
            aria-label={o.label}
            aria-checked={on}
            onPress={() => onChange(o.value)}
            style={[styles.option, on && { backgroundColor: colors.accent }]}
          >
            <Text variant="bodyStrong" tone={on ? 'accentInk' : 'ink'}>
              {o.label}
            </Text>
          </Tap>
        );
      })}
    </View>
  );
}

export const YES_NO = [
  { value: true, label: 'Yes' },
  { value: false, label: 'No' },
];

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: radius.input + 2,
    padding: 3,
    gap: 3,
  },
  option: {
    flex: 1,
    minHeight: touch.min,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
});
