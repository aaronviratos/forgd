-- Repair JSON values that were uploaded as quoted text (for example profiles.ui stored as
-- "{\"accent\":\"teal\"}" instead of {"accent":"teal"}), before the app sent JSON columns
-- as real JSON. Only touches values that are a string containing a JSON object or array.
do $$
declare
  c record;
begin
  for c in
    select table_name, column_name
    from information_schema.columns
    where table_schema = 'public' and data_type = 'jsonb'
  loop
    execute format(
      $sql$update public.%1$I set %2$I = (%2$I #>> '{}')::jsonb
           where jsonb_typeof(%2$I) = 'string' and (%2$I #>> '{}') ~ '^\s*[\{\[]'$sql$,
      c.table_name, c.column_name
    );
  end loop;
end;
$$;
