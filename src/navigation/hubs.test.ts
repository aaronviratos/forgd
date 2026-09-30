import { HUBS, hubForPath, MENU_ORDER, resolveSection } from './hubs';

describe('hubs', () => {
  it('maps paths to hubs', () => {
    expect(hubForPath('/')).toBe('home');
    expect(hubForPath('/today')).toBe('today');
    expect(hubForPath('/today?section=morning')).toBe('today');
    expect(hubForPath('/progress/labs')).toBe('progress');
    expect(hubForPath('/unknown')).toBe('home');
  });

  it('falls back to the first section when the URL has none or a bad one', () => {
    expect(resolveSection('today', undefined)).toBe('checklist');
    expect(resolveSection('today', 'nope')).toBe('checklist');
    expect(resolveSection('today', 'morning')).toBe('morning');
    expect(resolveSection('today', ['training'])).toBe('training');
    expect(resolveSection('home', 'x')).toBe('');
  });

  it('lists every hub in the menu exactly once', () => {
    expect([...MENU_ORDER].sort()).toEqual(Object.keys(HUBS).sort());
  });

  it('has unique section keys within each hub', () => {
    for (const hub of Object.values(HUBS)) {
      const keys = hub.sections.map((s) => s.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});
