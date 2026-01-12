import { getGlobalRng } from './prompt-data';

function shuffleList<T>(list: T[]): T[] {
  const next = [...list];

  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(getGlobalRng()() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

function pickRandomUnique<T>(list: T[], count: number): T[] {
  if (count <= 0) {
    return [];
  }

  const unique = Array.from(new Set(list));

  return shuffleList(unique).slice(0, Math.min(count, unique.length));
}

export { shuffleList, pickRandomUnique };
