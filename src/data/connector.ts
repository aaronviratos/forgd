/**
 * Connects the on-phone database (PowerSync) to Supabase:
 * - fetchCredentials: hands PowerSync the signed-in user's session token.
 * - uploadData: sends changes made on the phone to Supabase, in order.
 *
 * Temporary failures (no signal, server hiccup) throw, and PowerSync retries later with
 * nothing lost. A change the server will never accept (a privacy rule or a check
 * constraint) is set aside so it cannot block every change behind it.
 */
import {
  type AbstractPowerSyncDatabase,
  type CrudEntry,
  type PowerSyncBackendConnector,
  UpdateType,
} from '@powersync/common';

import { POWERSYNC_URL } from '@/config/backend';

import { type TableName, WRITABLE } from './schema';
import { supabase } from './supabase';

/**
 * Postgres errors that retrying can never fix: bad data (22...), constraint violations
 * (23...), and permission denied / row-level security (42501).
 */
export function isPermanentError(code: string | undefined): boolean {
  return !!code && (code.startsWith('22') || code.startsWith('23') || code === '42501');
}

/** Tables whose rows use a shared, computed ID and must merge rather than overwrite. */
const MERGE_TABLES: ReadonlySet<string> = new Set(['days', 'check_ins', 'protocol_logs']);

/** Drop empty values, so a device that only knows some fields never blanks the others. */
function withoutNulls(record: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(record).filter(([, v]) => v !== null && v !== undefined),
  );
}

/** Sends one change to Supabase. Exported for tests. */
export async function applyChange(op: CrudEntry) {
  const table = op.table as TableName;
  if (!WRITABLE.has(table)) {
    // The app never writes server-owned tables; if it somehow did, refuse to upload.
    return { error: { code: '42501', message: `${table} is read-only from the app` } };
  }
  const q = supabase.from(table);
  const data = op.opData ?? {};

  switch (op.op) {
    case UpdateType.PUT: {
      if (table === 'profiles') {
        // Profiles are created by the server at sign-up; the app only ever updates them.
        return q.update(data).eq('id', op.id);
      }
      const record = { ...(MERGE_TABLES.has(table) ? withoutNulls(data) : data), id: op.id };
      // Consents are a legal record: add once, never overwrite (retries are harmless).
      return q.upsert(record, table === 'consents' ? { ignoreDuplicates: true } : undefined);
    }
    case UpdateType.PATCH:
      return q.update(data).eq('id', op.id);
    case UpdateType.DELETE:
      return q.delete().eq('id', op.id);
  }
}

export class SupabaseConnector implements PowerSyncBackendConnector {
  async fetchCredentials() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null; // signed out: PowerSync stays offline
    return { endpoint: POWERSYNC_URL, token: data.session.access_token };
  }

  async uploadData(db: AbstractPowerSyncDatabase) {
    const tx = await db.getNextCrudTransaction();
    if (!tx) return;

    for (const op of tx.crud) {
      const result = await applyChange(op);
      const error = result?.error as { code?: string; message?: string } | null | undefined;
      if (!error) continue;
      if (isPermanentError(error.code)) {
        // Will never succeed: note it and move on so later changes still upload.
        console.warn(`Change to ${op.table} rejected (${error.code}): ${error.message}`);
        continue;
      }
      throw new Error(`Upload failed, will retry: ${error.message ?? error.code}`);
    }
    await tx.complete();
  }
}
