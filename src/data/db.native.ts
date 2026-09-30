/**
 * The on-phone database. Development builds and store builds use PowerSync's native
 * SQLite (fast, crash-safe). Inside Expo Go, which cannot load that native code, it uses
 * PowerSync's JavaScript SQLite saved to a file: slower and less crash-safe, so it is for
 * development only (docs.powersync.com, Expo Go support).
 */
import { SQLJSOpenFactory, type SQLJSPersister } from '@powersync/adapter-sql-js';
import { PowerSyncDatabase } from '@powersync/react-native';
import Constants from 'expo-constants';
import { File, Paths } from 'expo-file-system';

import { AppSchema } from './schema';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';

/** Saves the Expo Go database to a file so it survives closing the app. */
function filePersister(name: string): SQLJSPersister {
  const file = new File(Paths.document, name);
  return {
    readFile: async () => (file.exists ? await file.bytes() : null),
    writeFile: async (data) => {
      file.write(new Uint8Array(data as ArrayLike<number>));
    },
  };
}

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  ...(isExpoGo
    ? {
        factory: new SQLJSOpenFactory({
          dbFilename: 'forgd.db',
          persister: filePersister('forgd-expo-go.db'),
        }),
      }
    : { database: { dbFilename: 'forgd.db' } }),
});
