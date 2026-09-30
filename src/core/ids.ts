import { v5 as uuidv5 } from 'uuid';

/**
 * Deterministic IDs for rows that must be one-per-something (one day per date, one
 * check-in per week, one check-off per item per day). Every device computes the same ID
 * from the same inputs, so if two phones log the same day offline their changes merge
 * field by field instead of creating two rows (docs/07, decision 3).
 *
 * Changing NAMESPACE would orphan every existing row: never change it.
 */
const NAMESPACE = '6f1c0a52-0f6e-4c55-9d3e-2a4b8e1d7c90';

const isDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

function make(kind: string, userId: string, ...parts: string[]): string {
  return uuidv5([kind, userId, ...parts].join(':'), NAMESPACE);
}

/** The single `days` row for this user and log date (YYYY-MM-DD). */
export function dayId(userId: string, logDate: string): string {
  if (!isDate(logDate)) throw new Error(`dayId needs YYYY-MM-DD, got "${logDate}"`);
  return make('day', userId, logDate);
}

/** The single weekly check-in for the week starting on this local Monday. */
export function checkInId(userId: string, weekStart: string): string {
  if (!isDate(weekStart)) throw new Error(`checkInId needs YYYY-MM-DD, got "${weekStart}"`);
  return make('checkin', userId, weekStart);
}

/** The single check-off for a protocol item (or supplement time group) on a date. */
export function protocolLogId(userId: string, itemOrGroup: string, logDate: string): string {
  if (!isDate(logDate)) throw new Error(`protocolLogId needs YYYY-MM-DD, got "${logDate}"`);
  return make('protocol', userId, itemOrGroup, logDate);
}
