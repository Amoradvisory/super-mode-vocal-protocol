# Ma Lecture V0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une PWA Android-first appelée **Ma Lecture**, dédiée à la lecture confortable en français du sens des versets du Coran, sourate par sourate, avec fonctionnement hors ligne et reprise locale de lecture.

**Architecture:** Application React + TypeScript + Vite entièrement statique. Le corpus français est importé à l’avance depuis QuranEnc, validé puis servi localement ; aucune requête réseau n’est nécessaire pendant la lecture. Les préférences et la dernière position sont conservées dans `localStorage`, tandis que le service worker précache l’application et le corpus pour un usage hors ligne sur Android.

**Tech Stack:** React 19, TypeScript strict, Vite 7, CSS natif, Vitest + Testing Library, Playwright, vite-plugin-pwa/Workbox, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-27-ma-lecture-v0-design.md`

## Global Constraints

- Nom visible de l’application : **Ma Lecture**.
- Plateforme prioritaire : Android, largeur de référence 360–430 px.
- Aucun compte, backend, synchronisation, note, favori, audio, IA ou défilement automatique.
- Lecture : une sourate à la fois, verticalement, au doigt.
- Fond principal : bleu-noir profond autour de `#05080D`.
- Texte français principal : blanc `#FFFFFF`.
- Taille normale de départ : 20 px ; hauteur de ligne de départ : 1.72.
- Cinq niveaux de lecture : petit, normal, grand, très grand, maximum ; chaque niveau ajuste taille, interligne, marges et espacement entre versets.
- Aucun CDN de police, de script ou de style : l’expérience hors ligne doit être complète.
- Corpus : traduction française Muhammad Hamidullah publiée par QuranEnc, clé `french_hameedullah`, actuellement affichée V1.0.2 datée du 02/07/2025 ; ne jamais modifier, ajouter ou supprimer le contenu de la traduction.
- Attribution obligatoire : mention de Muhammad Hamidullah, de l’éditeur/supervision indiqués par QuranEnc, de QuranEnc.com comme source et de la version du corpus intégrée.
- Le dépôt privé `nur-quran-journey` reste strictement en lecture seule.
- L’ancien dossier `projet-01-fenetres/` peut être supprimé intégralement.
- Aucun scroll horizontal à 320, 360, 390, 430, 768 et 1024 px.
- La lecture doit continuer même si la sauvegarde locale de progression échoue.

---

## File Map

### Racine
- `package.json` — dépendances et scripts.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — TypeScript strict.
- `vite.config.ts` — React, PWA, base GitHub Pages et build.
- `index.html` — shell sombre immédiat, métadonnées PWA.
- `.gitignore` — dépendances, build et rapports.
- `README.md` — installation, développement, source du corpus et crédits.

### Application
- `src/main.tsx` — montage React.
- `src/app/App.tsx` — routage minimal par hash (`#/`, `#/sourates`, `#/sourate/:id`).
- `src/app/routes.ts` — parse/format des routes.
- `src/pages/Home.tsx` — accueil et reprise.
- `src/pages/SurahList.tsx` — liste des 114 sourates.
- `src/pages/Reader.tsx` — lecture d’une sourate.
- `src/components/Verse.tsx` — rendu d’un verset.
- `src/components/ReadingControls.tsx` — retour, titre, A− et A+.
- `src/components/ErrorState.tsx` — erreur de corpus discrète.
- `src/corpus/types.ts` — types du corpus.
- `src/corpus/repository.ts` — accès en lecture seule à `public/data/quran-fr.json`.
- `src/reading/readingScale.ts` — cinq profils visuels.
- `src/reading/progressStore.ts` — lecture/écriture locale de progression.
- `src/reading/useVisibleVerse.ts` — suivi du verset visible via IntersectionObserver.
- `src/styles/index.css` — direction artistique et responsive.
- `src/sw.ts` — service worker injectManifest.

### Données et scripts
- `scripts/import-quranenc.mjs` — télécharge les 114 sourates depuis l’API QuranEnc et produit un corpus figé.
- `scripts/validate-corpus.mjs` — vérifie 114 sourates, 6236 versets, continuité des numéros et métadonnées.
- `public/data/quran-fr.json` — corpus local généré.
- `public/data/SOURCE.md` — attribution, version et conditions de republication.
- `public/icons/icon.svg` — source vectorielle de l’icône.
- `scripts/generate-icons.mjs` — produit les PNG 192/512 avec `sharp`.
- `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable-512.png` — PWA.

### Tests et livraison
- `src/**/*.test.ts(x)` — tests unitaires/composants.
- `tests/e2e/reader.spec.ts` — lecture, tailles, reprise, responsive.
- `tests/e2e/pwa.spec.ts` — manifeste et offline.
- `playwright.config.ts` — appareils Android simulés + desktop de contrôle.
- `.github/workflows/pages.yml` — build et déploiement GitHub Pages.

---

### Task 1: Nettoyer le dépôt et créer le socle React/TypeScript

**Files:**
- Delete: `projet-01-fenetres/docs/superpowers/plans/2026-08-27-projet-01-fenetres.md`
- Delete: `projet-01-fenetres/docs/superpowers/specs/2026-08-27-projet-01-fenetres-design.md`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/styles/index.css`

**Interfaces:**
- Produces: une application React démarrant sur `#/` et affichant `Ma Lecture`.

- [ ] **Step 1: Write the failing smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('affiche le nom de la liseuse', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Ma Lecture' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Create package scripts and test setup**

`package.json` doit exposer exactement :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "npm run validate:corpus && tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "import:corpus": "node scripts/import-quranenc.mjs",
    "validate:corpus": "node scripts/validate-corpus.mjs",
    "generate:icons": "node scripts/generate-icons.mjs"
  }
}
```

Dependencies: `react`, `react-dom`. Dev dependencies: `typescript`, `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/react`, `@types/react-dom`, `vite-plugin-pwa`, `workbox-core`, `workbox-precaching`, `workbox-routing`, `@playwright/test`, `sharp`.

- [ ] **Step 3: Run the smoke test and verify failure**

Run: `npm test`
Expected: FAIL because `App` has not yet been implemented.

- [ ] **Step 4: Implement the minimal shell**

```tsx
export function App() {
  return (
    <main className="app-shell">
      <h1>Ma Lecture</h1>
    </main>
  );
}
```

`index.html` doit inclure `meta name="theme-color" content="#05080D"` et un style inline minimal sur `html,body,#root` avec fond `#05080D` pour empêcher tout flash clair avant le chargement CSS.

- [ ] **Step 5: Run unit tests and build**

Run: `npm test && npm run build`
Expected: tests PASS ; le build peut échouer uniquement si le validateur de corpus n’existe pas encore. Pour cette tâche, exécuter aussi `npx tsc -b && npx vite build` et exiger un exit code 0.

- [ ] **Step 6: Commit**

Commit: `chore: reset repository for Ma Lecture`

---

### Task 2: Importer et valider le corpus français QuranEnc

**Files:**
- Create: `scripts/import-quranenc.mjs`
- Create: `scripts/validate-corpus.mjs`
- Create: `public/data/quran-fr.json`
- Create: `public/data/SOURCE.md`
- Create: `src/corpus/types.ts`
- Create: `src/corpus/repository.ts`
- Create: `src/corpus/repository.test.ts`

**Interfaces:**
- Produces: `loadCorpus(): Promise<QuranCorpus>` et `getSurah(corpus, surahNumber): Surah | null`.

Types exacts :

```ts
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
```

- [ ] **Step 1: Write corpus repository tests**

```ts
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
      surahName: 'Al Fâtiha',
      verses: [{ verseNumber: 1, frenchText: 'Texte de test', footnotes: '' }],
    },
  ],
};

describe('getSurah', () => {
  it('retourne une sourate existante', () => {
    expect(getSurah(corpus, 1)?.surahName).toBe('Al Fâtiha');
  });

  it('retourne null pour une sourate absente', () => {
    expect(getSurah(corpus, 115)).toBeNull();
  });
});
```

- [ ] **Step 2: Implement importer with the official sura endpoint**

`import-quranenc.mjs` doit appeler pour `suraNumber` de 1 à 114 :

```js
const url = `https://quranenc.com/api/v1/translation/sura/french_hameedullah/${suraNumber}`;
const response = await fetch(url, { headers: { accept: 'application/json' } });
if (!response.ok) throw new Error(`QuranEnc ${response.status} sur sourate ${suraNumber}`);
const payload = await response.json();
```

Mapper sans reformuler `translation` ni `footnotes`. Le script doit récupérer la version de `french_hameedullah` via `/api/v1/translations/list/fr?localization=fr`, écrire un JSON UTF-8 formaté et échouer si la clé ou la version est absente.

- [ ] **Step 3: Implement validator**

Le validateur doit échouer si :
- `surahs.length !== 114` ;
- somme des versets `!== 6236` ;
- les sourates ne sont pas numérotées 1 à 114 ;
- les versets d’une sourate ne commencent pas à 1 ou ont un trou ;
- un `frenchText` est vide ;
- `translationKey !== 'french_hameedullah'`.

Sortie succès exacte : `Corpus valide: 114 sourates, 6236 versets.`

- [ ] **Step 4: Create SOURCE.md**

Le fichier doit mentionner : traduction Muhammad Hamidullah, source QuranEnc.com, clé `french_hameedullah`, version réellement importée, date d’import, interdiction de modifier le contenu, obligation de citer source/éditeur/version et nécessité de suivre les mises à jour QuranEnc.

- [ ] **Step 5: Generate and validate corpus**

Run: `npm run import:corpus && npm run validate:corpus && npm test`
Expected: importer exits 0 ; validator prints exactly `Corpus valide: 114 sourates, 6236 versets.` ; tests PASS.

- [ ] **Step 6: Commit**

Commit: `data: add validated French Quran corpus`

---

### Task 3: Créer le routage minimal et la liste des sourates

**Files:**
- Create: `src/app/routes.ts`
- Create: `src/app/routes.test.ts`
- Modify: `src/app/App.tsx`
- Create: `src/pages/Home.tsx`
- Create: `src/pages/SurahList.tsx`
- Create: `src/pages/SurahList.test.tsx`

**Interfaces:**
- Produces: `parseRoute(hash: string): Route` et `toSurahRoute(id: number): string`.
- `Route` vaut `{ kind: 'home' } | { kind: 'surahs' } | { kind: 'reader'; surahNumber: number }`.

- [ ] **Step 1: Write route tests**

```ts
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
```

- [ ] **Step 2: Implement route parser**

Aucun routeur externe. Écouter `hashchange` dans `App` et afficher Home, SurahList ou Reader selon `parseRoute(window.location.hash)`.

- [ ] **Step 3: Write SurahList component test**

Avec un corpus de deux sourates, vérifier deux liens et les libellés `1 · Al Fâtiha` et `2 · Al Baqarah`.

- [ ] **Step 4: Implement Home and SurahList**

Home : grand titre `Ma Lecture`, sous-titre `Lire simplement, sourate après sourate`, bouton `Choisir une sourate` vers `#/sourates`.

SurahList : titre `Les sourates`, retour accueil, liste ordonnée tactile ; chaque ligne affiche numéro, nom et `{verses.length} versets`.

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

Commit: `feat: add surah navigation`

---

### Task 4: Construire les cinq profils de confort de lecture

**Files:**
- Create: `src/reading/readingScale.ts`
- Create: `src/reading/readingScale.test.ts`
- Create: `src/components/ReadingControls.tsx`
- Create: `src/components/ReadingControls.test.tsx`

**Interfaces:**
- Produces: `READING_LEVELS`, `getReadingProfile(level)`, `decreaseLevel(level)`, `increaseLevel(level)`.

```ts
export type ReadingLevel = 'small' | 'normal' | 'large' | 'xlarge' | 'maximum';

export interface ReadingProfile {
  fontSizeRem: number;
  lineHeight: number;
  sidePaddingRem: number;
  verseGapRem: number;
}
```

Profils exacts :

```ts
export const READING_LEVELS = {
  small:   { fontSizeRem: 1.08, lineHeight: 1.68, sidePaddingRem: 1.35, verseGapRem: 1.55 },
  normal:  { fontSizeRem: 1.25, lineHeight: 1.72, sidePaddingRem: 1.25, verseGapRem: 1.8 },
  large:   { fontSizeRem: 1.42, lineHeight: 1.76, sidePaddingRem: 1.15, verseGapRem: 2.0 },
  xlarge:  { fontSizeRem: 1.62, lineHeight: 1.8,  sidePaddingRem: 1.0,  verseGapRem: 2.2 },
  maximum: { fontSizeRem: 1.9,  lineHeight: 1.84, sidePaddingRem: 0.85, verseGapRem: 2.4 }
} as const;
```

- [ ] **Step 1: Write boundary tests**

Vérifier que `decreaseLevel('small') === 'small'`, `increaseLevel('maximum') === 'maximum'`, `increaseLevel('normal') === 'large'`.

- [ ] **Step 2: Implement reading scale**

L’ordre est `small -> normal -> large -> xlarge -> maximum` ; aucune valeur numérique arbitraire n’est stockée.

- [ ] **Step 3: Implement ReadingControls**

Barre sticky discrète : bouton retour `Sourates`, nom courant, boutons accessibles `Réduire le texte` (`A−`) et `Agrandir le texte` (`A+`). Désactiver A− au minimum et A+ au maximum.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit: `feat: add reading comfort controls`

---

### Task 5: Construire l’écran de lecture et la direction artistique

**Files:**
- Create: `src/components/Verse.tsx`
- Create: `src/components/Verse.test.tsx`
- Create: `src/pages/Reader.tsx`
- Create: `src/pages/Reader.test.tsx`
- Modify: `src/styles/index.css`

**Interfaces:**
- Reader consumes `Surah`, `ReadingLevel`, `onLevelChange`.
- Verse reçoit `{ verseNumber: number; frenchText: string }` et rend `data-verse-number`.

- [ ] **Step 1: Write Verse test**

```tsx
render(<Verse verseNumber={255} frenchText="Texte français" />);
expect(screen.getByText('255')).toBeInTheDocument();
expect(screen.getByText('Texte français')).toBeInTheDocument();
```

- [ ] **Step 2: Write Reader test**

Avec une sourate de trois versets, vérifier l’ordre des `data-verse-number` `[1,2,3]`, le titre de sourate et le lien `Sourate suivante` quand `surahNumber < 114`.

- [ ] **Step 3: Implement Reader and Verse**

Aucun encadrement autour de chaque verset. Structure recommandée :

```tsx
<article className="verse" data-verse-number={verseNumber}>
  <span className="verse-number" aria-label={`Verset ${verseNumber}`}>{verseNumber}</span>
  <p className="verse-text">{frenchText}</p>
</article>
```

- [ ] **Step 4: Implement the reading CSS**

Valeurs de base :

```css
:root {
  color-scheme: dark;
  --bg: #05080d;
  --surface: #0a111b;
  --surface-soft: #0d1723;
  --text: #ffffff;
  --muted: #93a4b7;
  --accent: #79d8f2;
  --edge: rgba(121, 216, 242, 0.14);
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
  font-family: Georgia, 'Noto Serif', 'Times New Roman', serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

.reader-column {
  width: min(100%, 46rem);
  margin: 0 auto;
}

.verse-text {
  margin: 0;
  font-size: var(--reader-font-size);
  line-height: var(--reader-line-height);
  letter-spacing: 0.005em;
  overflow-wrap: anywhere;
}
```

Le Reader injecte les quatre variables CSS du profil courant. Sur Android, aucune ombre ou glow sur le texte. Animations limitées à des transitions de 120–180 ms sur boutons.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS et build 0.

- [ ] **Step 6: Commit**

Commit: `feat: build calm surah reader`

---

### Task 6: Mémoriser la taille et la dernière position de lecture

**Files:**
- Create: `src/reading/progressStore.ts`
- Create: `src/reading/progressStore.test.ts`
- Create: `src/reading/useVisibleVerse.ts`
- Modify: `src/pages/Reader.tsx`
- Modify: `src/pages/Home.tsx`

**Interfaces:**

```ts
export interface ReadingProgress {
  surahNumber: number;
  verseNumber: number;
  level: ReadingLevel;
  updatedAt: string;
}

export function loadProgress(): ReadingProgress | null;
export function saveProgress(progress: ReadingProgress): boolean;
```

Storage key exact : `ma-lecture:progress:v1`.

- [ ] **Step 1: Write store tests**

Tester : absence => `null`; JSON valide => objet ; JSON corrompu => `null`; `saveProgress` retourne `false` si `localStorage.setItem` lève une exception.

- [ ] **Step 2: Implement defensive store**

Valider : `surahNumber` 1–114, `verseNumber >= 1`, `level` appartient aux cinq valeurs. Ne jamais lancer une erreur vers l’UI.

- [ ] **Step 3: Implement visible-verse tracking**

`useVisibleVerse` observe tous les éléments `[data-verse-number]` avec :

```ts
new IntersectionObserver(callback, {
  root: null,
  rootMargin: '-20% 0px -65% 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1],
});
```

Choisir le verset intersectant avec le meilleur `intersectionRatio`. Écrire la progression avec un debounce de 300 ms pour éviter une écriture à chaque pixel de scroll.

- [ ] **Step 4: Restore position on Reader mount**

Si la progression correspond à la sourate ouverte, attendre le rendu puis appeler :

```ts
document.querySelector(`[data-verse-number="${progress.verseNumber}"]`)
  ?.scrollIntoView({ block: 'start' });
```

La taille est restaurée avant le scroll.

- [ ] **Step 5: Add Continue reading on Home**

Si `loadProgress()` renvoie une valeur, afficher `Continuer ma lecture` puis `Sourate {n} · verset {v}`. Le lien cible `#/sourate/{n}`.

- [ ] **Step 6: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

Commit: `feat: remember reading position locally`

---

### Task 7: Ajouter PWA installable et fonctionnement hors ligne

**Files:**
- Modify: `vite.config.ts`
- Create: `src/sw.ts`
- Create: `public/icons/icon.svg`
- Create: `scripts/generate-icons.mjs`
- Generate: `public/icons/icon-192.png`
- Generate: `public/icons/icon-512.png`
- Generate: `public/icons/icon-maskable-512.png`
- Create: `src/pwa/register.ts`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces: manifeste `Ma Lecture`, service worker et cache offline de l’application/corpus.

- [ ] **Step 1: Configure VitePWA injectManifest**

Manifest :

```ts
{
  id: '.',
  name: 'Ma Lecture',
  short_name: 'Ma Lecture',
  description: 'Une liseuse simple pour parcourir le Coran en français, sourate après sourate.',
  lang: 'fr',
  dir: 'ltr',
  start_url: '.',
  scope: '.',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#05080D',
  background_color: '#05080D',
  categories: ['books', 'education'],
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}
```

Utiliser une fonction `resolveBasePath()` compatible GitHub Pages : en Actions, `/${repoName}/`, sinon `/`, surchargeable par `VITE_BASE_PATH`.

- [ ] **Step 2: Implement service worker**

`src/sw.ts` :

```ts
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<unknown> };

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
```

Inclure JSON dans les patterns de précache et relever `maximumFileSizeToCacheInBytes` à 8 MiB pour absorber le corpus.

- [ ] **Step 3: Generate icons**

`icon.svg` : carré bleu-noir, symbole de livre ouvert abstrait blanc avec un filet cyan. Le script `sharp` rend 192, 512 et maskable 512 sans dépendance réseau.

- [ ] **Step 4: Register service worker**

`register.ts` utilise `registerSW({ immediate: true })`. En cas d’échec, `console.warn` seulement ; ne jamais bloquer la lecture.

- [ ] **Step 5: Build and inspect manifest**

Run: `npm run generate:icons && npm run build`
Expected: `dist/manifest.webmanifest`, service worker, corpus et trois PNG présents.

- [ ] **Step 6: Commit**

Commit: `feat: make Ma Lecture installable offline`

---

### Task 8: Ajouter les tests E2E Android, responsive et offline

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/reader.spec.ts`
- Create: `tests/e2e/pwa.spec.ts`

**Interfaces:**
- Produces: validation navigateur réelle de la V0.

- [ ] **Step 1: Configure Playwright**

Projets : `android` basé sur Pixel 5 ; `desktop` Chromium. `webServer.command = 'npm run preview -- --host 127.0.0.1'`, port 4173.

- [ ] **Step 2: Add reader journey test**

Scénario : accueil -> sourates -> ouvrir sourate 1 -> vérifier premier et dernier verset -> `A+` augmente `font-size` -> reload -> taille persiste -> scroll vers un verset -> reload -> retour proche de ce verset.

- [ ] **Step 3: Add width safety test**

Pour `[320, 360, 390, 430, 768, 1024]`, ouvrir une longue sourate et exiger :

```ts
const metrics = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth);
```

Tester aussi le niveau `maximum`.

- [ ] **Step 4: Add PWA/offline test**

Après première visite, attendre un contrôleur service worker, recharger, passer le contexte hors ligne, ouvrir `#/sourates`, puis `#/sourate/2` et vérifier qu’un verset est visible.

- [ ] **Step 5: Run full suite**

Run: `npm test && npm run build && npm run test:e2e`
Expected: all PASS.

- [ ] **Step 6: Commit**

Commit: `test: verify Android reading and offline flows`

---

### Task 9: Ajouter crédits, README et déploiement GitHub Pages

**Files:**
- Create: `README.md`
- Create: `.github/workflows/pages.yml`
- Modify: `src/pages/Home.tsx`

**Interfaces:**
- Produces: dépôt auto-documenté et URL HTTPS installable sur Android.

- [ ] **Step 1: Add discreet source link**

En bas de l’accueil, lien `Source de la traduction` vers une section interne ou `public/data/SOURCE.md` rendue en page simple si nécessaire. Le crédit ne doit pas parasiter l’écran de lecture.

- [ ] **Step 2: Write README**

Inclure : objectif V0, `npm install`, `npm run dev`, import/validation du corpus, tests, build, PWA Android, attribution QuranEnc/Hamidullah, rappel de ne pas modifier le texte importé.

- [ ] **Step 3: Create GitHub Pages workflow**

Workflow `push` sur `master` + `workflow_dispatch`, permissions `contents: read`, `pages: write`, `id-token: write`. Étapes : checkout, setup-node Node 22 cache npm, `npm ci`, `npm test`, `npm run build`, upload-pages-artifact `dist`, deploy-pages.

- [ ] **Step 4: Remove any remaining old project files**

Run: `find projet-01-fenetres -type f` ; supprimer chaque fichier restant. Le dossier disparaît du dépôt lorsque le dernier fichier est supprimé.

- [ ] **Step 5: Final local verification**

Run: `npm test && npm run build && npm run test:e2e`
Expected: all PASS.

- [ ] **Step 6: Commit**

Commit: `docs: finish Ma Lecture V0 delivery setup`

---

### Task 10: Vérification finale sur l’URL publiée

**Files:**
- No source changes unless verification reveals a defect.

**Interfaces:**
- Consumes: GitHub Pages deployment.
- Produces: V0 vérifiée sur une URL HTTPS réellement installable.

- [ ] **Step 1: Confirm Pages deployment success**

Le workflow doit terminer sans échec et retourner une URL GitHub Pages.

- [ ] **Step 2: Verify the public page**

Confirmer : titre `Ma Lecture`, fond sombre dès le premier rendu, liste des 114 sourates, lecture sourate 1, A−/A+, sourate suivante.

- [ ] **Step 3: Verify offline in browser**

Charger une fois l’URL, vérifier que le service worker contrôle la page, couper le réseau, recharger et ouvrir une autre sourate.

- [ ] **Step 4: Verify Android installability**

Sur Chrome Android réel si disponible : ouvrir l’URL HTTPS, vérifier que l’installation/Ajout à l’écran d’accueil est proposée ou disponible dans le menu, installer, lancer en standalone et confirmer que la lecture fonctionne hors ligne.

- [ ] **Step 5: Visual comfort pass**

Lire au moins la première portion d’une longue sourate au niveau `normal`, puis `large` et `maximum`. Rejeter la livraison si le texte paraît tassé, si les lignes sont trop longues, si les numéros attirent trop l’œil ou si les commandes prennent visuellement le dessus sur le texte.

- [ ] **Step 6: Report only verified results**

Rapporter l’URL, le statut de build/tests, le statut offline et le statut d’installation Android. Ne pas annoncer « terminé » si l’un de ces quatre points n’est pas vérifié.
