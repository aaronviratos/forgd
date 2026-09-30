import * as Haptics from 'expo-haptics';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef, useEffect } from 'react';
import { Platform, Pressable, StyleSheet, type View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme/ThemeProvider';
import { space, touch } from '@/theme/tokens';

import type { Icon } from './icons';
import { Text } from './Text';

export function tapFeedback() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

type TabButtonProps = TabTriggerSlotProps & { icon: Icon; label: string };

/**
 * One tab in the bottom bar. Active: accent bar on top, filled icon, accent label.
 * Labels are always shown (icons alone are guesswork) and never smaller than 13pt.
 * Becoming active grows the accent bar from the center and gives the icon a small pop.
 */
export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon: IconCmp, label, isFocused, onPress, ...rest },
  ref,
) {
  const { colors } = useTheme();
  const reduce = useReducedMotion();
  const active = useSharedValue(isFocused ? 1 : 0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (reduce) {
      active.set(isFocused ? 1 : 0);
      return;
    }
    active.set(withTiming(isFocused ? 1 : 0, { duration: 200 }));
    if (isFocused) {
      pop.set(withSequence(withTiming(1.14, { duration: 110 }), withSpring(1, { damping: 12 })));
    }
  }, [isFocused, reduce, active, pop]);

  const bar = useAnimatedStyle(() => ({ transform: [{ scaleX: active.get() }] }));
  const icon = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  return (
    <Pressable
      ref={ref}
      role="tab"
      aria-label={label}
      aria-selected={!!isFocused}
      {...rest}
      onPress={(e) => {
        tapFeedback();
        onPress?.(e);
      }}
      style={styles.tab}
    >
      <Animated.View style={[styles.indicator, { backgroundColor: colors.accent }, bar]} />
      <Animated.View style={icon}>
        <IconCmp
          size={26}
          color={isFocused ? colors.accentText : colors.muted}
          weight={isFocused ? 'fill' : 'regular'}
        />
      </Animated.View>
      <Text
        variant="caption"
        tone={isFocused ? 'accent' : 'muted'}
        maxFontSizeMultiplier={1.3}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: touch.primary + space.sm,
    gap: 2,
    paddingTop: space.xs,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
