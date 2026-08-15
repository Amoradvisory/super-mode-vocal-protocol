# super-mode-vocal-protocol — laboratoire

Ce dépôt historique est désormais un laboratoire public de mini-projets et d'expérimentations techniques.

## Projet 01 — Neon Isles

Neon Isles est un jeu original de blocs tombants, mobile-first, construit comme PWA statique sans backend.

### Fonctionnalités actuelles

- moteur de jeu testé : déplacement, rotation, collision, chute douce/rapide, lignes, score, niveaux ;
- réserve (`hold`) et aperçu des trois prochaines pièces ;
- difficulté Détente / Standard / Dynamique ;
- thèmes Antilles Neon, Canary Sunset, Balearic Moon et accent personnalisé ;
- contrôles clavier et tactiles ;
- record et préférences stockés localement ;
- manifest + service worker pour installation et fonctionnement hors ligne après chargement initial.

### Tester localement

```bash
npm test
npm run check
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000/projects/neon-isles/`.

## Structure

- `projects/neon-isles/` : application du premier projet ;
- `tests/` : tests automatiques ;
- `docs/superpowers/plans/` : plans d'implémentation ;
- `.github/workflows/` : contrôle continu.

Aucun secret, token ou donnée privée ne doit être ajouté à ce dépôt public.
