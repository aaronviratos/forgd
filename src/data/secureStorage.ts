/**
 * Keeps the login session in the phone's encrypted keychain (iOS Keychain / Android
 * Keystore) via expo-secure-store. Secure store is meant for small values, and a session
 * can be a few kilobytes, so long values are split into numbered chunks.
 * On web (development preview only) it falls back to the browser's localStorage.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK = 1800; // characters per chunk, safely under secure store's ~2 KB guidance

const safeKey = (key: string) => key.replace(/[^A-Za-z0-9._-]/g, '_');

async function getItem(key: string): Promise<string | null> {
  const k = safeKey(key);
  const count = await SecureStore.getItemAsync(`${k}.n`);
  if (count === null) return null;
  const parts: string[] = [];
  for (let i = 0; i < Number(count); i++) {
    const part = await SecureStore.getItemAsync(`${k}.${i}`);
    if (part === null) return null; // incomplete write: treat as signed out
    parts.push(part);
  }
  return parts.join('');
}

async function removeItem(key: string): Promise<void> {
  const k = safeKey(key);
  const count = Number((await SecureStore.getItemAsync(`${k}.n`)) ?? 0);
  await SecureStore.deleteItemAsync(`${k}.n`);
  for (let i = 0; i < count; i++) await SecureStore.deleteItemAsync(`${k}.${i}`);
}

async function setItem(key: string, value: string): Promise<void> {
  const k = safeKey(key);
  await removeItem(key);
  const count = Math.ceil(value.length / CHUNK);
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(`${k}.${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
  }
  // Written last, so a half-finished write reads as "no session" rather than garbage.
  await SecureStore.setItemAsync(`${k}.n`, String(count));
}

const webStorage = {
  getItem: async (key: string) => globalThis.localStorage?.getItem(key) ?? null,
  setItem: async (key: string, value: string) => globalThis.localStorage?.setItem(key, value),
  removeItem: async (key: string) => globalThis.localStorage?.removeItem(key),
};

export const secureStorage = Platform.OS === 'web' ? webStorage : { getItem, setItem, removeItem };
