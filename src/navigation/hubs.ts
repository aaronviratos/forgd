/**
 * The app's five hubs plus Coach, and their sections (docs/01-product.md, Information architecture).
 * The tab bar, the menu and each page's sub-tabs all read from here, so they never drift apart.
 * A section is part of the URL (/today?section=morning), so stats, badges and alerts can
 * deep-link straight to where something is logged.
 */

export type HubKey = 'home' | 'today' | 'plan' | 'progress' | 'profile' | 'coach';

export type Section = { key: string; label: string };

export type Hub = {
  key: HubKey;
  label: string;
  pathname: '/' | '/today' | '/plan' | '/progress' | '/profile' | '/coach';
  sections: Section[];
};

export const HUBS: Record<HubKey, Hub> = {
  home: { key: 'home', label: 'Home', pathname: '/', sections: [] },
  coach: { key: 'coach', label: 'Coach', pathname: '/coach', sections: [] },
  today: {
    key: 'today',
    label: 'Today',
    pathname: '/today',
    sections: [
      { key: 'checklist', label: 'Checklist' },
      { key: 'morning', label: 'Morning' },
      { key: 'nutrition', label: 'Nutrition' },
      { key: 'training', label: 'Training' },
      { key: 'cardio', label: 'Cardio' },
      { key: 'supplements', label: 'Supplements' },
      { key: 'flags', label: 'Red flags' },
    ],
  },
  plan: {
    key: 'plan',
    label: 'Plan',
    pathname: '/plan',
    sections: [
      { key: 'program', label: 'My program' },
      { key: 'nutrition', label: 'Nutrition' },
      { key: 'supplements', label: 'Supplements' },
      { key: 'thisweek', label: 'This week' },
      { key: 'nextweek', label: 'Next week' },
    ],
  },
  progress: {
    key: 'progress',
    label: 'Progress',
    pathname: '/progress',
    sections: [
      { key: 'overview', label: 'Overview' },
      { key: 'measurements', label: 'Measurements' },
      { key: 'charts', label: 'Charts' },
      { key: 'checkin', label: 'Check-in' },
      { key: 'labs', label: 'Labs' },
    ],
  },
  profile: {
    key: 'profile',
    label: 'Profile',
    pathname: '/profile',
    sections: [
      { key: 'profile', label: 'Profile' },
      { key: 'goals', label: 'Goals and targets' },
      { key: 'settings', label: 'Settings' },
    ],
  },
};

/** Order in the menu. */
export const MENU_ORDER: HubKey[] = ['home', 'coach', 'today', 'plan', 'progress', 'profile'];

/** Which hub a URL path belongs to. */
export function hubForPath(path: string): HubKey {
  const first = path.split('?')[0].split('/').filter(Boolean)[0] ?? '';
  return (Object.values(HUBS).find((h) => h.pathname === `/${first}`)?.key ?? 'home') as HubKey;
}

/** The section to show: the one in the URL if valid, otherwise the hub's first section. */
export function resolveSection(hub: HubKey, requested: string | string[] | undefined): string {
  const sections = HUBS[hub].sections;
  const key = Array.isArray(requested) ? requested[0] : requested;
  return sections.find((s) => s.key === key)?.key ?? sections[0]?.key ?? '';
}
