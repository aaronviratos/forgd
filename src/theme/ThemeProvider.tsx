import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { buildTheme, DEFAULT_UI_PREFS, type Theme, type UiPrefs } from './theme';

type ThemeContextValue = {
  theme: Theme;
  setPrefs: (change: Partial<UiPrefs>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Supplies the current theme to every screen. Follows the phone's light/dark setting
 * unless the user picks one. While signed in on a phone, UiPrefsSync (src/data) loads and
 * saves the choices in the user's profile.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [prefs, setPrefsState] = useState<UiPrefs>(DEFAULT_UI_PREFS);
  const setPrefs = useCallback(
    (change: Partial<UiPrefs>) => setPrefsState((p) => ({ ...p, ...change })),
    [],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: buildTheme(prefs, system === 'dark' ? 'dark' : 'light'), setPrefs }),
    [prefs, system, setPrefs],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
