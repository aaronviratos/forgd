import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { NumberField } from '@/components/Field';
import { Segmented, YES_NO } from '@/components/Segmented';
import { Sheet } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { Wordmark } from '@/components/Wordmark';
import { ACCENT_KEYS, ACCENTS, SURFACE_KEYS, SURFACES } from '@/theme/palette';
import { useThemeContext } from '@/theme/ThemeProvider';
import type { ThemePref } from '@/theme/theme';
import { radius, space, touch } from '@/theme/tokens';
import { TEXT_SIZES, type TextSize, type TextVariant, TYPE_SCALE } from '@/theme/typography';

/**
 * Component gallery: every building block in every theme, for design review.
 * Development only; it will move behind a hidden link once the real screens exist.
 */
export default function Gallery() {
  const { theme, setPrefs } = useThemeContext();
  const { colors, prefs } = theme;
  const insets = useSafeAreaInsets();
  const sheet = useRef<BottomSheetModal>(null);
  const [cpap, setCpap] = useState<boolean | null>(null);
  const [weight, setWeight] = useState('');
  const [goals, setGoals] = useState<string[]>(['Fat loss']);

  const weightError =
    weight && (Number.isNaN(Number(weight)) || Number(weight) <= 0)
      ? 'Enter a number, like 212.4'
      : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={[
          styles.topbar,
          { backgroundColor: colors.plate, paddingTop: insets.top + space.md },
        ]}
      >
        <Wordmark />
        <Text variant="title3" tone="plateMuted">
          Components
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 48 }]}>
        <Section title="Appearance">
          <Text variant="bodyStrong">Theme</Text>
          <Segmented<ThemePref>
            label="Theme"
            value={prefs.theme}
            onChange={(theme) => setPrefs({ theme })}
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
                  <View
                    style={[styles.swatchRing, { borderColor: on ? colors.ink : 'transparent' }]}
                  >
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
        </Section>

        <Section title="Text">
          {(Object.keys(TYPE_SCALE) as TextVariant[]).map((v) => (
            <Text key={v} variant={v}>
              {v} {TYPE_SCALE[v].size}
            </Text>
          ))}
          <Text tone="muted">Muted text for hints and secondary lines.</Text>
          <Text tone="accent" variant="bodyStrong">
            Accent text for links and active labels.
          </Text>
          <Text>Ambiguous letters stay distinct: Il1 O0 rn m 5S 8B</Text>
        </Section>

        <Section title="Buttons">
          <Button variant="primary" label="Done, next: Nutrition ›" block />
          <View style={styles.wrap}>
            <Button label="‹ Back" />
            <Button label="Saving…" loading />
            <Button label="Not yet" disabled />
          </View>
          <Button variant="link" label="More details +" />
        </Section>

        <Section title="Fields">
          <NumberField
            label="Morning weight"
            unit="lb"
            hint="After the bathroom, before food or water."
            value={weight}
            onChangeText={setWeight}
            placeholder="212.4"
            error={weightError}
            badge="Scheduled today"
          />
          <Text variant="bodyStrong">Used CPAP last night?</Text>
          <Segmented
            label="Used CPAP last night?"
            value={cpap}
            onChange={setCpap}
            options={YES_NO}
          />
          <Text variant="bodyStrong">Main goal</Text>
          <View style={styles.wrap}>
            {['Fat loss', 'Build muscle', 'Recomp', 'General health'].map((g) => (
              <Chip
                key={g}
                label={g}
                selected={goals.includes(g)}
                onPress={() =>
                  setGoals((cur) => (cur.includes(g) ? cur.filter((x) => x !== g) : [...cur, g]))
                }
              />
            ))}
          </View>
        </Section>

        <Section title="Cards and alerts">
          <Card plate raised>
            <Text variant="caption" tone="plateMuted">
              Wednesday, Sep 30
            </Text>
            <Text variant="title1" tone="plateInk">
              Good morning, Aaron
            </Text>
            <Text variant="bodyStrong" tone="plateInk">
              Step on stage in April in the best shape of my life
            </Text>
          </Card>
          <Card accentTop>
            <Text variant="overline" tone="muted">
              Step 1 of 7
            </Text>
            <Text variant="title2">Morning</Text>
            <Text tone="muted">Weight, blood pressure, sleep and how you feel.</Text>
          </Card>
          <Alert
            level="bad"
            title="BP 182/121 on Sep 29."
            body="Recheck after 5 minutes seated. If it stays this high, call 911."
          />
          <Alert
            level="warn"
            title="Resting pulse up 16 over 3 days."
            body="Keep an eye on it and tell your doctor if it holds."
          />
          <Alert level="ok" title="Protein target hit 7 days running." body="Nice work." />
        </Section>

        <Section title="Sheet">
          <Button label="Open a bottom sheet" onPress={() => sheet.current?.present()} />
        </Section>
      </ScrollView>

      <Sheet ref={sheet} title="Add food">
        <Text tone="muted">Sheets rise from the bottom and size to their content.</Text>
        <NumberField label="Servings" value="1" onChangeText={() => {}} />
        <Button
          variant="primary"
          label="Add to Meal 1"
          block
          onPress={() => sheet.current?.dismiss()}
        />
      </Sheet>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="title2">{title}</Text>
      <Card>{children}</Card>
    </View>
  );
}

function Alert({
  level,
  title,
  body,
}: {
  level: 'ok' | 'warn' | 'bad';
  title: string;
  body: string;
}) {
  const { colors } = useThemeContext().theme;
  const soft = { ok: colors.okSoft, warn: colors.warnSoft, bad: colors.badSoft }[level];
  const bar = { ok: colors.ok, warn: colors.warn, bad: colors.bad }[level];
  const word = { ok: 'Going well', warn: 'Watch', bad: 'Urgent' }[level];
  return (
    <View role="alert" style={[styles.alert, { backgroundColor: soft, borderLeftColor: bar }]}>
      <Text variant="overline" tone={level}>
        {word}
      </Text>
      <Text variant="bodyStrong">{title}</Text>
      <Text>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingHorizontal: space.gutter,
    paddingBottom: space.md,
  },
  page: { padding: space.gutter, gap: space.xxl },
  section: { gap: space.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  swatchCell: { width: 64, alignItems: 'center', gap: 2, minHeight: touch.min },
  swatchRing: { borderWidth: 2.5, borderRadius: radius.pill, padding: 2 },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alert: { borderLeftWidth: 5, borderRadius: radius.input, padding: space.md, gap: 2 },
});
