import { useLocalSearchParams } from 'expo-router';
import { type ReactNode, useEffect } from 'react';

import { HUBS, type HubKey, resolveSection } from '@/navigation/hubs';

import { Screen } from './Screen';

export type HubPageProps = {
  hub: HubKey;
  /** What to show for each section key. */
  sections: Record<string, ReactNode>;
};

/**
 * The last section shown in each hub, so a tab reopens where you left it
 * (like the iPhone's own apps) instead of jumping back to the first section.
 * Kept for the session only.
 */
const lastSection = new Map<HubKey, string>();

/**
 * A hub page (Today, Plan, Progress, Profile): title, sub-tabs, and the section.
 * A section in the URL (a deep link or a sub-tab tap) wins; otherwise the hub
 * reopens on the section you last had open.
 */
export function HubPage({ hub, sections }: HubPageProps) {
  const { section: requested } = useLocalSearchParams<{ section?: string }>();
  const section = resolveSection(hub, requested ?? lastSection.get(hub));

  useEffect(() => {
    lastSection.set(hub, section);
  }, [hub, section]);

  return (
    <Screen title={HUBS[hub].label} sections={HUBS[hub].sections} section={section}>
      {sections[section]}
    </Screen>
  );
}
