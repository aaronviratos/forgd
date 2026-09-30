import { checkInId, dayId, protocolLogId } from './ids';

const A = '00000000-0000-4000-a000-00000000000a';
const B = '00000000-0000-4000-a000-00000000000b';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('deterministic ids', () => {
  it('gives every device the same id for the same day', () => {
    expect(dayId(A, '2026-09-30')).toBe(dayId(A, '2026-09-30'));
    expect(dayId(A, '2026-09-30')).toMatch(UUID);
  });

  it('never collides across users, dates or kinds', () => {
    const ids = [
      dayId(A, '2026-09-30'),
      dayId(B, '2026-09-30'),
      dayId(A, '2026-10-01'),
      checkInId(A, '2026-09-28'),
      protocolLogId(A, 'group:Bedtime', '2026-09-30'),
      protocolLogId(A, 'group:Morning', '2026-09-30'),
    ];
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('is stable forever (changing it would orphan saved rows)', () => {
    expect(dayId(A, '2026-09-30')).toBe('36f95dbb-58d8-507d-a53f-1bb07e118f4f');
  });

  it('rejects dates that are not YYYY-MM-DD', () => {
    expect(() => dayId(A, '9/30/2026')).toThrow();
  });
});
