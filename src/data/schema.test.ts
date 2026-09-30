/**
 * The phone's schema must match the Supabase tables exactly, or syncing silently drops
 * columns. This reads the migration files and compares table by table.
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { AppSchema } from './schema';

const DIR = join(__dirname, '../../supabase/migrations');

/** Column names per table from every `create table public.x (...)` in the migrations. */
function serverColumns(): Record<string, Set<string>> {
  const sql = readdirSync(DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => readFileSync(join(DIR, f), 'utf8'))
    .join('\n');
  const tables: Record<string, Set<string>> = {};
  for (const m of sql.matchAll(/create table public\.(\w+) \(([\s\S]*?)\n\);/g)) {
    const cols = new Set<string>();
    for (const line of m[2].split('\n')) {
      const name = /^ {2}([a-z_][a-z0-9_]*) /.exec(line)?.[1];
      if (name && !['unique', 'check', 'primary', 'constraint', 'foreign'].includes(name)) {
        cols.add(name);
      }
    }
    tables[m[1]] = cols;
  }
  for (const m of sql.matchAll(/alter table public\.(\w+) add column (?:if not exists )?(\w+)/g)) {
    tables[m[1]]?.add(m[2]);
  }
  return tables;
}

const server = serverColumns();
const phone = Object.fromEntries(
  AppSchema.tables.map((t) => [t.name, new Set(t.columns.map((c) => c.name))]),
);

describe('phone schema matches Supabase', () => {
  it('has the same tables', () => {
    expect(Object.keys(phone).sort()).toEqual(Object.keys(server).sort());
  });

  it.each(Object.keys(server))('%s has the same columns', (table) => {
    const expected = [...server[table]].filter((c) => c !== 'id');
    // app_config is keyed by `key`, synced to the phone as `id`.
    const want = table === 'app_config' ? expected.filter((c) => c !== 'key') : expected;
    expect([...(phone[table] ?? [])].sort()).toEqual(want.sort());
  });
});
