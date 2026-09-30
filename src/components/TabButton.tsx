import * as Haptics from 'expo-haptics';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

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
 */
export const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon: IconCmp, label, isFocused, onPress, ...rest },
  ref,
) {
  const { colors } = useTheme();
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
      <View
        style={[styles.indicator, { backgroundColor: isFocused ? colors.accent : 'transparent' }]}
      />
      <IconCmp
        size={26}
        color={isFocused ? colors.accentText : colors.muted}
        weight={isFocused ? 'fill' : 'regular'}
      />
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
