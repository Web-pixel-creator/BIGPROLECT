/**
 * Seeded Random Number Generator
 * Provides deterministic random numbers for reproducible results
 * 
 * Usage:
 *   import { createSeededRandom, getGlobalRng, setGlobalSeed } from './prompt-data';
 *   
 *   // Option 1: Create isolated RNG
 *   const rng = createSeededRandom(12345);
 *   const value = rng(); // 0..1
 *   
 *   // Option 2: Use global RNG (for baseline testing)
 *   setGlobalSeed(12345);
 *   const value = getGlobalRng()();
 */

/**
 * Create a seeded pseudo-random number generator using LCG algorithm
 * Same implementation as baseline-utils.ts for consistency
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

// Global RNG state for deterministic testing
let globalRng: (() => number) | null = null;

/**
 * Set global seed for deterministic random generation
 * Call this before any random operations for reproducible results
 */
export function setGlobalSeed(seed: number): void {
  globalRng = createSeededRandom(seed);
}

/**
 * Reset global RNG to use Math.random (non-deterministic)
 */
export function resetGlobalRng(): void {
  globalRng = null;
}

/**
 * Get the current RNG function
 * Returns seeded RNG if set, otherwise Math.random
 */
export function getGlobalRng(): () => number {
  return globalRng ?? Math.random;
}

/**
 * Generate a random integer in range [0, max)
 */
export function randomInt(max: number, rng?: () => number): number {
  const fn = rng ?? getGlobalRng();
  return Math.floor(fn() * max);
}

/**
 * Pick a random element from array
 */
export function pickRandom<T>(arr: T[], rng?: () => number): T {
  const fn = rng ?? getGlobalRng();
  return arr[Math.floor(fn() * arr.length)];
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(arr: T[], rng?: () => number): T[] {
  const fn = rng ?? getGlobalRng();
  const result = [...arr];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(fn() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Generate a random seed string (for variation IDs)
 */
export function randomSeedString(length: number = 6, rng?: () => number): string {
  const fn = rng ?? getGlobalRng();
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';

  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(fn() * chars.length)];
  }

  return result;
}

/**
 * Generate a random number for image cache busting
 */
export function randomImageSeed(rng?: () => number): number {
  const fn = rng ?? getGlobalRng();
  return Math.floor(fn() * 1000000) + Date.now();
}
