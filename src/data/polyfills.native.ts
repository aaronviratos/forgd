/**
 * Loaded before anything else, from the app entry point (index.js).
 * Fills in web-standard pieces phones lack; browsers already have them (see polyfills.ts).
 */
import 'react-native-url-polyfill/auto';

import Constants from 'expo-constants';
import { getRandomValues } from 'expo-crypto';

// Secure random numbers: used by the Supabase sign-in link (PKCE) and the Expo Go database.
const g = globalThis as { crypto?: { getRandomValues?: unknown }; __OPSQLiteProxy?: unknown };
g.crypto ??= {};
g.crypto.getRandomValues ??= getRandomValues;

// Expo Go only. PowerSync loads the native SQLite driver (op-sqlite) as soon as it is
// imported, and that driver throws right away if its native code is missing, which it is
// in Expo Go. In Expo Go the app uses PowerSync's JavaScript SQLite instead (db.native.ts),
// so give the driver a stand-in that loads fine but fails loudly if anything ever calls it.
// Development and store builds include the real driver and never reach this.
if (Constants.executionEnvironment === 'storeClient') {
  g.__OPSQLiteProxy ??= new Proxy(
    {},
    {
      get(_target, key) {
        throw new Error(
          `The native database (op-sqlite.${String(key)}) is not available in Expo Go. ` +
            'Expo Go uses the JavaScript database; see src/data/db.native.ts.',
        );
      },
    },
  );
}
