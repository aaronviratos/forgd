import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Tap } from './motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { List, Sparkle, User, X } from './icons';
import { Text } from './Text';
import { Wordmark } from './Wordmark';

export type TopBarProps = {
  menuOpen: boolean;
  onMenu: () => void;
};

/**
 * The dark "plate" bar on every main screen: avatar (Profile), wordmark (Home),
 * Coach, and the menu. The page title lives in the page itself, not here, so it
 * is never shown twice.
 */
export function TopBar({ menuOpen, onMenu }: TopBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.plate,
          paddingTop: insets.top + space.xs,
          borderBottomColor: colors.plateLine,
        },
      ]}
    >
      <Tap
        role="button"
        aria-label="Profile"
        onPress={() => router.navigate('/profile')}
        style={[styles.avatar, { borderColor: colors.plateLine }]}
      >
        <User size={22} color={colors.plateInk} weight="fill" />
      </Tap>

      <Tap
        role="link"
        aria-label="Home"
        onPress={() => router.navigate('/')}
        hitSlop={8}
        style={styles.wordmark}
      >
        <Wordmark size={22} />
      </Tap>

      <View style={styles.spacer} />

      <Tap
        role="button"
        aria-label="Coach"
        onPress={() => router.navigate('/coach')}
        style={[styles.coach, { borderColor: colors.accentOnPlate }]}
      >
        <Sparkle size={18} color={colors.accentOnPlate} weight="fill" />
        <Text variant="bodyStrong" tone="plateInk" maxFontSizeMultiplier={1.2}>
          Coach
        </Text>
      </Tap>

      <Tap
        role="button"
        aria-label={menuOpen ? 'Close menu' : 'Menu'}
        aria-expanded={menuOpen}
        onPress={onMenu}
        style={[styles.menu]}
      >
        {menuOpen ? (
          <X size={24} color={colors.plateInk} weight="bold" />
        ) : (
          <List size={24} color={colors.plateInk} weight="bold" />
        )}
      </Tap>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.gutter - 4,
    paddingBottom: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  avatar: {
    width: touch.min,
    height: touch.min,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { paddingHorizontal: 4, minHeight: touch.min, justifyContent: 'center' },
  spacer: { flex: 1 },
  coach: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  menu: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
});
