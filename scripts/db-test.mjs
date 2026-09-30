#!/usr/bin/env node
/**
 * Runs the pgTAP tests in supabase/tests/database against the linked Supabase project,
 * without Docker (the stock `supabase test db` runner needs Docker even for remote runs).
 *
 * Each test file must start with `begin;` and end with `select * from finish(); rollback;`,
 * with each assertion as its own statement starting at the beginning of a line
 * (`select ok(...)`, `select is(...)`, ...). The Supabase API only returns the last
 * result, so this script saves each assertion's output into a temporary table and reads
 * it back just before the rollback. Nothing a test does is ever saved.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIR = 'supabase/tests/database';
const FINISH = /select \* from finish\(\);\s*rollback;\s*$/i;
const ASSERT =
  /^select (ok|is|isnt|throws_ok|lives_ok|is_empty|isnt_empty|results_eq|set_eq|bag_eq|has_table|has_column|policies_are|pass|fail)\(/gim;

const files = readdirSync(DIR).filter((f) => f.endsWith('.test.sql'));
const tmp = mkdtempSync(join(tmpdir(), 'forgd-dbtest-'));
let failed = 0;

for (const file of files) {
  const sql = readFileSync(join(DIR, file), 'utf8');
  if (!/^\s*(--.*\n\s*)*begin;/i.test(sql) || !FINISH.test(sql)) {
    console.error(
      `✗ ${file}: must start with "begin;" and end with "select * from finish(); rollback;"`,
    );
    failed++;
    continue;
  }
  const planned = Number(/select plan\((\d+)\)/i.exec(sql)?.[1] ?? NaN);
  const runnable = sql
    .replace(
      /begin;/i,
      // Tests switch to the signed-out and signed-in roles, which must be able to record results.
      'begin;\ncreate temp table tap_out (n serial primary key, line text);\n' +
        'grant insert, select on pg_temp.tap_out to public;\n' +
        'grant usage on sequence pg_temp.tap_out_n_seq to public;',
    )
    .replace(ASSERT, 'insert into pg_temp.tap_out (line) select $1(')
    .replace(FINISH, 'select line from pg_temp.tap_out order by n;\nrollback;\n');
  const path = join(tmp, file);
  writeFileSync(path, runnable);

  const out = spawnSync('npx', ['supabase', 'db', 'query', '--linked', '-f', path], {
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const text = `${out.stdout ?? ''}`;
  let rows;
  try {
    rows = JSON.parse(text.slice(text.indexOf('{'))).rows;
    if (!Array.isArray(rows)) throw new Error('no rows');
  } catch {
    console.error(
      `✗ ${file}: the test script errored before finishing\n${out.stdout}\n${out.stderr}`,
    );
    failed++;
    continue;
  }

  console.log(`\n${file}`);
  for (const { line } of rows) {
    // pgTAP prints "ok 3 - description" or "not ok 3 - description" plus "# ..." details.
    const [head, ...details] = String(line).split('\n');
    const passed = head.startsWith('ok');
    console.log(`  ${passed ? '✓' : '✗'} ${head.replace(/^(not )?ok \d+ - /, '')}`);
    if (!passed) {
      failed++;
      if (details.length) console.log(`      ${details.join('\n      ')}`);
    }
  }
  if (rows.length !== planned) {
    console.error(`  ✗ planned ${planned} tests but ${rows.length} ran`);
    failed++;
  }
}

rmSync(tmp, { recursive: true, force: true });
console.log(failed ? `\n${failed} problem(s)` : '\nAll database tests passed');
process.exit(failed ? 1 : 0);
