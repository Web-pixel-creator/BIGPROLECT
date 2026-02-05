import { describe, expect, it } from 'vitest';

import { resolveBriefSeed } from '../brief-utils';

describe('resolveBriefSeed', () => {
  it('returns no seed when design is unlocked', () => {
    const result = resolveBriefSeed({ lockDesign: false, lockedSeed: 123, now: 1000 });

    expect(result.seed).toBeUndefined();
    expect(result.nextLockedSeed).toBeNull();
  });

  it('uses the current time when locked with no existing seed', () => {
    const result = resolveBriefSeed({ lockDesign: true, lockedSeed: null, now: 4242 });

    expect(result.seed).toBe(4242);
    expect(result.nextLockedSeed).toBe(4242);
  });

  it('reuses the existing seed when locked', () => {
    const result = resolveBriefSeed({ lockDesign: true, lockedSeed: 777, now: 4242 });

    expect(result.seed).toBe(777);
    expect(result.nextLockedSeed).toBe(777);
  });
});
