import { router } from 'expo-router';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import type { Section } from '@/navigation/hubs';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { tapFeedback } from './TabButton';
import { Text } from './Text';

export type ScreenProps = {
  /** Large page title (left out on Home, which has its own header). */
  title?: string;
  /** Sub-tabs under the title; they stick to the top while scrolling. */
  sections?: Section[];
  section?: string;
  children: ReactNode;
};

/** Standard page: title, sticky sub-tabs, then content with the screen gutter. */
export function Screen({ title, sections, section, children }: ScreenProps) {
  const { colors } = useTheme();
  const hasTabs = !!sections?.length;
  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={styles.scroll}
      stickyHeaderIndices={hasTabs ? [title ? 1 : 0] : undefined}
      keyboardShouldPersistTaps="handled"
    >
      {title ? (
        <View style={styles.pageBar}>
          <Text variant="title1">{title}</Text>
        </View>
      ) : null}
      {hasTabs ? <SubTabs sections={sections!} current={section ?? sections![0].key} /> : null}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

function SubTabs({ sections, current }: { sections: Section[]; current: string }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const scroller = useRef<ScrollView>(null);
  // Where each tab sits, so the selected one can be scrolled into view
  // (for example after a deep link to /today?section=flags).
  const [spots, setSpots] = useState<Record<string, { x: number; w: number }>>({});

  useEffect(() => {
    const spot = spots[current];
    if (spot)
      scroller.current?.scrollTo({
        x: Math.max(0, spot.x + spot.w / 2 - width / 2),
        animated: true,
      });
  }, [current, spots, width]);

  return (
    <View style={{ backgroundColor: colors.bg }}>
      <ScrollView
        ref={scroller}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
        role="tablist"
      >
        {sections.map((s) => {
          const on = s.key === current;
          return (
            <Pressable
              key={s.key}
              onLayout={(e) => {
                const { x, width: w } = e.nativeEvent.layout;
                setSpots((prev) => (prev[s.key]?.x === x ? prev : { ...prev, [s.key]: { x, w } }));
              }}
              role="tab"
              aria-label={s.label}
              aria-selected={on}
              onPress={() => {
                tapFeedback();
                router.setParams({ section: s.key });
              }}
              style={({ pressed }) => [
                styles.tab,
                on
                  ? { backgroundColor: colors.ink, borderColor: colors.ink }
                  : { backgroundColor: colors.surface, borderColor: colors.lineStrong },
                pressed && !on && styles.pressed,
              ]}
            >
              <Text variant="bodyStrong" style={on ? { color: colors.bg } : undefined}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: space.xxxl * 2 },
  pageBar: { paddingHorizontal: space.gutter, paddingTop: space.xl, paddingBottom: space.sm },
  tabs: { paddingHorizontal: space.gutter, paddingVertical: space.sm, gap: space.sm },
  tab: {
    minHeight: touch.min,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  content: { paddingHorizontal: space.gutter, paddingTop: space.md, gap: space.lg },
  pressed: { opacity: 0.7 },
});
