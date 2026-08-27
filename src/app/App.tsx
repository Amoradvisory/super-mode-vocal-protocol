import { useEffect, useState } from 'react';
import { ErrorState } from '../components/ErrorState';
import { getSurah, loadCorpus } from '../corpus/repository';
import type { QuranCorpus } from '../corpus/types';
import { Home } from '../pages/Home';
import { Reader } from '../pages/Reader';
import { SurahList } from '../pages/SurahList';
import { loadProgress } from '../reading/progressStore';
import type { ReadingLevel } from '../reading/readingScale';
import { parseRoute, type Route } from './routes';

function currentRoute(): Route {
  return parseRoute(window.location.hash);
}

export function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [corpus, setCorpus] = useState<QuranCorpus | null>(null);
  const [corpusError, setCorpusError] = useState(false);
  const [level, setLevel] = useState<ReadingLevel>(() => loadProgress()?.level ?? 'normal');

  useEffect(() => {
    const onHashChange = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route.kind === 'home' || corpus || corpusError) return;
    loadCorpus().then(setCorpus).catch(() => setCorpusError(true));
  }, [route.kind, corpus, corpusError]);

  if (route.kind === 'home') return <Home />;
  if (corpusError) return <ErrorState />;
  if (!corpus) return <main className="state-page"><p className="eyebrow">Ma Lecture</p><h1>Ouverture du texte…</h1></main>;
  if (route.kind === 'surahs') return <SurahList corpus={corpus} />;

  const surah = getSurah(corpus, route.surahNumber);
  if (!surah) return <ErrorState />;
  return <Reader surah={surah} level={level} onLevelChange={setLevel} />;
}
