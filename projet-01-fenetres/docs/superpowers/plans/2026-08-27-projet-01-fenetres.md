# Projet 01 — Fenêtres Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire puis déployer sur Vercel un premier site React + Vite présentant les deux photos originales de fenêtres à 125 € et 109 €, avec une interaction React visible.

**Architecture:** Application frontend autonome dans `projet-01-fenetres/`. Les données produits restent locales dans React, les deux JPEG sont servis depuis `public/assets/`, et Vercel utilise ce dossier comme racine du projet.

**Tech Stack:** React 18, Vite 5, CSS natif, Vitest, Vercel.

**Spec:** `projet-01-fenetres/docs/superpowers/specs/2026-08-27-projet-01-fenetres-design.md`

## Global Constraints

- Utiliser uniquement les deux photos originales fournies dans la conversation : `fenetre-125.jpg` et `fenetre-109.jpg`.
- Prix visibles : 125 € et 109 €.
- Slogan principal : « Ne jetez pas votre argent par les fenêtres ».
- Aucune API, aucun backend, aucune clé secrète.
- Le site doit être responsive et contenir au moins une interaction React.
- Le déploiement n'est validé qu'après build réussi, URL accessible, contenu correct et deux images effectivement servies.

---

### Task 1: Socle React + Vite et logique produit

**Files:**
- Create: `projet-01-fenetres/package.json`
- Create: `projet-01-fenetres/index.html`
- Create: `projet-01-fenetres/vite.config.js`
- Create: `projet-01-fenetres/src/product.js`
- Create: `projet-01-fenetres/src/product.test.js`

**Interfaces:**
- Produces: `PRODUCTS` tableau de deux objets et `getSaving(selectedPrice)` retournant un nombre en euros.

- [ ] **Step 1: Write the failing test**

```js
import { describe, expect, it } from 'vitest';
import { PRODUCTS, getSaving } from './product.js';

describe('produits fenêtres', () => {
  it('contient les deux offres originales', () => {
    expect(PRODUCTS.map((p) => p.price)).toEqual([125, 109]);
    expect(PRODUCTS.map((p) => p.image)).toEqual([
      '/assets/fenetre-125.jpg',
      '/assets/fenetre-109.jpg',
    ]);
  });

  it('calcule 16 euros d’économie pour la fenêtre à 109 euros', () => {
    expect(getSaving(109)).toBe(16);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run`
Expected: FAIL because `src/product.js` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

```js
export const PRODUCTS = [
  { id: '125', price: 125, image: '/assets/fenetre-125.jpg', label: 'Fenêtre classique' },
  { id: '109', price: 109, image: '/assets/fenetre-109.jpg', label: 'Fenêtre prix malin' },
];

export function getSaving(selectedPrice) {
  return Math.max(0, 125 - selectedPrice);
}
```

`package.json` doit définir `dev`, `build`, `preview` et `test`, avec React 18, Vite 5 et Vitest.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run`
Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

Commit message: `feat: add window product model`

### Task 2: Interface React et styles responsive

**Files:**
- Create: `projet-01-fenetres/src/App.jsx`
- Create: `projet-01-fenetres/src/main.jsx`
- Create: `projet-01-fenetres/src/styles.css`

**Interfaces:**
- Consumes: `PRODUCTS`, `getSaving` depuis `src/product.js`.
- Produces: application React interactive avec sélection entre les deux fenêtres.

- [ ] **Step 1: Implement App.jsx**

L'interface doit inclure le titre `Fenêtres au meilleur prix`, le slogan `Ne jetez pas votre argent par les fenêtres`, deux boutons de sélection 125 € / 109 €, une grande image du produit sélectionné, son prix, un badge d'économie de 16 € pour l'offre 109 €, et une section comparative des deux offres.

- [ ] **Step 2: Implement main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
```

- [ ] **Step 3: Implement responsive CSS**

Utiliser une mise en page claire : navigation compacte, hero en grille sur grand écran, cartes produits, boutons accessibles, passage en une colonne sous 760 px. Aucune dépendance CSS externe.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: Vite exits with code 0 and creates `dist/`.

- [ ] **Step 5: Commit**

Commit message: `feat: build interactive window showcase`

### Task 3: Intégrer les deux images originales

**Files:**
- Create binary: `projet-01-fenetres/public/assets/fenetre-125.jpg`
- Create binary: `projet-01-fenetres/public/assets/fenetre-109.jpg`

**Interfaces:**
- Consumes: the two original conversation attachments.
- Produces: the exact static image URLs used by `PRODUCTS`.

- [ ] **Step 1: Copy the exact original attachments**

Ne pas recréer, retoucher ou remplacer les JPEG.

- [ ] **Step 2: Verify paths**

Check both files exist and are non-empty at the exact paths above.

- [ ] **Step 3: Re-run build**

Run: `npm run build`
Expected: exit code 0 and both images copied into `dist/assets/` as static public files.

- [ ] **Step 4: Commit**

Commit message: `assets: add original window photos`

### Task 4: Déployer et vérifier sur Vercel

**Files:**
- No source file changes unless Vercel configuration requires them.

**Interfaces:**
- Consumes: completed `projet-01-fenetres/`.
- Produces: one Vercel deployment URL.

- [ ] **Step 1: Create or configure Vercel project**

Use team/scope already connected in ChatGPT and set Root Directory to `projet-01-fenetres/`.

- [ ] **Step 2: Trigger production deployment**

Deploy the current GitHub content or equivalent source package.

- [ ] **Step 3: Verify deployment state**

Require Vercel status `READY` after a completed build.

- [ ] **Step 4: Verify public URL**

Open the returned URL and confirm HTTP success plus visible title/slogan and prices 125 € / 109 €.

- [ ] **Step 5: Verify both images**

Open `/assets/fenetre-125.jpg` and `/assets/fenetre-109.jpg` on the deployed domain and confirm both are served successfully.

- [ ] **Step 6: Report only verified result**

Return the URL only after build, READY state, page content, interaction source, and both image URLs are confirmed.