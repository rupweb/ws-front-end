import { formatUtcTransactTime } from '../../src/utils/transactTime.js';

describe('formatUtcTransactTime', () => {
  it('formats UTC timestamps without applying the browser local timezone', () => {
    const date = new Date('2026-04-06T13:49:08.723Z');

    expect(formatUtcTransactTime(date)).toBe('20260406-13:49:08.723');
  });
});
