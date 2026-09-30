import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppearanceSettings } from '@/components/AppearanceSettings';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { NumberField } from '@/components/Field';
import { Segmented, YES_NO } from '@/components/Segmented';
import { Sheet } from '@/components/Sheet';
import { Text } from '@/components/Text';
import { Wordmark } from '@/components/Wordmark';
import { useThemeContext } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';
import { type TextVariant, TYPE_SCALE } from '@/theme/typography';

/**
 * Component gallery: every building block in every theme, for design review.
 * Development only: reached from Profile › Settings in development builds.
 */
export default function Gallery() {
  const { colors } = useThemeContext().theme;
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
          <AppearanceSettings />
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
  alert: { borderLeftWidth: 5, borderRadius: radius.input, padding: space.md, gap: 2 },
});
