import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { CaretRight, ClipboardText, IdentificationCard } from '@/components/icons';
import { Text } from '@/components/Text';
import { greeting, longDate } from '@/core/greeting';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

/**
 * Home (docs/03, B): today at a glance, then the card.
 * The goal, AI line, athlete card and next-step card arrive in Milestone 2.
 */
export default function Home() {
  const { colors } = useTheme();
  const now = new Date();
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={styles.page}>
      <Card plate raised style={styles.header}>
        <Text variant="small" tone="plateMuted">
          {longDate(now)}
        </Text>
        <Text variant="title1" tone="plateInk">
          {greeting(now)}
        </Text>
        <View style={[styles.rule, { backgroundColor: colors.plateLine }]} />
        <Text tone="plateMuted">Your goal and progress will show here.</Text>
      </Card>

      <EmptyState
        icon={IdentificationCard}
        title="Your athlete card"
        body="Answer six quick questions and your card appears here. Every workout, meal and night of sleep levels it up."
      />

      <Pressable
        role="link"
        aria-label="Today: nothing logged yet. Open Today."
        onPress={() => router.navigate('/today')}
        style={({ pressed }) => [
          styles.todayRow,
          { backgroundColor: colors.surface, borderColor: colors.line },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.todayIcon, { backgroundColor: colors.accentSoft }]}>
          <ClipboardText size={24} color={colors.accentText} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Today</Text>
          <Text variant="small" tone="muted">
            Nothing logged yet
          </Text>
        </View>
        <CaretRight size={20} color={colors.muted} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.gutter, gap: space.lg, paddingBottom: space.xxxl * 2 },
  header: { gap: space.xs, paddingVertical: space.xl },
  rule: { height: 1, marginVertical: space.sm },
  flex: { flex: 1 },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  todayIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
});
