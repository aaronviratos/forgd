import { BRAND, BUNDLE_ID } from './brand';

describe('brand', () => {
  it('keeps the store ID fixed (it can never change after the first release)', () => {
    expect(BUNDLE_ID).toBe('com.kefalos.app');
  });

  it('builds the wordmark from the name', () => {
    expect(BRAND.wordmark.main + BRAND.wordmark.accent).toBe(BRAND.name);
  });

  it('uses a valid deep link scheme', () => {
    expect(BRAND.scheme).toMatch(/^[a-z]+$/);
  });
});
