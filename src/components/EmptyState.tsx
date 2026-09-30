import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space } from '@/theme/tokens';

import { Button } from './Button';
import type { Icon } from './icons';
import { Text } from './Text';

export type EmptyStateProps = {
  icon?: Icon;
  title: string;
  /** One sentence: what goes here and why it matters. */
  body: string;
  /** The single action that fills it (docs/03, W. Global states). */
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ icon: IconCmp, title, body, action }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: colors.surface, borderColor: colors.line }]}>
      {IconCmp && (
        <View style={[styles.icon, { backgroundColor: colors.accentSoft }]}>
          <IconCmp size={28} color={colors.accentText} weight="regular" />
        </View>
      )}
      <Text variant="title3" center>
        {title}
      </Text>
      <Text tone="muted" center>
        {body}
      </Text>
      {action && <Button variant="primary" label={action.label} onPress={action.onPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.xxxl,
    paddingHorizontal: space.xl,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
