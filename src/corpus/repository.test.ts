import { describe, expect, it } from 'vitest';
import { getSurah } from './repository';
import type { QuranCorpus } from './types';

const corpus: QuranCorpus = {
  source: 'QuranEnc',
  translationKey: 'french_hameedullah',
  translationName: 'Muhammad Hamidullah',
  version: '1.0.2',
  importedAt: '2026-08-27T00:00:00.000Z',
  surahs: [
    {
      surahNumber: 1,
      surahName: 'Le Prologue',
      verses: [{ verseNumber: 1, frenchText: 'Texte de test', footnotes: '' }],
    },
  ],
};

describe('getSurah', () => {
  it('retourne une sourate existante', () => {
    expect(getSurah(corpus, 1)?.surahName).toBe('Le Prologue');
  });

  it('retourne null pour une sourate absente', () => {
    expect(getSurah(corpus, 115)).toBeNull();
  });
});
