import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { buildTheme, DEFAULT_UI_PREFS, type Theme, type UiPrefs } from './theme';

type ThemeContextValue = {
  theme: Theme;
  setPrefs: (change: Partial<UiPrefs>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Supplies the current theme to every screen. Follows the phone's light/dark setting
 * unless the user picks one. Prefs live in memory for now; step 5 (offline data)
 * saves them with the user's settings.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [prefs, setPrefsState] = useState<UiPrefs>(DEFAULT_UI_PREFS);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: buildTheme(prefs, system === 'dark' ? 'dark' : 'light'),
      setPrefs: (change) => setPrefsState((p) => ({ ...p, ...change })),
    }),
    [prefs, system],
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
