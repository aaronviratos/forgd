import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '@/config/backend';

import { secureStorage } from './secureStorage';

/** The Supabase client: sign-in, and the path PowerSync uses to upload changes. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY || 'not-configured', {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Sign-in links only work on the phone that asked for them (PKCE).
    flowType: 'pkce',
  },
});

// Refresh the session only while the app is open (Supabase's recommendation for mobile).
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
