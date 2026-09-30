/**
 * A thin strip under the top bar (docs/03, W): "Offline, saving on your phone" when there
 * is no connection, "Saving" while changes upload, and nothing when all is synced.
 * Waits a few seconds before showing "offline", so it never flashes while connecting.
 */
import { useStatus } from '@powersync/react';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { space } from '@/theme/tokens';

import { Text } from './Text';

const OFFLINE_GRACE_MS = 4000;

export function SyncStatus() {
  const status = useStatus();
  const { colors } = useTheme();
  const disconnected = !status.connected && !status.connecting;
  const [graceOver, setGraceOver] = useState(false);
  const showOffline = disconnected && graceOver;

  useEffect(() => {
    if (!disconnected) return;
    const t = setTimeout(() => setGraceOver(true), OFFLINE_GRACE_MS);
    return () => {
      clearTimeout(t);
      setGraceOver(false); // back online: the next outage gets a fresh grace period
    };
  }, [disconnected]);

  const label = showOffline
    ? 'Offline. Saving on your phone.'
    : status.dataFlowStatus.uploading
      ? 'Saving…'
      : null;
  if (!label) return null;

  return (
    <View
      role="status"
      aria-live="polite"
      style={[styles.strip, { backgroundColor: colors.plate, borderColor: colors.plateLine }]}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: showOffline ? colors.plateMuted : colors.accentOnPlate },
        ]}
      />
      <Text variant="caption" tone="plateMuted" numberOfLines={1} maxFontSizeMultiplier={1.2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingVertical: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
