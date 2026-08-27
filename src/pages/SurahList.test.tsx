import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { QuranCorpus } from '../corpus/types';
import { SurahList } from './SurahList';

const corpus: QuranCorpus = {
  source: 'QuranEnc', translationKey: 'french_hameedullah', translationName: 'Muhammad Hamidullah', version: '1', importedAt: '',
  surahs: [
    { surahNumber: 1, surahName: 'Le Prologue', verses: [{ verseNumber: 1, frenchText: 'A', footnotes: '' }] },
    { surahNumber: 2, surahName: 'La Vache', verses: [{ verseNumber: 1, frenchText: 'B', footnotes: '' }] },
  ],
};

describe('SurahList', () => {
  it('affiche les sourates comme liens', () => {
    render(<SurahList corpus={corpus} />);
    expect(screen.getByRole('link', { name: /1 · Le Prologue/ })).toHaveAttribute('href', '#/sourate/1');
    expect(screen.getByRole('link', { name: /2 · La Vache/ })).toHaveAttribute('href', '#/sourate/2');
  });
});
