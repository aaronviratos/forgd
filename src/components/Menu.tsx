import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HUBS, type HubKey, hubForPath, MENU_ORDER } from '@/navigation/hubs';
import { useTheme } from '@/theme/ThemeProvider';
import { motion, radius, space, touch } from '@/theme/tokens';

import { CaretDown, CaretRight } from './icons';
import { Tap } from './motion';
import { Text } from './Text';

export type MenuProps = {
  open: boolean;
  onClose: () => void;
  /** Height of the top bar, so the menu drops from just below it. */
  top: number;
};

/**
 * Plate dropdown from the top bar. Hubs with sections expand on tap to show
 * "Open {hub}" and one chip per section; the current hub starts expanded.
 */
export function Menu({ open, onClose, top }: MenuProps) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const current = hubForPath(usePathname());
  const [expanded, setExpanded] = useState<HubKey | null>(current);

  const go = (hub: HubKey, section?: string) => {
    onClose();
    const { pathname } = HUBS[hub];
    router.navigate(section ? { pathname, params: { section } } : pathname);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={() => setExpanded(current)}
    >
      <Pressable
        aria-label="Close menu"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, styles.scrim]}
      />
      {/* Drops down from under the top bar. */}
      <Animated.View
        entering={FadeInUp.duration(motion.menu)}
        style={[
          styles.panel,
          shadows.overlay,
          { top, backgroundColor: colors.plate, maxHeight: '100%' },
        ]}
      >
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: space.lg + insets.bottom / 2 }]}
        >
          {MENU_ORDER.map((key) => {
            const hub = HUBS[key];
            const isCurrent = key === current;
            const isOpen = expanded === key && hub.sections.length > 0;
            return (
              <View
                key={key}
                style={[
                  styles.item,
                  { borderLeftColor: isCurrent ? colors.accentOnPlate : 'transparent' },
                ]}
              >
                <Tap
                  role="button"
                  aria-label={hub.label}
                  aria-expanded={hub.sections.length ? isOpen : undefined}
                  aria-current={isCurrent ? 'page' : undefined}
                  onPress={() => (hub.sections.length ? setExpanded(isOpen ? null : key) : go(key))}
                  style={[styles.row]}
                >
                  <Text variant="title3" tone="plateInk" style={styles.flex}>
                    {hub.label}
                  </Text>
                  {hub.sections.length ? (
                    <CaretDown
                      size={20}
                      color={colors.plateMuted}
                      style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                    />
                  ) : (
                    <CaretRight size={20} color={colors.plateMuted} />
                  )}
                </Tap>
                {isOpen && (
                  <Animated.View entering={FadeIn.duration(180)} style={styles.sections}>
                    <Tap
                      role="link"
                      aria-label={`Open ${hub.label}`}
                      onPress={() => go(key)}
                      style={[styles.openRow]}
                    >
                      <Text variant="bodyStrong" style={{ color: colors.accentOnPlate }}>
                        Open {hub.label} ›
                      </Text>
                    </Tap>
                    <View style={styles.chips}>
                      {hub.sections.map((s) => (
                        <Tap
                          key={s.key}
                          role="link"
                          aria-label={`${hub.label}: ${s.label}`}
                          onPress={() => go(key, s.key)}
                          style={[styles.chip, { borderColor: colors.plateLine }]}
                        >
                          <Text variant="bodyStrong" tone="plateInk">
                            {s.label}
                          </Text>
                        </Tap>
                      ))}
                    </View>
                  </Animated.View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: 'rgba(0,0,0,0.45)' },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomLeftRadius: radius.sheet,
    borderBottomRightRadius: radius.sheet,
    overflow: 'hidden',
  },
  list: { paddingHorizontal: space.md, paddingTop: space.xs, gap: 2 },
  item: {
    borderLeftWidth: 4,
    borderRadius: radius.card,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touch.primary + 4,
    paddingHorizontal: space.md,
  },
  flex: { flex: 1 },
  sections: { paddingHorizontal: space.md, paddingBottom: space.md, gap: space.sm },
  openRow: { minHeight: touch.min, justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    minHeight: touch.min,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
});
