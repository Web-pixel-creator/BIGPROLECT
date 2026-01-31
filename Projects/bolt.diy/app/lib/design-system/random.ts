/**
 * Seeded Random Number Generator
 * 
 * Provides deterministic random number generation for consistent
 * design generation based on seeds.
 */

export interface SeededRandom {
  random: () => number;
  choice: <T>(arr: T[]) => T;
  shuffle: <T>(arr: T[]) => T[];
  int: (min: number, max: number) => number;
  sample: <T>(arr: T[], count: number) => T[];
}

/**
 * Create a seeded random number generator
 * Uses a Linear Congruential Generator for consistent results
 */
export function seededRandom(seed: number): SeededRandom {
  let s = seed;
  
  function next(): number {
    // Linear Congruential Generator
    // Parameters from Numerical Recipes
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  }
  
  return {
    random: next,
    
    choice<T>(arr: T[]): T {
      if (arr.length === 0) {
        throw new Error('Cannot choose from empty array');
      }
      return arr[Math.floor(next() * arr.length)];
    },
    
    shuffle<T>(arr: T[]): T[] {
      const result = [...arr];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    },
    
    int(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    
    sample<T>(arr: T[], count: number): T[] {
      if (count >= arr.length) {
        return this.shuffle(arr);
      }
      const shuffled = this.shuffle(arr);
      return shuffled.slice(0, count);
    },
  };
}

/**
 * Generate a random seed
 */
export function generateSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * Create a hash from a string for consistent seeding
 */
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}
