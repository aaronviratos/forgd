-- FORGD initial schema (Milestone 1, step 4). Data model: docs/06-data-and-rules.md.
--
-- Rules that hold for every table below:
-- * Every row belongs to one user (user_id), and row-level security means a signed-in
--   user can only ever read or change their own rows. Nobody signed out can read anything.
-- * Deleting a login deletes all of that user's rows (on delete cascade), for in-app
--   account deletion (docs/07, decision 2).
-- * Values are stored in canonical units: kg, cm, ml (docs/07, decision 1). Column names
--   say the unit (weight_kg, waist_cm, water_ml) so nobody has to guess.
-- * Primary keys are UUIDs made on the phone, so rows can be created offline (PowerSync).
--   Rows that must be one-per-something (one day per date, one check-in per week) get a
--   deterministic ID from the phone plus a unique constraint, so two devices logging the
--   same day offline merge instead of colliding.
-- * logged_at is when the user logged it on their phone (can be before it reached the
--   server); created_at is when the server received it. XP timing uses logged_at, which
--   can never be later than created_at (docs/07, decision 5).
-- * Tables written only by the server (XP, stats, lift records, badges, AI results) are
--   read-only for users, so the card cannot be edited directly (docs/07, decision 6).

-- Helper functions live in a schema the public API does not expose.
create schema if not exists private;

create or replace function private.touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.clamp_logged_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- A phone clock can be wrong or changed; never accept a time in the future.
  new.logged_at := least(coalesce(new.logged_at, now()), now());
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profile and settings: one row per user, id = the login's id.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  sex text check (sex in ('male', 'female', 'other')),
  date_of_birth date,
  height_cm numeric(5, 1) check (height_cm > 0),
  -- Display units; values are always stored in kg, cm and ml.
  weight_unit text not null default 'lb' check (weight_unit in ('lb', 'kg')),
  length_unit text not null default 'in' check (length_unit in ('in', 'cm')),
  water_unit text not null default 'oz' check (water_unit in ('oz', 'ml')),
  -- "My day ends at" (docs/07, decision 4) and the phone's time zone.
  day_ends_at time not null default '03:00',
  time_zone text,
  onboarded boolean not null default false,
  -- Goal (docs/06): primary, own words, event, division, experience.
  goal_primary text,
  goal_why text,
  event_name text,
  division text,
  experience text,
  goal_date date,
  start_date date,
  start_weight_kg numeric(5, 2) check (start_weight_kg > 0),
  goal_weight_kg numeric(5, 2) check (goal_weight_kg > 0),
  goal_waist_cm numeric(5, 1) check (goal_waist_cm > 0),
  -- Grouped settings, each edited as a whole on one screen.
  targets jsonb not null default '{}', -- cal, protein_g, carb_g, fat_g, water_ml, meals, steps, cardio_min, hr zone, BP limits
  base jsonb not null default '{}', -- the 9 starting-stat answers
  diet jsonb not null default '{}', -- style, restrictions
  medical jsonb not null default '{}', -- conditions, diagnoses, devices, injuries, meds, allergies, history, readiness, wellbeing
  track jsonb not null default '{}', -- what to track: BP, evening BP days, wearable, posing
  program jsonb not null default '{}', -- training program (docs/06, Program)
  nutrition_plan jsonb not null default '{}',
  measure_prefs jsonb not null default '{}', -- tracked measurement spots and goals
  journey jsonb not null default '{}', -- "Build your plan" progress
  ui jsonb not null default '{}', -- theme, accent, background, text size
  avatar_path text, -- path in the private photos bucket
  next_labs_on date,
  show_hormones boolean not null default false, -- also gated by the server switch (app_config)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create the profile row as soon as someone signs up.
create or replace function private.create_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.create_profile();

-- ---------------------------------------------------------------------------
-- Consents: an append-only record of what the user accepted and when
-- (docs/07, decisions 2 and 9). Users can add and read, never edit or delete.
-- ---------------------------------------------------------------------------
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (
    kind in ('terms', 'privacy', 'medical_disclaimer', 'age_18', 'ai', 'health_sync', 'whoop', 'analytics', 'team_visibility')
  ),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);
create index consents_user on public.consents (user_id, kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Days: one row per user per log date (docs/06, Day).
-- ---------------------------------------------------------------------------
create table public.days (
  id uuid primary key, -- deterministic on the phone from (user, date)
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  time_zone text,
  -- Morning
  weight_kg numeric(5, 2) check (weight_kg > 0),
  body_fat_pct numeric(4, 1) check (body_fat_pct between 0 and 100),
  bp_sys smallint check (bp_sys > 0),
  bp_dia smallint check (bp_dia > 0),
  pulse smallint check (pulse > 0),
  sleep_h numeric(4, 2) check (sleep_h >= 0),
  cpap boolean,
  rhr smallint check (rhr > 0),
  hrv numeric(6, 1) check (hrv >= 0),
  recovery numeric(5, 1),
  strain numeric(5, 1),
  digestion smallint,
  energy smallint check (energy between 0 and 10),
  hunger smallint check (hunger between 0 and 10),
  mood smallint check (mood between 0 and 10), -- stress
  -- Evening
  pm_bp_sys smallint check (pm_bp_sys > 0),
  pm_bp_dia smallint check (pm_bp_dia > 0),
  pm_pulse smallint check (pm_pulse > 0),
  -- Nutrition totals (food entries roll up into these) and non-food fields
  cal numeric(7, 1) check (cal >= 0),
  protein_g numeric(6, 1) check (protein_g >= 0),
  carb_g numeric(6, 1) check (carb_g >= 0),
  fat_g numeric(6, 1) check (fat_g >= 0),
  meals smallint check (meals >= 0),
  water_ml numeric(7, 1) check (water_ml >= 0),
  sodium_mg numeric(7, 1) check (sodium_mg >= 0),
  -- Training
  workout_done boolean,
  workout_type text,
  workout_start time,
  workout_end time,
  lifts_text text, -- free-text lifts (notes); structured sets live in set_entries
  pain jsonb not null default '{}', -- { "lower back": 6, ... } 0-10 per tracked area
  posing boolean,
  vacuums boolean,
  -- Cardio and steps
  cardio_done boolean,
  cardio_type text,
  cardio_min numeric(5, 1) check (cardio_min >= 0),
  cardio_hr smallint check (cardio_hr > 0),
  steps integer check (steps >= 0),
  -- Health
  side_effects jsonb not null default '[]',
  flags jsonb not null default '[]', -- red-flag symptoms
  injection_reaction boolean,
  nausea smallint check (nausea between 0 and 10),
  notes text,
  sections_done jsonb not null default '[]',
  -- Where each value came from: { "steps": "synced", "weight_kg": "manual" } (anti-cheat, docs/07 decision 6)
  sources jsonb not null default '{}',
  imported boolean not null default false, -- historical import: charts and AI, no XP
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, log_date)
);

-- ---------------------------------------------------------------------------
-- Food log entries (append-only by ID, so two devices never overwrite each other).
-- ---------------------------------------------------------------------------
create table public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  meal smallint not null default 1 check (meal between 1 and 8),
  food_id uuid, -- the saved food it came from, if any
  name text not null,
  serving text,
  qty numeric(6, 2) not null default 1 check (qty > 0),
  cal numeric(7, 1) check (cal >= 0),
  protein_g numeric(6, 1) check (protein_g >= 0),
  carb_g numeric(6, 1) check (carb_g >= 0),
  fat_g numeric(6, 1) check (fat_g >= 0),
  estimated boolean not null default false,
  source text, -- manual, database, barcode, label, plate, recipe, ai
  swap jsonb, -- healthier alternative offered
  swapped_from text, -- set when the user used a healthier swap (Nutrition XP)
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index food_entries_user_date on public.food_entries (user_id, log_date);

-- ---------------------------------------------------------------------------
-- Workouts: one row per exercise done on a day, one row per set (docs/07, decision 7).
-- ---------------------------------------------------------------------------
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade, -- null = built-in library
  name text not null,
  muscle_group text,
  equipment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index exercises_user on public.exercises (user_id);

create table public.exercise_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  position smallint not null default 0,
  exercise_id uuid references public.exercises (id) on delete set null,
  exercise_name text not null, -- kept so history survives if a custom exercise is deleted
  target text, -- e.g. "4 x 8-10"
  rest_s smallint check (rest_s >= 0),
  notes text,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index exercise_entries_user_date on public.exercise_entries (user_id, log_date);

create table public.set_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_entry_id uuid not null references public.exercise_entries (id) on delete cascade,
  log_date date not null,
  position smallint not null default 0,
  weight_kg numeric(6, 2) check (weight_kg >= 0),
  entered_unit text check (entered_unit in ('lb', 'kg')), -- so 225 lb always shows as 225
  reps smallint check (reps >= 0),
  rir numeric(3, 1) check (rir >= 0),
  rpe numeric(3, 1) check (rpe between 0 and 10),
  set_type text not null default 'working' check (set_type in ('warmup', 'working', 'drop', 'failure')),
  done boolean not null default false,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index set_entries_user_date on public.set_entries (user_id, log_date);
create index set_entries_exercise_entry on public.set_entries (exercise_entry_id);

-- ---------------------------------------------------------------------------
-- Protocol: supplements, medications, devices (and hormones/peptides when enabled),
-- plus daily check-offs. Protocol never feeds stats.
-- ---------------------------------------------------------------------------
create table public.protocol_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category text not null check (category in ('supplement', 'medication', 'peptide', 'hormone', 'device', 'other')),
  catalog_key text,
  purpose text,
  dose text, -- free text, "as prescribed or directed"; the app never suggests doses
  route text,
  frequency jsonb not null default '{"type": "daily"}', -- type, days, on, off, anchor
  timing text,
  prescribed_by text,
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index protocol_items_user on public.protocol_items (user_id);

create table public.protocol_logs (
  id uuid primary key, -- deterministic on the phone from (user, item or group, date)
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null,
  item_id uuid references public.protocol_items (id) on delete cascade,
  group_key text, -- supplement time group, e.g. "Bedtime"; set instead of item_id
  done boolean,
  site text, -- injection site
  taken_at time,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((item_id is null) <> (group_key is null))
);
create index protocol_logs_user_date on public.protocol_logs (user_id, log_date);

-- ---------------------------------------------------------------------------
-- Weekly check-ins, body measurements, lab results, saved foods.
-- ---------------------------------------------------------------------------
create table public.check_ins (
  id uuid primary key, -- deterministic on the phone from (user, week_start)
  user_id uuid not null references auth.users (id) on delete cascade,
  week_start date not null, -- the user's local Monday
  waist_cm numeric(5, 1) check (waist_cm > 0),
  photos jsonb not null default '[]', -- which progress photos were taken
  side_effects text,
  injuries text,
  notes text,
  summary jsonb not null default '{}',
  imported boolean not null default false,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  measured_on date not null,
  neck_cm numeric(5, 1) check (neck_cm > 0),
  shoulders_cm numeric(5, 1) check (shoulders_cm > 0),
  chest_cm numeric(5, 1) check (chest_cm > 0),
  bicep_l_cm numeric(5, 1) check (bicep_l_cm > 0),
  bicep_r_cm numeric(5, 1) check (bicep_r_cm > 0),
  forearm_l_cm numeric(5, 1) check (forearm_l_cm > 0),
  forearm_r_cm numeric(5, 1) check (forearm_r_cm > 0),
  waist_cm numeric(5, 1) check (waist_cm > 0),
  hips_cm numeric(5, 1) check (hips_cm > 0),
  thigh_l_cm numeric(5, 1) check (thigh_l_cm > 0),
  thigh_r_cm numeric(5, 1) check (thigh_r_cm > 0),
  calf_l_cm numeric(5, 1) check (calf_l_cm > 0),
  calf_r_cm numeric(5, 1) check (calf_r_cm > 0),
  body_fat_pct numeric(4, 1) check (body_fat_pct between 0 and 100),
  photo_path text,
  note text,
  imported boolean not null default false,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index measurements_user_date on public.measurements (user_id, measured_on);

create table public.lab_draws (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  drawn_on date not null,
  markers jsonb not null default '{}', -- { "ldl": 128, "hdl": 44, ... } (41 markers, docs/06)
  notes text,
  source text not null default 'typed' check (source in ('typed', 'photo', 'imported')),
  imported boolean not null default false,
  logged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index lab_draws_user_date on public.lab_draws (user_id, drawn_on);

create table public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  serving text,
  cal numeric(7, 1) check (cal >= 0),
  protein_g numeric(6, 1) check (protein_g >= 0),
  carb_g numeric(6, 1) check (carb_g >= 0),
  fat_g numeric(6, 1) check (fat_g >= 0),
  estimated boolean not null default false,
  source text,
  barcode text,
  ingredients jsonb, -- recipes
  servings numeric(5, 2),
  swap jsonb,
  uses integer not null default 0,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index foods_user on public.foods (user_id);

-- ---------------------------------------------------------------------------
-- Written by the server only (read-only for users).
-- ---------------------------------------------------------------------------
create table public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stat text not null check (stat in ('STR', 'END', 'STA', 'NUT', 'REC', 'HLT')),
  amount integer not null,
  source text not null check (source in ('manual', 'synced', 'ai', 'start')),
  log_date date not null,
  entry_table text,
  entry_id uuid,
  created_at timestamptz not null default now()
);
create index xp_events_user_date on public.xp_events (user_id, log_date);
create index xp_events_entry on public.xp_events (entry_table, entry_id);

create table public.user_stats (
  id uuid primary key references auth.users (id) on delete cascade, -- = user id
  stat_xp jsonb not null default '{}', -- { "STR": 1234, ... }
  overall_xp integer not null default 0,
  level smallint not null default 1,
  rank text not null default 'rookie',
  week_gains jsonb not null default '{}',
  streak smallint not null default 0,
  best_streak smallint not null default 0,
  verified_share numeric(4, 3), -- share of data from synced sources
  updated_at timestamptz not null default now()
);

create table public.lift_bests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_key text not null,
  best_e1rm_kg numeric(6, 2) not null,
  weight_kg numeric(6, 2) not null,
  reps smallint not null,
  achieved_on date not null,
  set_entry_id uuid,
  updated_at timestamptz not null default now(),
  unique (user_id, exercise_key)
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  badge_key text not null,
  earned_on date not null,
  created_at timestamptz not null default now(),
  unique (user_id, badge_key)
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null, -- overview, check:today/morning, stat:STR, ...
  for_date date not null,
  content jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, for_date)
);

-- ---------------------------------------------------------------------------
-- Server-side switches, e.g. the hormone and peptide category level
-- (docs/07, decision 10). Readable by signed-in users, changed only by admins
-- in the Supabase dashboard.
-- ---------------------------------------------------------------------------
create table public.app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
insert into public.app_config (key, value) values
  ('hormone_category', '"prescription_only"'), -- full | prescription_only | hidden
  ('min_app_version', '"0.1.0"');

-- ---------------------------------------------------------------------------
-- Triggers: keep updated_at current and logged_at honest.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'days', 'food_entries', 'exercises', 'exercise_entries', 'set_entries',
    'protocol_items', 'protocol_logs', 'check_ins', 'measurements', 'lab_draws', 'foods',
    'user_stats', 'lift_bests', 'app_config'
  ] loop
    execute format(
      'create trigger touch_updated_at before update on public.%I for each row execute function private.touch()',
      t
    );
  end loop;

  foreach t in array array[
    'days', 'food_entries', 'exercise_entries', 'set_entries', 'protocol_logs',
    'check_ins', 'measurements', 'lab_draws'
  ] loop
    execute format(
      'create trigger clamp_logged_at before insert or update of logged_at on public.%I for each row execute function private.clamp_logged_at()',
      t
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row-level security.
-- ---------------------------------------------------------------------------

-- Nothing is readable without signing in.
revoke all on all tables in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;

do $$
declare
  t text;
begin
  -- Tables users fully own: read, add, change and delete their own rows only.
  foreach t in array array[
    'days', 'food_entries', 'exercise_entries', 'set_entries', 'protocol_items',
    'protocol_logs', 'check_ins', 'measurements', 'lab_draws', 'foods'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "read own" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "add own" on public.%I for insert to authenticated with check ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "change own" on public.%I for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', t);
    execute format(
      'create policy "delete own" on public.%I for delete to authenticated using ((select auth.uid()) = user_id)', t);
  end loop;

  -- Server-written tables: users can only read their own rows.
  foreach t in array array['xp_events', 'lift_bests', 'badges', 'insights'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "read own" on public.%I for select to authenticated using ((select auth.uid()) = user_id)', t);
    execute format('revoke insert, update, delete on public.%I from authenticated', t);
  end loop;
end;
$$;

-- Profile: keyed by the user's own id. Created by the signup trigger, never deleted
-- directly (deleting the account removes it).
alter table public.profiles enable row level security;
create policy "read own" on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "change own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
revoke insert, delete on public.profiles from authenticated;

-- Card totals: read-only, keyed by user id.
alter table public.user_stats enable row level security;
create policy "read own" on public.user_stats for select to authenticated
  using ((select auth.uid()) = id);
revoke insert, update, delete on public.user_stats from authenticated;

-- Consents: add and read your own; never change or delete (it is a legal record).
alter table public.consents enable row level security;
create policy "read own" on public.consents for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "add own" on public.consents for insert to authenticated
  with check ((select auth.uid()) = user_id);
revoke update, delete on public.consents from authenticated;

-- Exercise library: everyone signed in reads the built-in list plus their own custom
-- exercises, and can only add or change their own.
alter table public.exercises enable row level security;
create policy "read built-in and own" on public.exercises for select to authenticated
  using (user_id is null or (select auth.uid()) = user_id);
create policy "add own" on public.exercises for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "change own" on public.exercises for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "delete own" on public.exercises for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Switches: readable when signed in, never writable from the app.
alter table public.app_config enable row level security;
create policy "read" on public.app_config for select to authenticated using (true);
revoke insert, update, delete on public.app_config from authenticated;

-- ---------------------------------------------------------------------------
-- Private photo storage: avatars and progress photos. Each user can only touch
-- files inside their own folder: photos/<user id>/...
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', false, 10485760, array['image/jpeg', 'image/png', 'image/heic', 'image/webp'])
on conflict (id) do nothing;

create policy "photos: read own" on storage.objects for select to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: add own" on storage.objects for insert to authenticated
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: change own" on storage.objects for update to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "photos: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Helper functions are for triggers only; nobody calls them from the app.
revoke execute on all functions in schema private from public, anon, authenticated;
