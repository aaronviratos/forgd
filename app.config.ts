import 'tsx/cjs'; // lets this file import TypeScript (the brand constant)
import { ExpoConfig } from 'expo/config';

import { BRAND, BUNDLE_ID } from './src/config/brand';

// Dark "plate" color from docs/02-design-system.md, used behind the splash and Android icon.
const PLATE = '#24292B';

const config: ExpoConfig = {
  name: BRAND.name,
  // Internal Expo project name, neutral like the store ID (the brand name is pending).
  slug: 'kefalos',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: BRAND.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: false,
    icon: './assets/expo.icon',
  },
  android: {
    package: BUNDLE_ID,
    adaptiveIcon: {
      backgroundColor: PLATE,
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    // Web is only for quick previews during development; phones are the target.
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: PLATE,
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
  ],
  extra: {
    // Links this app to the Expo project for cloud builds (EAS).
    eas: { projectId: '2c8734f2-53cd-45cd-97ae-29aa4a52a99d' },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
