/**
 * Sign-in state and the on-phone database, for the whole app.
 * - Signed in: the on-phone database connects and syncs with Supabase through PowerSync.
 * - Signed out: it disconnects and wipes the local copy, so the next person to use the
 *   phone never sees the previous user's data.
 */
import { PowerSyncContext } from '@powersync/react';
import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { authConfigured, syncConfigured } from '@/config/backend';

import { SupabaseConnector } from './connector';
import { db } from './db';
import { supabase } from './supabase';

type DataState = {
  /** False until the saved session has been read from secure storage. */
  ready: boolean;
  session: Session | null;
  userId: string | null;
  signOut: () => Promise<void>;
};

const DataContext = createContext<DataState | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  // Without a configured backend there is no session to wait for.
  const [ready, setReady] = useState(() => !authConfigured());
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!authConfigured()) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  // Connect while signed in; disconnect and wipe local data when signed out.
  useEffect(() => {
    if (!db) return;
    if (userId) {
      // Without PowerSync connected yet, changes wait on the phone and upload later.
      if (syncConfigured()) db.connect(new SupabaseConnector());
    } else if (ready) {
      db.disconnectAndClear();
    }
  }, [userId, ready]);

  const value: DataState = {
    ready,
    session,
    userId,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return (
    <DataContext.Provider value={value}>
      {db ? <PowerSyncContext.Provider value={db}>{children}</PowerSyncContext.Provider> : children}
    </DataContext.Provider>
  );
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
