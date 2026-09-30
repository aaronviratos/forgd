-- Tables PowerSync replicates to phones (Milestone 1, step 5). Listed explicitly rather
-- than "for all tables" so a new table is only synced once someone decides it should be.
-- The PowerSync login role is created by hand in the SQL editor (it has a password,
-- which must never be in git): see docs/plans/milestone-1-foundation.md, step 5.
create publication powersync for table
  public.profiles,
  public.consents,
  public.days,
  public.food_entries,
  public.exercises,
  public.exercise_entries,
  public.set_entries,
  public.protocol_items,
  public.protocol_logs,
  public.check_ins,
  public.measurements,
  public.lab_draws,
  public.foods,
  public.xp_events,
  public.user_stats,
  public.lift_bests,
  public.badges,
  public.insights,
  public.app_config;
