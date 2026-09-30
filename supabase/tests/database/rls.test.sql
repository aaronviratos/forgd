-- Privacy tests: prove each user can only ever reach their own data.
-- Run with: npm run db:test   (everything below is rolled back at the end)
begin;
create extension if not exists pgtap with schema extensions;
select plan(24);

-- Two test users. The signup trigger creates their profiles.
insert into auth.users (id, email, aud, role)
values
  ('00000000-0000-4000-a000-00000000000a', 'rls-a@test.local', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-a000-00000000000b', 'rls-b@test.local', 'authenticated', 'authenticated');

-- ---- Structure --------------------------------------------------------------
select is_empty(
  $$ select tablename from pg_tables where schemaname = 'public' and not rowsecurity $$,
  'every table in the public schema has row-level security on'
);
select is(
  (select count(*)::int from public.profiles where id in (
    '00000000-0000-4000-a000-00000000000a', '00000000-0000-4000-a000-00000000000b')),
  2,
  'signing up creates a profile'
);

-- ---- Signed out -------------------------------------------------------------
set local role anon;
select throws_ok($$ select * from public.days $$, '42501', null, 'signed out: cannot read days');
select throws_ok($$ select * from public.profiles $$, '42501', null, 'signed out: cannot read profiles');
select throws_ok($$ select * from public.app_config $$, '42501', null, 'signed out: cannot read switches');
reset role;

-- ---- User A logs a day, a food, a lab draw ----------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-a000-00000000000a","role":"authenticated"}', true);

select lives_ok(
  $$ insert into public.days (id, user_id, log_date, weight_kg, logged_at)
     values ('10000000-0000-4000-a000-000000000001', '00000000-0000-4000-a000-00000000000a', '2026-09-30', 96.2, now() + interval '2 days') $$,
  'A can log a day'
);
select ok(
  (select logged_at <= now() from public.days where id = '10000000-0000-4000-a000-000000000001'),
  'a logged time in the future is clamped to now'
);
select throws_ok(
  $$ insert into public.days (id, user_id, log_date) values
     ('10000000-0000-4000-a000-000000000002', '00000000-0000-4000-a000-00000000000a', '2026-09-30') $$,
  '23505', null, 'only one day row per date'
);
select lives_ok(
  $$ insert into public.food_entries (user_id, log_date, name, cal) values
     ('00000000-0000-4000-a000-00000000000a', '2026-09-30', 'Oats', 300) $$,
  'A can log food'
);
select lives_ok(
  $$ insert into public.lab_draws (user_id, drawn_on, markers) values
     ('00000000-0000-4000-a000-00000000000a', '2026-09-01', '{"ldl": 128}') $$,
  'A can add lab results'
);
select throws_ok(
  $$ insert into public.days (id, user_id, log_date) values
     ('10000000-0000-4000-a000-000000000003', '00000000-0000-4000-a000-00000000000b', '2026-09-30') $$,
  '42501', null, 'A cannot create a row as B'
);
select throws_ok(
  $$ insert into public.xp_events (user_id, stat, amount, source, log_date) values
     ('00000000-0000-4000-a000-00000000000a', 'STR', 9999, 'manual', '2026-09-30') $$,
  '42501', null, 'A cannot give themselves XP'
);
select throws_ok(
  $$ update public.app_config set value = '"full"' where key = 'hormone_category' $$,
  '42501', null, 'A cannot change server switches'
);
select is(
  (select count(*)::int from public.app_config), 2, 'A can read server switches'
);
select lives_ok(
  $$ insert into public.consents (user_id, kind, version, granted) values
     ('00000000-0000-4000-a000-00000000000a', 'terms', '2026-09-30', true) $$,
  'A can record a consent'
);
select throws_ok(
  $$ update public.consents set granted = false $$,
  '42501', null, 'consents cannot be edited afterwards'
);

-- ---- User B cannot reach any of it ------------------------------------------
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-a000-00000000000b","role":"authenticated"}', true);

select is((select count(*)::int from public.days), 0, 'B cannot see A''s days');
select is((select count(*)::int from public.food_entries), 0, 'B cannot see A''s food');
select is((select count(*)::int from public.lab_draws), 0, 'B cannot see A''s labs');
select is((select count(*)::int from public.profiles), 1, 'B sees only their own profile');

update public.days set weight_kg = 1 where id = '10000000-0000-4000-a000-000000000001';
delete from public.food_entries where user_id = '00000000-0000-4000-a000-00000000000a';
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-a000-00000000000a","role":"authenticated"}', true);
select is(
  (select weight_kg from public.days where id = '10000000-0000-4000-a000-000000000001'),
  96.2::numeric,
  'B''s update did not touch A''s day'
);
select is((select count(*)::int from public.food_entries), 1, 'B''s delete did not touch A''s food');

-- ---- Photos: only inside your own folder ------------------------------------
select throws_ok(
  $$ insert into storage.objects (bucket_id, name) values
     ('photos', '00000000-0000-4000-a000-00000000000b/front.jpg') $$,
  '42501', null, 'A cannot upload into B''s photo folder'
);

-- ---- Deleting an account removes everything ---------------------------------
reset role;
delete from auth.users where id = '00000000-0000-4000-a000-00000000000a';
select is(
  (select (select count(*) from public.days where user_id = '00000000-0000-4000-a000-00000000000a')
        + (select count(*) from public.food_entries where user_id = '00000000-0000-4000-a000-00000000000a')
        + (select count(*) from public.lab_draws where user_id = '00000000-0000-4000-a000-00000000000a')
        + (select count(*) from public.consents where user_id = '00000000-0000-4000-a000-00000000000a')
        + (select count(*) from public.profiles where id = '00000000-0000-4000-a000-00000000000a'))::int,
  0,
  'deleting the account deletes all of its rows'
);

select * from finish();
rollback;
