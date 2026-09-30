import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { type Href, router } from 'expo-router';
import { forwardRef, type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tap } from './motion';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import {
  Barbell,
  CalendarBlank,
  ForkKnife,
  type Icon,
  Ruler,
  Scales,
  Sparkle,
  TestTube,
} from './icons';
import { Sheet } from './Sheet';
import { Text } from './Text';

type Action = { label: string; icon: Icon; href: Href };

/** docs/03-screens.md, H. Each action deep-links to where that thing is logged. */
const ACTIONS: Action[] = [
  {
    label: 'Add food',
    icon: ForkKnife,
    href: { pathname: '/today', params: { section: 'nutrition' } },
  },
  {
    label: 'Log weight',
    icon: Scales,
    href: { pathname: '/today', params: { section: 'morning' } },
  },
  {
    label: 'Log workout',
    icon: Barbell,
    href: { pathname: '/today', params: { section: 'training' } },
  },
  {
    label: 'Add measurements',
    icon: Ruler,
    href: { pathname: '/progress', params: { section: 'measurements' } },
  },
  {
    label: 'Add lab results',
    icon: TestTube,
    href: { pathname: '/progress', params: { section: 'labs' } },
  },
  {
    label: 'Weekly check-in',
    icon: CalendarBlank,
    href: { pathname: '/progress', params: { section: 'checkin' } },
  },
];

/** The center + button's sheet: the fastest way to log anything. */
export const PlusMenu = forwardRef<BottomSheetModal>(function PlusMenu(_props, ref) {
  const { colors } = useTheme();
  const sheet = ref as RefObject<BottomSheetModal | null>;

  const go = (href: Href) => {
    sheet.current?.dismiss();
    router.navigate(href);
  };

  return (
    <Sheet ref={ref} title="Log something">
      {/* Log with AI is the main path (paid, Milestone 5); shown so the layout is final. */}
      <View
        aria-disabled
        style={[styles.ai, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
      >
        <Sparkle size={26} color={colors.accentText} weight="fill" />
        <View style={styles.flex}>
          <Text variant="bodyStrong">Log with AI</Text>
          <Text variant="small" tone="muted">
            Say or type your day. Coming in a later update.
          </Text>
        </View>
      </View>
      <View style={styles.grid}>
        {ACTIONS.map(({ label, icon: IconCmp, href }) => (
          <Tap
            key={label}
            role="button"
            aria-label={label}
            onPress={() => go(href)}
            style={[
              styles.tile,
              { backgroundColor: colors.surface, borderColor: colors.lineStrong },
            ]}
          >
            <IconCmp size={26} color={colors.accentText} weight="regular" />
            <Text variant="bodyStrong">{label}</Text>
          </Tap>
        ))}
      </View>
    </Sheet>
  );
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  ai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radius.card,
    borderWidth: 1.5,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  tile: {
    width: '48.5%',
    minHeight: touch.primary * 2,
    padding: space.md,
    borderRadius: radius.card,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    gap: space.sm,
  },
});
