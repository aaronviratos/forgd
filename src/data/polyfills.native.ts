/**
 * Loaded before anything else, from the app entry point (index.js).
 * Fills in web-standard pieces phones lack; browsers already have them (see polyfills.ts).
 */
import 'react-native-url-polyfill/auto';

import { getRandomValues } from 'expo-crypto';

// Secure random numbers: used by the Supabase sign-in link (PKCE) and the Expo Go database.
const g = globalThis as { crypto?: { getRandomValues?: unknown } };
g.crypto ??= {};
g.crypto.getRandomValues ??= getRandomValues;
