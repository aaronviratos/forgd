/**
 * A copy of the appearance settings kept on the phone, read before the splash screen
 * hides, so the app opens straight into the user's colours instead of flashing the
 * defaults while their profile loads. The profile (synced) stays the source of truth;
 * this is only a fast start-up copy. Not sensitive, but cleared on sign-out anyway.
 */
import { secureStorage } from '@/data/secureStorage';

import { parseUiPrefs, type UiPrefs } from './theme';

const KEY = 'forgd.ui-prefs';

export async function readCachedPrefs(): Promise<Partial<UiPrefs>> {
  try {
    return parseUiPrefs(await secureStorage.getItem(KEY));
  } catch {
    return {};
  }
}

export function writeCachedPrefs(prefs: UiPrefs): void {
  secureStorage.setItem(KEY, JSON.stringify(prefs)).catch(() => {});
}

export function clearCachedPrefs(): void {
  secureStorage.removeItem(KEY).catch(() => {});
}
