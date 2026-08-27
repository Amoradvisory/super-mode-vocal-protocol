# Projet 01 — Fenêtres : design

## Objectif pédagogique
Créer un premier site web moderne et déployable qui montre clairement la chaîne GitHub → Vercel → Internet, en utilisant les deux photos originales de fenêtres fournies dans la conversation.

Le projet doit rester suffisamment simple pour être compris comme première leçon, tout en utilisant une base moderne avec React + Vite.

## Contenu
- Nom de travail : « Fenêtres au meilleur prix ».
- Slogan principal : « Ne jetez pas votre argent par les fenêtres ».
- Deux produits illustrés avec les images originales :
  - `public/assets/fenetre-125.jpg`
  - `public/assets/fenetre-109.jpg`
- Prix visibles : 125 € et 109 €.
- Interface responsive, claire et professionnelle.

## Architecture
Le projet sera autonome dans `projet-01-fenetres/`.

Structure prévue :

```text
projet-01-fenetres/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── public/
│   └── assets/
│       ├── fenetre-125.jpg
│       └── fenetre-109.jpg
└── docs/
    └── superpowers/specs/
```

## Interface et interactions
La page comportera :
1. un en-tête simple avec identité visuelle ;
2. une section héro avec slogan et appel à l’action ;
3. une zone produit mettant en avant une fenêtre à la fois ;
4. un bouton React permettant de passer de la fenêtre à 125 € à celle à 109 € ;
5. un comparatif simple des deux offres ;
6. un petit indicateur d’économie quand l’offre à 109 € est sélectionnée ;
7. une mise en page adaptée au mobile et à l’ordinateur.

Les interactions seront gérées côté navigateur avec React, sans backend et sans API.

## Données et sécurité
Aucune donnée personnelle, clé API ou secret ne sera nécessaire pour cette première leçon. Les deux images seront des fichiers statiques publics du site une fois le déploiement rendu public.

## Déploiement prévu
Vercel servira de plateforme de déploiement. Le dossier `projet-01-fenetres/` devra pouvoir être configuré comme Root Directory d’un projet Vercel distinct.

Le déploiement ne sera considéré comme validé qu’après vérification du build, de l’URL accessible, du contenu et de la présence effective des deux images.

## Tests et critères de réussite
Avant déploiement :
- installation des dépendances réussie ;
- build Vite réussi ;
- aucun chemin d’image cassé ;
- les deux produits sont visibles ;
- le changement de produit fonctionne ;
- l’interface reste utilisable sur petit écran.

Critère final : un visiteur doit pouvoir ouvrir l’URL Vercel, voir les deux vraies photos et utiliser au moins une interaction React sans erreur.