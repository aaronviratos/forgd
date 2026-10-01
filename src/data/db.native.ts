/**
 * The on-phone database. Development builds and store builds use PowerSync's native
 * SQLite (fast, crash-safe, kept on the phone). Inside Expo Go, which cannot load that
 * native code, it uses PowerSync's JavaScript SQLite.
 *
 * Expo Go keeps that database in memory only. The JavaScript SQLite saves to storage by
 * exporting the database, and exporting closes and reopens it, which wipes the sync
 * engine's progress mid-sync ("powersync_control: invalid state: No iteration is active").
 * So in Expo Go: everything syncs normally and comes back from Supabase when the app
 * reopens, but changes made offline are kept only while the app stays open.
 * Real builds have none of these limits.
 */
import { SQLJSOpenFactory } from '@powersync/adapter-sql-js';
import { PowerSyncDatabase } from '@powersync/react-native';
import Constants from 'expo-constants';

import { AppSchema } from './schema';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';

export const db = new PowerSyncDatabase({
  schema: AppSchema,
  ...(isExpoGo
    ? { factory: new SQLJSOpenFactory({ dbFilename: 'forgd.db' }) }
    : { database: { dbFilename: 'forgd.db' } }),
});
