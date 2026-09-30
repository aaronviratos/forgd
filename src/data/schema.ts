/**
 * The on-phone copy of the database (PowerSync). Mirrors the Supabase tables in
 * supabase/migrations/, which stay the source of truth for types and rules.
 *
 * PowerSync stores three column types:
 *   text    uuid, text, date (YYYY-MM-DD), time, timestamps, and JSON (as a string)
 *   integer whole numbers and true/false (1/0)
 *   real    decimals (Postgres numeric)
 * Every table also has an `id` text column, added automatically.
 *
 * When a migration adds or changes a column, change it here too.
 */
import { column, Schema, Table } from '@powersync/common';

const { text, integer, real } = column;

/** Timestamps every user-logged table carries. */
const stamps = { logged_at: text, created_at: text, updated_at: text };

const profiles = new Table({
  name: text,
  sex: text,
  date_of_birth: text,
  height_cm: real,
  weight_unit: text,
  length_unit: text,
  water_unit: text,
  day_ends_at: text,
  time_zone: text,
  onboarded: integer,
  goal_primary: text,
  goal_why: text,
  event_name: text,
  division: text,
  experience: text,
  goal_date: text,
  start_date: text,
  start_weight_kg: real,
  goal_weight_kg: real,
  goal_waist_cm: real,
  targets: text,
  base: text,
  diet: text,
  medical: text,
  track: text,
  program: text,
  nutrition_plan: text,
  measure_prefs: text,
  journey: text,
  ui: text,
  avatar_path: text,
  next_labs_on: text,
  show_hormones: integer,
  created_at: text,
  updated_at: text,
});

const consents = new Table({
  user_id: text,
  kind: text,
  version: text,
  granted: integer,
  created_at: text,
});

const days = new Table(
  {
    user_id: text,
    log_date: text,
    time_zone: text,
    weight_kg: real,
    body_fat_pct: real,
    bp_sys: integer,
    bp_dia: integer,
    pulse: integer,
    sleep_h: real,
    cpap: integer,
    rhr: integer,
    hrv: real,
    recovery: real,
    strain: real,
    digestion: integer,
    energy: integer,
    hunger: integer,
    mood: integer,
    pm_bp_sys: integer,
    pm_bp_dia: integer,
    pm_pulse: integer,
    cal: real,
    protein_g: real,
    carb_g: real,
    fat_g: real,
    meals: integer,
    water_ml: real,
    sodium_mg: real,
    workout_done: integer,
    workout_type: text,
    workout_start: text,
    workout_end: text,
    lifts_text: text,
    pain: text,
    posing: integer,
    vacuums: integer,
    cardio_done: integer,
    cardio_type: text,
    cardio_min: real,
    cardio_hr: integer,
    steps: integer,
    side_effects: text,
    flags: text,
    injection_reaction: integer,
    nausea: integer,
    notes: text,
    sections_done: text,
    sources: text,
    imported: integer,
    ...stamps,
  },
  { indexes: { date: ['log_date'] } },
);

const food_entries = new Table(
  {
    user_id: text,
    log_date: text,
    meal: integer,
    food_id: text,
    name: text,
    serving: text,
    qty: real,
    cal: real,
    protein_g: real,
    carb_g: real,
    fat_g: real,
    estimated: integer,
    source: text,
    swap: text,
    swapped_from: text,
    ...stamps,
  },
  { indexes: { date: ['log_date'] } },
);

const exercises = new Table({
  user_id: text,
  name: text,
  muscle_group: text,
  equipment: text,
  created_at: text,
  updated_at: text,
});

const exercise_entries = new Table(
  {
    user_id: text,
    log_date: text,
    position: integer,
    exercise_id: text,
    exercise_name: text,
    target: text,
    rest_s: integer,
    notes: text,
    ...stamps,
  },
  { indexes: { date: ['log_date'] } },
);

const set_entries = new Table(
  {
    user_id: text,
    exercise_entry_id: text,
    log_date: text,
    position: integer,
    weight_kg: real,
    entered_unit: text,
    reps: integer,
    rir: real,
    rpe: real,
    set_type: text,
    done: integer,
    ...stamps,
  },
  { indexes: { entry: ['exercise_entry_id'], date: ['log_date'] } },
);

const protocol_items = new Table({
  user_id: text,
  name: text,
  category: text,
  catalog_key: text,
  purpose: text,
  dose: text,
  route: text,
  frequency: text,
  timing: text,
  prescribed_by: text,
  start_date: text,
  end_date: text,
  notes: text,
  created_at: text,
  updated_at: text,
});

const protocol_logs = new Table(
  {
    user_id: text,
    log_date: text,
    item_id: text,
    group_key: text,
    done: integer,
    site: text,
    taken_at: text,
    ...stamps,
  },
  { indexes: { date: ['log_date'] } },
);

const check_ins = new Table({
  user_id: text,
  week_start: text,
  waist_cm: real,
  photos: text,
  side_effects: text,
  injuries: text,
  notes: text,
  summary: text,
  imported: integer,
  ...stamps,
});

const measurements = new Table({
  user_id: text,
  measured_on: text,
  neck_cm: real,
  shoulders_cm: real,
  chest_cm: real,
  bicep_l_cm: real,
  bicep_r_cm: real,
  forearm_l_cm: real,
  forearm_r_cm: real,
  waist_cm: real,
  hips_cm: real,
  thigh_l_cm: real,
  thigh_r_cm: real,
  calf_l_cm: real,
  calf_r_cm: real,
  body_fat_pct: real,
  photo_path: text,
  note: text,
  imported: integer,
  ...stamps,
});

const lab_draws = new Table({
  user_id: text,
  drawn_on: text,
  markers: text,
  notes: text,
  source: text,
  imported: integer,
  ...stamps,
});

const foods = new Table({
  user_id: text,
  name: text,
  serving: text,
  cal: real,
  protein_g: real,
  carb_g: real,
  fat_g: real,
  estimated: integer,
  source: text,
  barcode: text,
  ingredients: text,
  servings: real,
  swap: text,
  uses: integer,
  last_used_at: text,
  created_at: text,
  updated_at: text,
});

// Written by the server only; the app reads these and never writes them.
const xp_events = new Table(
  {
    user_id: text,
    stat: text,
    amount: integer,
    source: text,
    log_date: text,
    entry_table: text,
    entry_id: text,
    created_at: text,
  },
  { indexes: { date: ['log_date'] } },
);

const user_stats = new Table({
  stat_xp: text,
  overall_xp: integer,
  level: integer,
  rank: text,
  week_gains: text,
  streak: integer,
  best_streak: integer,
  verified_share: real,
  updated_at: text,
});

const lift_bests = new Table({
  user_id: text,
  exercise_key: text,
  best_e1rm_kg: real,
  weight_kg: real,
  reps: integer,
  achieved_on: text,
  set_entry_id: text,
  updated_at: text,
});

const badges = new Table({
  user_id: text,
  badge_key: text,
  earned_on: text,
  created_at: text,
});

const insights = new Table({
  user_id: text,
  kind: text,
  for_date: text,
  content: text,
  created_at: text,
});

/** Server switches; `id` is the switch name (synced as `key AS id`). */
const app_config = new Table({ value: text, updated_at: text });

export const AppSchema = new Schema({
  profiles,
  consents,
  days,
  food_entries,
  exercises,
  exercise_entries,
  set_entries,
  protocol_items,
  protocol_logs,
  check_ins,
  measurements,
  lab_draws,
  foods,
  xp_events,
  user_stats,
  lift_bests,
  badges,
  insights,
  app_config,
});

export type Database = (typeof AppSchema)['types'];
export type TableName = keyof Database;

/** Tables the app may change. Everything else is read-only (written by the server). */
export const WRITABLE: ReadonlySet<TableName> = new Set<TableName>([
  'profiles',
  'consents',
  'days',
  'food_entries',
  'exercises',
  'exercise_entries',
  'set_entries',
  'protocol_items',
  'protocol_logs',
  'check_ins',
  'measurements',
  'lab_draws',
  'foods',
]);
