/**
 * Where the app's backend lives. These values are public by design: anyone with the app
 * could read them. What protects data is row-level security in the database and the
 * signed-in user's session, not these values.
 *
 * Never put a secret here (the Supabase service_role key, database passwords, the Claude
 * API key). Secrets live only on the server.
 */
export const SUPABASE_URL = 'https://fsfvhrvhwhgtujbrnunf.supabase.co';

/** Supabase > Project Settings > API Keys > Publishable key (starts with sb_publishable_). */
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_dmdSPcuzVfDF4p0oFgO1og_HNkxgYFv';

/** PowerSync dashboard > your instance > Connect (instance URL). */
export const POWERSYNC_URL = '';

/** Sign-in works once the Supabase key is set. */
export const authConfigured = () => !!SUPABASE_PUBLISHABLE_KEY;

/** Syncing to Supabase works once PowerSync is connected too; until then data stays on the phone. */
export const syncConfigured = () => !!POWERSYNC_URL;
