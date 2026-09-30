/**
 * Keeps appearance settings (theme, accent, background, text size) in the user's profile
 * (profiles.ui), so they survive closing the app and follow the user to a new phone.
 * Renders nothing; mounted once while signed in on a phone.
 */
import { usePowerSync, useQuery } from '@powersync/react';
import { useEffect, useRef } from 'react';

import { useThemeContext } from '@/theme/ThemeProvider';
import { parseUiPrefs } from '@/theme/theme';

export function UiPrefsSync({ userId }: { userId: string }) {
  const db = usePowerSync();
  const { theme, setPrefs } = useThemeContext();
  const { data } = useQuery<{ ui: string | null }>('SELECT ui FROM profiles WHERE id = ?', [
    userId,
  ]);
  const hasProfile = data.length > 0;
  const stored = data[0]?.ui ?? null;
  // The last value known to be in the database, so loading never triggers a save.
  const lastSynced = useRef<string | null>(null);

  // Load: apply saved settings when they arrive, or when another device changes them.
  useEffect(() => {
    if (!stored || stored === lastSynced.current) return;
    lastSynced.current = stored;
    const saved = parseUiPrefs(stored);
    if (Object.keys(saved).length) setPrefs(saved);
  }, [stored, setPrefs]);

  // Save: write changes shortly after the user stops tapping.
  const json = JSON.stringify(theme.prefs);
  useEffect(() => {
    if (!hasProfile || json === lastSynced.current) return;
    const timer = setTimeout(() => {
      lastSynced.current = json;
      db.execute('UPDATE profiles SET ui = ? WHERE id = ?', [json, userId]).catch((e) =>
        console.warn('Could not save appearance settings', e),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [json, hasProfile, db, userId]);

  return null;
}
