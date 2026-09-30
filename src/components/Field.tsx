import { type ReactNode, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';
import { FONT_FILES, MAX_OS_FONT_SCALE, MIN_INPUT_SIZE } from '@/theme/typography';

import { Text } from './Text';

export type FieldProps = {
  label: string;
  /** Short line under the control, e.g. "Before breakfast, after the bathroom". */
  hint?: string;
  /** Shown in place of the hint, in red with a warning mark. */
  error?: string;
  /** Small tag next to the label, e.g. "Scheduled today". */
  badge?: string;
  children: ReactNode;
};

/** Label + control + hint. Every form field in the app uses this layout. */
export function Field({ label, hint, error, badge, children }: FieldProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text variant="bodyStrong">{label}</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
            <Text variant="caption">{badge}</Text>
          </View>
        )}
      </View>
      {children}
      {error ? (
        <Text variant="small" tone="bad" accessibilityLiveRegion="polite">
          ⚠ {error}
        </Text>
      ) : hint ? (
        <Text variant="small" tone="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

export type InputProps = Omit<TextInputProps, 'style'> & {
  /** Unit shown inside the right edge of the box, e.g. "lb". */
  unit?: string;
  invalid?: boolean;
  /** Accessible name; defaults to nothing, so pass the field label. */
  label: string;
};

export function Input({ unit, invalid, label, onFocus, onBlur, ...rest }: InputProps) {
  const { colors, textScale } = useTheme();
  const [focused, setFocused] = useState(false);
  const size = Math.max(MIN_INPUT_SIZE, 17 * textScale);
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: colors.sunk,
          borderColor: invalid ? colors.bad : focused ? colors.accent : colors.lineStrong,
          borderWidth: focused || invalid ? 2 : 1.5,
        },
      ]}
    >
      <TextInput
        accessibilityLabel={unit ? `${label}, in ${unit}` : label}
        maxFontSizeMultiplier={MAX_OS_FONT_SCALE}
        placeholderTextColor={colors.muted}
        selectionColor={colors.accent}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, { color: colors.ink, fontFamily: FONT_FILES[500], fontSize: size }]}
        {...rest}
      />
      {unit && (
        <Text variant="bodyStrong" tone="muted" importantForAccessibility="no">
          {unit}
        </Text>
      )}
    </View>
  );
}

/** Number input with unit, the most common field in the app (weight, sleep, steps...). */
export function NumberField({
  label,
  hint,
  error,
  badge,
  ...input
}: Omit<FieldProps, 'children'> & Omit<InputProps, 'label' | 'invalid'>) {
  return (
    <Field label={label} hint={hint} error={error} badge={badge}>
      <Input label={label} invalid={!!error} keyboardType="decimal-pad" {...input} />
    </Field>
  );
}

const styles = StyleSheet.create({
  field: { gap: space.xs },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touch.primary,
    borderRadius: radius.input,
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  // outlineWidth: our own border shows focus, so hide the browser's extra outline on web.
  input: { flex: 1, paddingVertical: space.sm, outlineWidth: 0 },
});
