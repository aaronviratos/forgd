import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { CaretRight, ClipboardText, IdentificationCard } from '@/components/icons';
import { Tap, useFocusFadeUp } from '@/components/motion';
import { Text } from '@/components/Text';
import { greeting, longDate } from '@/core/greeting';
import { PLATE_GLOW } from '@/theme/palette';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

/**
 * Home (docs/03, B): today at a glance, then the card.
 * The goal, AI line, athlete card and next-step card arrive in Milestone 2.
 */
export default function Home() {
  const { colors } = useTheme();
  const now = new Date();
  const pageIn = useFocusFadeUp();
  // Glow alpha as hex, from the legibility-tested blend amount.
  const glow = Math.round(PLATE_GLOW * 255)
    .toString(16)
    .padStart(2, '0');
  return (
    <Animated.ScrollView
      style={[{ backgroundColor: colors.bg }, pageIn]}
      contentContainerStyle={styles.page}
    >
      <Card plate raised style={styles.header}>
        {/* Soft accent glow from the top-right corner, as in the prototype's header. */}
        <LinearGradient
          pointerEvents="none"
          colors={[`${colors.accentOnPlate}${glow}`, `${colors.accentOnPlate}00`]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.3, y: 0.8 }}
          style={[StyleSheet.absoluteFill, styles.glow]}
        />
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

      <Tap
        role="link"
        aria-label="Today: nothing logged yet. Open Today."
        onPress={() => router.navigate('/today')}
        style={[styles.todayRow, { backgroundColor: colors.surface, borderColor: colors.line }]}
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
      </Tap>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.gutter, gap: space.lg, paddingBottom: space.xxxl * 2 },
  header: { gap: space.xs, paddingVertical: space.xl },
  glow: { borderRadius: radius.card },
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
});
