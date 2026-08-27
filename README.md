# Ma Lecture

**Ma Lecture** est une PWA Android-first volontairement minimaliste pour lire en français le sens des versets du Coran, sourate après sourate.

## V0

- 114 sourates ;
- lecture verticale au doigt ;
- cinq niveaux de confort typographique ;
- reprise locale du dernier passage ;
- installation depuis Chrome Android ;
- fonctionnement hors ligne après la première visite complète ;
- aucun compte, backend, note, audio, IA ou synchronisation.

## Développement

Prérequis : Node.js 22+.

```bash
npm install
npm run import:corpus
npm run generate:icons
npm test
npm run build
npm run dev
```

Tests navigateur :

```bash
npx playwright install chromium
npm run build
npm run test:e2e
```

## Corpus français

La traduction intégrée est celle de **Muhammad Hamidullah**, publiée par **QuranEnc.com** sous la clé `french_hameedullah`. La V0 fige actuellement la **version 1.0.2**. Le script `scripts/import-quranenc.mjs` importe les 114 sourates sans reformulation du texte, puis `scripts/validate-corpus.mjs` exige exactement 114 sourates et 6236 versets.

Les métadonnées exactes de la version intégrée et la date d’import sont conservées dans `public/data/SOURCE.md`.

**Ne pas modifier le texte importé.** Avant une nouvelle publication, vérifier la version et les conditions de republication annoncées par QuranEnc.

## PWA

Après déploiement HTTPS, ouvrir le site avec Chrome sur Android puis utiliser l’option d’installation/Ajout à l’écran d’accueil. Le service worker précache l’application et le corpus pour permettre la lecture hors ligne.
