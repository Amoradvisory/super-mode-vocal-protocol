import { useEffect, useRef, type CSSProperties } from 'react';
import { toSurahRoute } from '../app/routes';
import { ReadingControls } from '../components/ReadingControls';
import { Verse } from '../components/Verse';
import type { Surah } from '../corpus/types';
import { getReadingProfile, type ReadingLevel } from '../reading/readingScale';
import { loadProgress, saveProgress } from '../reading/progressStore';
import { useVisibleVerse } from '../reading/useVisibleVerse';

interface ReaderProps {
  surah: Surah;
  level: ReadingLevel;
  onLevelChange: (level: ReadingLevel) => void;
}

export function Reader({ surah, level, onLevelChange }: ReaderProps) {
  const profile = getReadingProfile(level);
  const lastVisibleVerse = useRef(1);

  useVisibleVerse(surah.surahNumber, (verseNumber) => {
    lastVisibleVerse.current = verseNumber;
    saveProgress({ surahNumber: surah.surahNumber, verseNumber, level, updatedAt: new Date().toISOString() });
  });

  useEffect(() => {
    const progress = loadProgress();
    if (progress?.surahNumber !== surah.surahNumber) {
      saveProgress({ surahNumber: surah.surahNumber, verseNumber: 1, level, updatedAt: new Date().toISOString() });
      return;
    }
    lastVisibleVerse.current = progress.verseNumber;
    const frame = requestAnimationFrame(() => {
      document.querySelector(`[data-verse-number="${progress.verseNumber}"]`)?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [surah.surahNumber]);

  const changeLevel = (next: ReadingLevel) => {
    onLevelChange(next);
    saveProgress({
      surahNumber: surah.surahNumber,
      verseNumber: lastVisibleVerse.current,
      level: next,
      updatedAt: new Date().toISOString(),
    });
  };

  const style = {
    '--reader-font-size': `${profile.fontSizeRem}rem`,
    '--reader-line-height': String(profile.lineHeight),
    '--reader-side-padding': `${profile.sidePaddingRem}rem`,
    '--reader-verse-gap': `${profile.verseGapRem}rem`,
  } as CSSProperties;

  return (
    <main className="reader-page" style={style}>
      <ReadingControls surahName={surah.surahName} level={level} onLevelChange={changeLevel} />
      <div className="reader-column">
        <header className="surah-heading">
          <p className="eyebrow">Sourate {surah.surahNumber}</p>
          <h1>{surah.surahName}</h1>
          <p>{surah.verses.length} versets</p>
        </header>
        <section className="verses" aria-label={`Lecture de ${surah.surahName}`}>
          {surah.verses.map((verse) => (
            <Verse key={verse.verseNumber} verseNumber={verse.verseNumber} frenchText={verse.frenchText} />
          ))}
        </section>
        <nav className="reader-next" aria-label="Navigation entre sourates">
          {surah.surahNumber > 1 ? <a className="quiet-link" href={toSurahRoute(surah.surahNumber - 1)}>‹ Sourate précédente</a> : <span />}
          {surah.surahNumber < 114 ? <a className="primary-link" href={toSurahRoute(surah.surahNumber + 1)}>Sourate suivante ›</a> : <a className="primary-link" href="#/sourates">Toutes les sourates</a>}
        </nav>
      </div>
    </main>
  );
}
