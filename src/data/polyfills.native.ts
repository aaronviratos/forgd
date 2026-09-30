/**
 * Web-standard pieces phones are missing, loaded before anything else (imported first in
 * src/app/_layout.tsx). Browsers already have these; see polyfills.ts.
 */
import 'react-native-url-polyfill/auto';

import { getRandomValues } from 'expo-crypto';

// Secure random numbers: used by the Supabase sign-in link (PKCE) and the Expo Go database.
const g = globalThis as { crypto?: { getRandomValues?: unknown } };
g.crypto ??= {};
g.crypto.getRandomValues ??= getRandomValues;
