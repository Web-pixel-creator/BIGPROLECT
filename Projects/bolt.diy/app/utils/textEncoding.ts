const CYRILLIC_RE = /[\u0400-\u04FF]/g;
const LATIN_RE = /[A-Za-z]/g;
const LATIN_MOJIBAKE_RE = /[ÐÑÃÂ]/g;
const REPLACEMENT_CHAR_RE = /�/g;

const countMatches = (value: string, regex: RegExp) => {
  const matches = value.match(regex);
  return matches ? matches.length : 0;
};

const scoreText = (value: string) => {
  const cyrillic = countMatches(value, CYRILLIC_RE);
  const latin = countMatches(value, LATIN_RE);
  const mojibake = countMatches(value, LATIN_MOJIBAKE_RE);
  const replacements = countMatches(value, REPLACEMENT_CHAR_RE);

  return cyrillic * 2 + latin - mojibake * 4 - replacements * 6;
};

const decodeLatin1Mojibake = (value: string) => {
  const bytes = new Uint8Array(value.length);

  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);

    if (code > 0xff) {
      return null;
    }

    bytes[i] = code;
  }

  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
};

const cp1251CharToByte = (codePoint: number) => {
  if (codePoint >= 0x0410 && codePoint <= 0x044f) {
    return codePoint - 0x0410 + 0xc0;
  }

  if (codePoint === 0x0401) {
    return 0xa8;
  }

  if (codePoint === 0x0451) {
    return 0xb8;
  }

  return null;
};

const decodeCp1251Mojibake = (value: string) => {
  const bytes: number[] = [];

  for (const char of value) {
    const codePoint = char.codePointAt(0);

    if (codePoint === undefined) {
      return null;
    }

    if (codePoint <= 0x7f) {
      bytes.push(codePoint);
      continue;
    }

    const mapped = cp1251CharToByte(codePoint);

    if (mapped === null) {
      return null;
    }

    bytes.push(mapped);
  }

  return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(bytes));
};

export function fixMojibake(value: string): string {
  if (!value) {
    return value;
  }

  let best = value;
  let bestScore = scoreText(value);

  if (LATIN_MOJIBAKE_RE.test(value)) {
    const decodedLatin1 = decodeLatin1Mojibake(value);

    if (decodedLatin1) {
      const score = scoreText(decodedLatin1);

      if (score > bestScore) {
        best = decodedLatin1;
        bestScore = score;
      }
    }
  }

  const cyrillicCount = countMatches(value, CYRILLIC_RE);
  const rsCount = countMatches(value, /[РС]/g);
  const rsRatio = cyrillicCount > 0 ? rsCount / cyrillicCount : 0;

  if (rsRatio >= 0.35) {
    const decodedCp1251 = decodeCp1251Mojibake(value);

    if (decodedCp1251) {
      const score = scoreText(decodedCp1251);

      if (score > bestScore) {
        best = decodedCp1251;
      }
    }
  }

  return best;
}
