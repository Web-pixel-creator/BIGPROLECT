import { getGlobalRng } from './prompt-data';

function shuffleList<T>(list: T[], rng?: () => number): T[] {
  const next = [...list];
  const rand = rng ?? getGlobalRng();

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function pickRandomUnique<T>(list: T[], count: number, rng?: () => number): T[] {
  if (count <= 0) {
    return [];
  }

  const unique = Array.from(new Set(list));

  return shuffleList(unique, rng).slice(0, Math.min(count, unique.length));
}

export { shuffleList, pickRandomUnique };
