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

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Keep the splash screen up until fonts are ready (if they fail, fall back to system fonts).
  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <ThemedStack />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { colors } = useTheme();
  return (
    <>
      {/* The top bar is the dark plate in both modes, so status bar text is always light. */}
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </>
  );
}
