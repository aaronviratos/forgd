/** "Good morning/afternoon/evening" for the Home header (docs/03, B). */
export function greeting(date: Date): string {
  const h = date.getHours();
  if (h >= 4 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  return 'Good evening';
}

/** "Wednesday, Sep 30" in the phone's language. */
export function longDate(date: Date, locale?: string): string {
  return date.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' });
}
