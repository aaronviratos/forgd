import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, type ReactNode, useCallback } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { radius, space, touch } from '@/theme/tokens';

import { Text } from './Text';

export type SheetProps = {
  title: string;
  children: ReactNode;
  onClose?: () => void;
};

/**
 * Bottom sheet used for Add food, Log with AI, AI check, the + menu, editors...
 * Open with ref.current?.present(), close with ref.current?.dismiss().
 * Sizes to its content, up to 90% of the screen, then scrolls.
 */
export const Sheet = forwardRef<BottomSheetModal, SheetProps>(function Sheet(
  { title, children, onClose },
  ref,
) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
    ),
    [],
  );

  const close = () => (ref && 'current' in ref ? ref.current?.dismiss() : undefined);

  return (
    <BottomSheetModal
      ref={ref}
      onDismiss={onClose}
      maxDynamicContentSize={height * 0.9}
      backdropComponent={backdrop}
      backgroundStyle={{ backgroundColor: colors.surface, borderRadius: radius.sheet }}
      handleIndicatorStyle={{ backgroundColor: colors.lineStrong, width: 44 }}
      topInset={insets.top}
      accessibilityLabel={title}
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + space.xxl }]}
      >
        <View style={styles.header}>
          <Text variant="title2" style={styles.title}>
            {title}
          </Text>
          <Pressable
            role="button"
            aria-label="Close"
            onPress={close}
            hitSlop={8}
            style={[styles.close, { borderColor: colors.lineStrong }]}
          >
            <Text variant="title3">✕</Text>
          </Pressable>
        </View>
        {children}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  body: { paddingHorizontal: space.gutter, gap: space.lg },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  title: { flex: 1 },
  close: {
    width: touch.min,
    height: touch.min,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
