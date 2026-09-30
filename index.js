// App entry point. Loads the polyfills (src/data/polyfills*) before Expo Router or any
// screen, so every module, including ones Expo Router loads early, can rely on them.
import './src/data/polyfills';
import 'expo-router/entry';
