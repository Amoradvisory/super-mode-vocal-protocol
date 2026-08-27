import { toSurahRoute } from '../app/routes';
import { InstallAppButton } from '../components/InstallAppButton';
import { loadProgress } from '../reading/progressStore';

export function Home() {
  const progress = loadProgress();
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="eyebrow">Une liseuse, rien de plus</p>
        <h1>Ma Lecture</h1>
        <p className="home-subtitle">Lire simplement, sourate après sourate.</p>
        <div className="home-actions">
          {progress ? (
            <a className="continue-card" href={toSurahRoute(progress.surahNumber)}>
              <span>Continuer ma lecture</span>
              <strong>Sourate {progress.surahNumber} · verset {progress.verseNumber}</strong>
            </a>
          ) : null}
          <a className="primary-link" href="#/sourates">Choisir une sourate</a>
          <InstallAppButton />
        </div>
      </section>
      <footer className="home-footer">
        <span>Traduction française de Muhammad Hamidullah</span>
        <a href="https://quranenc.com/fr/browse/french_hameedullah" target="_blank" rel="noreferrer">Source de la traduction</a>
      </footer>
    </main>
  );
}
