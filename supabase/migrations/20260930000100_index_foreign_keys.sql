-- Indexes on foreign keys flagged by the Supabase advisor (faster deletes and joins).
create index exercise_entries_exercise on public.exercise_entries (exercise_id);
create index protocol_logs_item on public.protocol_logs (item_id);
