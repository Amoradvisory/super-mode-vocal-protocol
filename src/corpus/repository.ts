import type { QuranCorpus, Surah } from './types';

let corpusPromise: Promise<QuranCorpus> | null = null;

function isCorpus(value: unknown): value is QuranCorpus {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<QuranCorpus>;
  return (
    candidate.source === 'QuranEnc' &&
    candidate.translationKey === 'french_hameedullah' &&
    typeof candidate.version === 'string' &&
    Array.isArray(candidate.surahs)
  );
}

export function loadCorpus(): Promise<QuranCorpus> {
  corpusPromise ??= fetch(`${import.meta.env.BASE_URL}data/quran-fr.json`, {
    headers: { accept: 'application/json' },
  }).then(async (response) => {
    if (!response.ok) throw new Error(`Corpus indisponible (${response.status})`);
    const data: unknown = await response.json();
    if (!isCorpus(data)) throw new Error('Corpus invalide');
    return data;
  });
  return corpusPromise;
}

export function getSurah(corpus: QuranCorpus, surahNumber: number): Surah | null {
  return corpus.surahs.find((surah) => surah.surahNumber === surahNumber) ?? null;
}
