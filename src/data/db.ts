/**
 * Web (development preview only): there is no on-device database. Screens that need
 * data show sign-in and empty states; real data is tested on phones.
 * Phones use db.native.ts instead of this file.
 */
import type { AbstractPowerSyncDatabase as PowerSyncDatabase } from '@powersync/common';

export const isExpoGo = false;
export const db: PowerSyncDatabase | null = null;
