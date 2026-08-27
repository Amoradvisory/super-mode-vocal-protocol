export interface Verse {
  verseNumber: number;
  frenchText: string;
  footnotes: string;
}

export interface Surah {
  surahNumber: number;
  surahName: string;
  verses: Verse[];
}

export interface QuranCorpus {
  source: 'QuranEnc';
  translationKey: 'french_hameedullah';
  translationName: 'Muhammad Hamidullah';
  version: string;
  importedAt: string;
  surahs: Surah[];
}
