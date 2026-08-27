export type Route =
  | { kind: 'home' }
  | { kind: 'surahs' }
  | { kind: 'reader'; surahNumber: number };

export function parseRoute(hash: string): Route {
  if (hash === '#/sourates') return { kind: 'surahs' };
  const match = /^#\/sourate\/(\d+)$/.exec(hash);
  if (match) {
    const surahNumber = Number(match[1]);
    if (Number.isInteger(surahNumber) && surahNumber >= 1 && surahNumber <= 114) {
      return { kind: 'reader', surahNumber };
    }
  }
  return { kind: 'home' };
}

export function toSurahRoute(id: number): string {
  return `#/sourate/${id}`;
}
