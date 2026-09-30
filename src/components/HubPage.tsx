import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';

import { HUBS, type HubKey, resolveSection } from '@/navigation/hubs';

import { Screen } from './Screen';

export type HubPageProps = {
  hub: HubKey;
  /** What to show for each section key. */
  sections: Record<string, ReactNode>;
};

/** A hub page (Today, Plan, Progress, Profile): title, sub-tabs, and the section from the URL. */
export function HubPage({ hub, sections }: HubPageProps) {
  const { section: requested } = useLocalSearchParams<{ section?: string }>();
  const section = resolveSection(hub, requested);
  return (
    <Screen title={HUBS[hub].label} sections={HUBS[hub].sections} section={section}>
      {sections[section]}
    </Screen>
  );
}
