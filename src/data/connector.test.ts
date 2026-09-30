import { UpdateType } from '@powersync/common';

import { applyChange, isPermanentError } from './connector';

// A fake Supabase that records which call each change turns into.
const calls: { table: string; method: string; args: unknown[] }[] = [];
jest.mock('./supabase', () => {
  const chain = (table: string) => {
    const record =
      (method: string) =>
      (...args: unknown[]) => {
        calls.push({ table, method, args });
        return api;
      };
    const api: Record<string, unknown> = {
      upsert: record('upsert'),
      update: record('update'),
      delete: record('delete'),
      eq: record('eq'),
      error: null,
    };
    return api;
  };
  return { supabase: { from: (t: string) => chain(t) } };
});

const change = (table: string, op: UpdateType, opData?: Record<string, unknown>) =>
  ({ table, op, id: 'row-1', opData }) as never;

beforeEach(() => {
  calls.length = 0;
});

describe('uploading changes', () => {
  it('only ever updates profiles (the server creates them)', async () => {
    await applyChange(change('profiles', UpdateType.PUT, { ui: '{}' }));
    expect(calls.map((c) => c.method)).toEqual(['update', 'eq']);
  });

  it('merges shared-id rows without blanking fields the device did not set', async () => {
    await applyChange(change('days', UpdateType.PUT, { weight_kg: 96.2, sleep_h: null }));
    expect(calls[0]).toEqual({
      table: 'days',
      method: 'upsert',
      args: [{ weight_kg: 96.2, id: 'row-1' }, undefined],
    });
  });

  it('adds consents without ever overwriting one', async () => {
    await applyChange(change('consents', UpdateType.PUT, { kind: 'terms' }));
    expect(calls[0].args[1]).toEqual({ ignoreDuplicates: true });
  });

  it('refuses to upload server-owned tables', async () => {
    const result = await applyChange(change('xp_events', UpdateType.PUT, { amount: 9999 }));
    expect(calls).toEqual([]);
    expect(result?.error?.code).toBe('42501');
  });

  it('sends edits and deletes by id', async () => {
    await applyChange(change('food_entries', UpdateType.PATCH, { qty: 2 }));
    await applyChange(change('food_entries', UpdateType.DELETE));
    expect(calls.map((c) => c.method)).toEqual(['update', 'eq', 'delete', 'eq']);
  });
});

describe('which failures are permanent', () => {
  it('sets aside rule violations but retries everything else', () => {
    expect(isPermanentError('42501')).toBe(true); // row-level security
    expect(isPermanentError('23505')).toBe(true); // duplicate
    expect(isPermanentError('22P02')).toBe(true); // bad value
    expect(isPermanentError(undefined)).toBe(false); // network error
    expect(isPermanentError('PGRST301')).toBe(false); // expired session: refresh and retry
  });
});
