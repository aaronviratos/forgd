/**
 * Keeps appearance settings (theme, accent, background, text size) in the user's profile
 * (profiles.ui), so they survive closing the app and follow the user to a new phone.
 * Renders nothing; mounted once while signed in on a phone.
 *
 * Rules that keep the user's choice safe:
 * - Never save before the saved settings have been read at least once, so starting up with
 *   defaults can never overwrite what the user picked.
 * - Compare values, not text: Supabase returns JSON with different spacing than the app
 *   writes, and that alone must not trigger a save.
 */
import { usePowerSync, useQuery } from '@powersync/react';
import { useEffect, useRef } from 'react';

import { useThemeContext } from '@/theme/ThemeProvider';
import { parseUiPrefs, type UiPrefs } from '@/theme/theme';

/** One canonical text form of a set of prefs, for comparing values. */
const canonical = (p: UiPrefs) => JSON.stringify([p.theme, p.accent, p.surface, p.textSize]);

export function UiPrefsSync({ userId }: { userId: string }) {
  const db = usePowerSync();
  const { theme, setPrefs } = useThemeContext();
  const { data } = useQuery<{ ui: string | null }>('SELECT ui FROM profiles WHERE id = ?', [
    userId,
  ]);
  const hasProfile = data.length > 0;
  const stored = data[0]?.ui ?? null;

  /** The raw value last seen in the database, to notice changes from other devices. */
  const lastStored = useRef<string | null>(null);
  /** The prefs (canonical form) known to match the database. Null until first read. */
  const inDatabase = useRef<string | null>(null);

  // Load: apply saved settings when they arrive, or when another device changes them.
  useEffect(() => {
    if (!hasProfile || stored === lastStored.current) return;
    lastStored.current = stored;
    const merged = { ...theme.prefs, ...parseUiPrefs(stored) };
    inDatabase.current = canonical(merged);
    setPrefs(merged);
  }, [hasProfile, stored, theme.prefs, setPrefs]);

  // Save: write changes shortly after the user stops tapping.
  const current = canonical(theme.prefs);
  const json = JSON.stringify(theme.prefs);
  useEffect(() => {
    // Not read yet, or nothing changed: never save.
    if (inDatabase.current === null || current === inDatabase.current) return;
    const timer = setTimeout(() => {
      inDatabase.current = current;
      db.execute('UPDATE profiles SET ui = ? WHERE id = ?', [json, userId]).catch((e) =>
        console.warn('Could not save appearance settings', e),
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [current, json, db, userId]);

  return null;
}
