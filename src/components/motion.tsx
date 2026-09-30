/**
 * Shared values use .get()/.set() (not .value) so the React Compiler can optimize safely.
 *
 * Motion building blocks (docs/02, Motion). Everything here turns itself off when the
 * phone's Reduce Motion setting is on.
 */
import { useFocusEffect } from 'expo-router';
import { forwardRef, useCallback } from 'react';
import {
  type GestureResponderEvent,
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '@/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Quick, well-damped spring: settles fast with no wobble (close to iOS button feel). */
export const PRESS_SPRING = { damping: 22, stiffness: 420, mass: 0.6 };

export type TapProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** How far it shrinks while pressed; 0.97 for most things, less for big targets. */
  scaleTo?: number;
};

/**
 * A Pressable that gently shrinks while held and springs back on release.
 * With Reduce Motion on, it dims slightly instead of moving.
 */
export const Tap = forwardRef<View, TapProps>(function Tap(
  { style, scaleTo = 0.97, onPressIn, onPressOut, ...rest },
  ref,
) {
  const reduce = useReducedMotion();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() =>
    reduce
      ? { opacity: 1 - pressed.get() * 0.3 }
      : { transform: [{ scale: 1 - pressed.get() * (1 - scaleTo) }] },
  );

  return (
    <AnimatedPressable
      ref={ref}
      {...rest}
      onPressIn={(e: GestureResponderEvent) => {
        pressed.set(reduce ? 1 : withSpring(1, PRESS_SPRING));
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        pressed.set(reduce ? 0 : withSpring(0, PRESS_SPRING));
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
});

/**
 * Page entrance: each time a page comes into focus it fades up 8pt (260ms).
 * Returns a style for an Animated view that wraps the page.
 */
export function useFocusFadeUp() {
  const reduce = useReducedMotion();
  const progress = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      if (reduce) return;
      progress.set(0);
      progress.set(withTiming(1, { duration: motion.pageFade, easing: Easing.out(Easing.cubic) }));
    }, [reduce, progress]),
  );

  return useAnimatedStyle(() => ({
    opacity: progress.get(),
    transform: [{ translateY: (1 - progress.get()) * 8 }],
  }));
}
