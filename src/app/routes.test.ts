import { describe, expect, it } from 'vitest';
import { parseRoute, toSurahRoute } from './routes';

describe('routes', () => {
  it('parse une sourate valide', () => {
    expect(parseRoute('#/sourate/18')).toEqual({ kind: 'reader', surahNumber: 18 });
  });

  it('retombe sur accueil pour une sourate invalide', () => {
    expect(parseRoute('#/sourate/999')).toEqual({ kind: 'home' });
  });

  it('formate une route de sourate', () => {
    expect(toSurahRoute(2)).toBe('#/sourate/2');
  });
});
