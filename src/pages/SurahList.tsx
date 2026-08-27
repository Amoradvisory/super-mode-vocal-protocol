import { toSurahRoute } from '../app/routes';
import type { QuranCorpus } from '../corpus/types';

interface SurahListProps {
  corpus: QuranCorpus;
}

export function SurahList({ corpus }: SurahListProps) {
  return (
    <main className="surah-page">
      <header className="page-header">
        <a className="quiet-link" href="#/">‹ Accueil</a>
        <p className="eyebrow">114 chapitres</p>
        <h1>Les sourates</h1>
        <p>Choisissez simplement où commencer.</p>
      </header>
      <ol className="surah-list">
        {corpus.surahs.map((surah) => (
          <li key={surah.surahNumber}>
            <a href={toSurahRoute(surah.surahNumber)}>
              <span className="surah-index">{String(surah.surahNumber).padStart(3, '0')}</span>
              <span className="surah-main"><strong>{surah.surahNumber} · {surah.surahName}</strong><small>{surah.verses.length} versets</small></span>
              <span className="surah-arrow" aria-hidden="true">›</span>
            </a>
          </li>
        ))}
      </ol>
    </main>
  );
}
