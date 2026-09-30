import { greeting, longDate } from './greeting';

const at = (h: number) => new Date(2026, 8, 30, h, 15);

describe('greeting', () => {
  it('follows the time of day', () => {
    expect(greeting(at(4))).toBe('Good morning');
    expect(greeting(at(11))).toBe('Good morning');
    expect(greeting(at(12))).toBe('Good afternoon');
    expect(greeting(at(16))).toBe('Good afternoon');
    expect(greeting(at(17))).toBe('Good evening');
    expect(greeting(at(23))).toBe('Good evening');
    // After midnight counts as evening, not morning.
    expect(greeting(at(1))).toBe('Good evening');
  });

  it('formats the header date', () => {
    expect(longDate(at(9), 'en-US')).toBe('Wednesday, Sep 30');
  });
});
