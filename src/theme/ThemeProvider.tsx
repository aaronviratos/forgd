import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { writeCachedPrefs } from './prefsCache';
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
 *
 * `initialPrefs` is the on-phone copy read before the splash screen hides, so the first
 * frame is already in the user's colours. Every change updates that copy.
 */
export function ThemeProvider({
  children,
  initialPrefs,
}: {
  children: ReactNode;
  initialPrefs?: Partial<UiPrefs>;
}) {
  const system = useColorScheme();
  const [prefs, setPrefsState] = useState<UiPrefs>(() => ({
    ...DEFAULT_UI_PREFS,
    ...initialPrefs,
  }));
  const setPrefs = useCallback(
    (change: Partial<UiPrefs>) => setPrefsState((p) => ({ ...p, ...change })),
    [],
  );

  useEffect(() => {
    writeCachedPrefs(prefs);
  }, [prefs]);

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
