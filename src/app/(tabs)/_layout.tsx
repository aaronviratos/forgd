import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tap } from '@/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChartBar, ClipboardText, CalendarBlank, House, Plus } from '@/components/icons';
import { Menu } from '@/components/Menu';
import { PlusMenu } from '@/components/PlusMenu';
import { TabButton, tapFeedback } from '@/components/TabButton';
import { SyncStatus } from '@/components/SyncStatus';
import { TopBar } from '@/components/TopBar';
import { db } from '@/data/db';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/tokens';

/**
 * The main app frame: top bar, the current page, and the bottom tab bar with the
 * raised + button in the middle (docs/02, Tab bar). Profile and Coach are routes
 * in this frame too, reached from the top bar instead of a tab.
 */
export default function TabsLayout() {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const plus = useRef<BottomSheetModal>(null);

  return (
    <Tabs style={[styles.frame, { backgroundColor: colors.bg }]}>
      <View onLayout={(e) => setTopBarHeight(e.nativeEvent.layout.height)}>
        <TopBar menuOpen={menuOpen} onMenu={() => setMenuOpen((o) => !o)} />
        {db ? <SyncStatus /> : null}
      </View>

      <TabSlot style={styles.page} />

      <TabList
        style={[
          styles.bar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TabTrigger name="index" href="/" asChild>
          <TabButton icon={House} label="Home" />
        </TabTrigger>
        <TabTrigger name="today" href="/today" asChild>
          <TabButton icon={ClipboardText} label="Today" />
        </TabTrigger>

        <View style={styles.plusSlot}>
          <Tap
            role="button"
            aria-label="Log something"
            onPress={() => {
              tapFeedback();
              plus.current?.present();
            }}
            scaleTo={0.9}
            style={[
              styles.plus,
              shadows.accentGlow,
              { backgroundColor: colors.accent, borderColor: colors.bg },
            ]}
          >
            <Plus size={30} color={colors.accentInk} weight="bold" />
          </Tap>
        </View>

        <TabTrigger name="plan" href="/plan" asChild>
          <TabButton icon={CalendarBlank} label="Plan" />
        </TabTrigger>
        <TabTrigger name="progress" href="/progress" asChild>
          <TabButton icon={ChartBar} label="Progress" />
        </TabTrigger>

        {/* In this frame but not on the tab bar. */}
        <TabTrigger name="profile" href="/profile" style={styles.hidden} />
        <TabTrigger name="coach" href="/coach" style={styles.hidden} />
      </TabList>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} top={topBarHeight} />
      <PlusMenu ref={plus} />
    </Tabs>
  );
}

const PLUS = 60;

const styles = StyleSheet.create({
  frame: { flex: 1 },
  page: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  plusSlot: { flex: 1, alignItems: 'center' },
  plus: {
    width: PLUS,
    height: PLUS,
    marginTop: -PLUS / 3,
    borderRadius: radius.pill,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hidden: { display: 'none' },
});
