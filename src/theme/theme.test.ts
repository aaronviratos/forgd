import { DEFAULT_UI_PREFS, parseUiPrefs, resolveMode } from './theme';

describe('saved appearance settings', () => {
  it('keeps valid values', () => {
    expect(
      parseUiPrefs('{"theme":"dark","accent":"teal","surface":"paper","textSize":"large"}'),
    ).toEqual({ theme: 'dark', accent: 'teal', surface: 'paper', textSize: 'large' });
  });

  it('drops anything invalid instead of breaking', () => {
    expect(parseUiPrefs('{"theme":"neon","accent":"plaid","textSize":9}')).toEqual({});
    expect(parseUiPrefs('not json')).toEqual({});
    expect(parseUiPrefs(null)).toEqual({});
    expect(parseUiPrefs('[1,2]')).toEqual({});
  });

  it('defaults to Ember and follows the phone', () => {
    expect(DEFAULT_UI_PREFS.accent).toBe('ember');
    expect(resolveMode('system', 'dark')).toBe('dark');
    expect(resolveMode('light', 'dark')).toBe('light');
  });
});
