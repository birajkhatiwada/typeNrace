import { describe, it, expect } from 'vitest';
import { clamp, esc, fmtTime, ordinal, mulberry, pick } from '../src/utils/helpers';

describe('helpers', () => {
  it('clamp', () => { expect(clamp(5, 0, 3)).toBe(3); expect(clamp(-1, 0, 3)).toBe(0); expect(clamp(2, 0, 3)).toBe(2); });
  it('esc escapes html', () => { expect(esc('<a href="x">&</a>')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;'); });
  it('fmtTime', () => { expect(fmtTime(65.4)).toBe('01:05.4'); expect(fmtTime(3)).toBe('00:03.0'); });
  it('ordinal', () => { expect(ordinal(1)).toBe('1ST'); expect(ordinal(4)).toBe('4TH'); expect(ordinal(6)).toBe('6TH'); });
  it('mulberry is deterministic and in [0,1)', () => {
    const a = mulberry(42), b = mulberry(42);
    for (let i = 0; i < 20; i++) { const v = a(); expect(v).toBe(b()); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
  it('pick returns a member', () => { expect([1, 2, 3]).toContain(pick([1, 2, 3])); });
});
