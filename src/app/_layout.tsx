import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_500Medium,
  AtkinsonHyperlegibleNext_600SemiBold,
  AtkinsonHyperlegibleNext_700Bold,
  AtkinsonHyperlegibleNext_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/atkinson-hyperlegible-next';
import { SairaStencilOne_400Regular } from '@expo-google-fonts/saira-stencil-one';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { backendConfigured } from '@/config/backend';
import { DataProvider, useData } from '@/data/DataProvider';
import { db } from '@/data/db';
import { UiPrefsSync } from '@/data/UiPrefsSync';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    AtkinsonHyperlegibleNext_400Regular,
    AtkinsonHyperlegibleNext_500Medium,
    AtkinsonHyperlegibleNext_600SemiBold,
    AtkinsonHyperlegibleNext_700Bold,
    AtkinsonHyperlegibleNext_800ExtraBold,
    SairaStencilOne_400Regular,
  });

  // Keep the splash screen up until fonts are ready (if they fail, fall back to system fonts).
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DataProvider>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <ThemedStack />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </DataProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { colors, mode } = useTheme();
  const { ready, userId } = useData();
  // Until sign-in is configured, let development continue without it.
  const signedIn = !!userId || !backendConfigured();

  // Hide the splash screen once the saved session has been checked, so the app opens
  // straight onto the right screen instead of flashing sign-in first.
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;

  return (
    <>
      {/* Main screens have the dark plate top bar, so status bar text is light there. */}
      <StatusBar style={signedIn || mode === 'dark' ? 'light' : 'dark'} />
      {db && userId ? <UiPrefsSync userId={userId} /> : null}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="gallery" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="sign-in" />
        </Stack.Protected>
      </Stack>
    </>
  );
}
