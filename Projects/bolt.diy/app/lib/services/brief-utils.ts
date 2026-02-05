export type ResolveBriefSeedInput = {
  lockDesign: boolean;
  lockedSeed: number | null;
  now?: number;
};

export type ResolveBriefSeedResult = {
  seed?: number;
  nextLockedSeed: number | null;
};

export function resolveBriefSeed({
  lockDesign,
  lockedSeed,
  now = Date.now(),
}: ResolveBriefSeedInput): ResolveBriefSeedResult {
  if (!lockDesign) {
    return {
      seed: undefined,
      nextLockedSeed: null,
    };
  }

  const seed = lockedSeed ?? now;

  return {
    seed,
    nextLockedSeed: seed,
  };
}
