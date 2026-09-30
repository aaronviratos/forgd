import { Pressable, StyleSheet, View } from 'react-native';

import { ACCENT_KEYS, ACCENTS, SURFACE_KEYS, SURFACES } from '@/theme/palette';
import { useThemeContext } from '@/theme/ThemeProvider';
import type { ThemePref } from '@/theme/theme';
import { radius, space, touch } from '@/theme/tokens';
import { TEXT_SIZES, type TextSize } from '@/theme/typography';

import { Chip } from './Chip';
import { Segmented } from './Segmented';
import { Text } from './Text';

/** Theme, accent, background and text size (Profile › Settings). */
export function AppearanceSettings() {
  const { theme, setPrefs } = useThemeContext();
  const { colors, prefs } = theme;
  return (
    <View style={styles.stack}>
      <Text variant="bodyStrong">Theme</Text>
      <Segmented<ThemePref>
        label="Theme"
        value={prefs.theme}
        onChange={(t) => setPrefs({ theme: t })}
        options={[
          { value: 'system', label: 'Phone' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
      />

      <Text variant="bodyStrong">Accent</Text>
      <View style={styles.swatches} role="radiogroup" aria-label="Accent">
        {ACCENT_KEYS.map((k) => {
          const on = prefs.accent === k;
          return (
            <Pressable
              key={k}
              role="radio"
              aria-label={ACCENTS[k].label}
              aria-checked={on}
              onPress={() => setPrefs({ accent: k })}
              style={styles.swatchCell}
            >
              <View style={[styles.ring, { borderColor: on ? colors.ink : 'transparent' }]}>
                <View style={[styles.swatch, { backgroundColor: ACCENTS[k][theme.mode].fill }]}>
                  {on && (
                    <Text variant="bodyStrong" tone="accentInk">
                      ✓
                    </Text>
                  )}
                </View>
              </View>
              <Text variant="caption" tone={on ? 'ink' : 'muted'} center>
                {ACCENTS[k].label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text variant="bodyStrong">Background</Text>
      <View style={styles.wrap}>
        {SURFACE_KEYS.map((k) => (
          <Chip
            key={k}
            role="radio"
            label={SURFACES[k].label}
            selected={prefs.surface === k}
            onPress={() => setPrefs({ surface: k })}
          />
        ))}
      </View>

      <Text variant="bodyStrong">Text size</Text>
      <Segmented<TextSize>
        label="Text size"
        value={prefs.textSize}
        onChange={(textSize) => setPrefs({ textSize })}
        options={(Object.keys(TEXT_SIZES) as TextSize[]).map((k) => ({
          value: k,
          label: TEXT_SIZES[k].label,
        }))}
      />
      <Text variant="small" tone="muted">
        Your phone&apos;s own text size setting also applies.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: space.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  swatchCell: { width: 64, alignItems: 'center', gap: 2, minHeight: touch.min },
  ring: { borderWidth: 2.5, borderRadius: radius.pill, padding: 2 },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
