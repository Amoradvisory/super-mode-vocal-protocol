# Ma Lecture — Design V0

## 1. Vision

**Ma Lecture** est une PWA Android-first de lecture en français du sens des versets du Coran.

La V0 a une seule mission : permettre de choisir une sourate et de la lire du haut vers le bas, au doigt, pendant longtemps, avec un confort visuel maximal.

La réussite du produit se mesure par une phrase : **« J'ai envie de continuer à lire dans cette application. »**

Tout ce qui ne sert pas directement cette expérience est hors périmètre de la V0.

## 2. Périmètre V0

La V0 contient uniquement :

- une page d'accueil sobre ;
- une liste des 114 sourates ;
- l'ouverture d'une sourate ;
- la lecture verticale continue de tous ses versets en français ;
- le passage manuel à la sourate précédente ou suivante ;
- le réglage de la taille du texte ;
- la mémorisation locale du dernier passage lu ;
- un bouton « Continuer ma lecture » ;
- une installation PWA sur Android ;
- un fonctionnement hors ligne après la première installation/visite complète.

La V0 ne contient pas :

- compte ;
- authentification ;
- backend ;
- synchronisation ;
- notes ;
- favoris ;
- IA ;
- audio ;
- défilement automatique ;
- réseau social ;
- gamification ;
- statistiques ;
- recherche avancée dans le corpus.

## 3. Dépôt

Le dépôt de travail est :

`Amoradvisory/super-mode-vocal-protocol`

Le contenu existant peut être supprimé lors de l'implémentation. Aucun ancien composant ou ancien projet ne doit être conservé par principe.

Le dépôt privé `nur-quran-journey` est strictement une référence en lecture seule. Il ne doit jamais être modifié.

## 4. Expérience principale

### 4.1 Accueil

L'accueil doit être immédiat et calme.

Contenu :

1. nom de l'application : **Ma Lecture** ;
2. bouton **Continuer ma lecture** si une position précédente existe ;
3. accès à la liste des sourates ;
4. aucun tableau de bord, aucune statistique, aucun contenu décoratif qui repousse la lecture sous la ligne de flottaison.

### 4.2 Liste des sourates

Afficher les 114 sourates dans l'ordre.

Pour chaque sourate :

- numéro ;
- nom ;
- nombre de versets si la donnée est disponible de manière fiable.

La liste doit être lisible et tactile sur Android, sans cartes lourdes ni animations inutiles.

### 4.3 Écran de lecture

Une sourate occupe un écran de lecture continu.

En haut :

- retour vers les sourates ;
- nom de la sourate ;
- commandes `A−` et `A+`.

Ensuite :

- tous les versets dans l'ordre ;
- numéro de verset discret ;
- texte français dominant ;
- espacements généreux ;
- aucun encadrement systématique autour de chaque verset.

À la fin :

- bouton **Sourate suivante** ;
- accès discret à la sourate précédente si utile.

Le geste principal est simplement le défilement vertical au doigt.

## 5. Direction visuelle

### 5.1 Principe

L'interface doit ressembler davantage à une liseuse haut de gamme qu'à un site ou un tableau de bord.

L'application doit visuellement s'effacer pendant la lecture.

### 5.2 Couleurs

Base recommandée :

- fond principal : bleu-noir très profond autour de `#05080D` ;
- surfaces secondaires : bleu nuit légèrement plus clair ;
- texte français principal : **blanc** ;
- numéros de versets et informations secondaires : gris bleuté ;
- accent : cyan/bleu très discret pour navigation et focus.

Éviter le couple noir absolu `#000000` + blanc pur partout si cela crée un contraste trop agressif sur les surfaces secondaires. Le texte principal peut rester blanc, mais l'environnement doit adoucir la perception globale.

### 5.3 Typographie

La priorité est la lecture longue.

Le choix final de police doit être validé sur Android réel, pas seulement sur ordinateur.

Critères :

- formes de lettres très lisibles ;
- excellente netteté sur écran mobile ;
- confort sur paragraphes longs ;
- distinction claire des caractères ;
- aucune esthétique trop géométrique ou décorative.

Une serif de lecture moderne peut être retenue si elle est plus confortable qu'une sans-serif, mais le choix doit être guidé par des tests visuels réels.

### 5.4 Rythme de lecture

Pour chaque niveau de taille, ajuster ensemble :

- taille de police ;
- hauteur de ligne ;
- marges latérales ;
- espace vertical entre les versets.

Ne jamais faire de `A+` une simple augmentation isolée de `font-size`.

Point de départ sur smartphone :

- texte autour de 19–21 px en taille normale ;
- hauteur de ligne autour de 1.7 ;
- largeur de ligne volontairement contenue ;
- marges suffisantes pour éviter l'effet « mur de texte ».

## 6. Taille du texte

Les commandes `A−` et `A+` doivent être immédiatement compréhensibles.

Prévoir plusieurs paliers :

- petit ;
- normal ;
- grand ;
- très grand ;
- maximum.

Le niveau maximum doit rester utilisable sans débordement horizontal.

Le réglage est conservé localement entre deux ouvertures de l'application.

## 7. Reprise de lecture

Aucun compte n'existe.

La reprise est locale à l'appareil.

L'application doit mémoriser au minimum :

- numéro de sourate ;
- numéro du verset proche de la position visible ;
- taille de texte choisie.

Éviter de stocker uniquement une position en pixels, car elle devient invalide après un changement de taille du texte.

Sur l'accueil, afficher **Continuer ma lecture** avec la référence correspondante.

## 8. PWA et hors ligne

L'application doit être installable depuis Chrome Android sans passer par Google Play.

Elle doit disposer de :

- manifeste PWA ;
- icônes adaptées ;
- affichage standalone ;
- service worker ;
- mise en cache du shell applicatif ;
- mise en cache du corpus français nécessaire à la lecture.

Après une première installation/visite complète, l'utilisateur doit pouvoir :

- ouvrir l'application sans réseau ;
- afficher la liste des sourates ;
- lire n'importe quelle sourate déjà intégrée au corpus local ;
- modifier la taille du texte ;
- reprendre sa lecture.

Aucune requête réseau par verset.

## 9. Corpus

Le corpus français doit être local, structuré et immuable pendant la lecture.

Structure minimale par verset :

- `surahNumber` ;
- `surahName` ;
- `verseNumber` ;
- `frenchText`.

Avant intégration définitive :

- confirmer précisément la source ;
- confirmer les conditions de republication ;
- conserver l'attribution requise ;
- ne jamais reformuler automatiquement les versets ;
- ne jamais faire corriger le corpus par un modèle de langage.

La référence fonctionnelle exprimée par le propriétaire du projet est le texte français visible sur `coran-en-ligne.com/coran-en-francais.html`. Si une source officielle équivalente permet une republication plus claire et juridiquement plus propre, elle doit être privilégiée après vérification d'équivalence.

## 10. Architecture recommandée

Pour cette V0 :

- React ;
- TypeScript strict ;
- Vite ;
- CSS/Tailwind selon ce qui donne le meilleur contrôle de la liseuse ;
- PWA via service worker ;
- stockage local simple pour préférences et reprise de lecture ;
- IndexedDB uniquement si nécessaire pour le corpus ou si `localStorage` devient insuffisant.

Principe YAGNI : ne pas introduire de base distante, SDK d'authentification, couche API ou infrastructure serveur.

## 11. Composants conceptuels

Les responsabilités doivent rester séparées :

- `AppShell` : structure générale et navigation ;
- `Home` : accueil et reprise ;
- `SurahList` : liste des sourates ;
- `Reader` : lecture d'une sourate ;
- `Verse` : rendu d'un verset ;
- `ReadingControls` : A− / A+ et navigation minimale ;
- `ReadingProgressStore` : dernière sourate/verset et préférences ;
- `CorpusRepository` : accès en lecture seule au corpus ;
- `PwaService` : installation/cache/mises à jour.

Aucun composant ne doit devenir une « page monstre » mélangeant navigation, corpus, stockage et style.

## 12. Gestion des erreurs

Les erreurs doivent rester discrètes et en français.

Cas à prévoir :

- corpus indisponible ou invalide ;
- cache PWA incomplet ;
- stockage local indisponible ;
- mise à jour de l'application nécessaire.

Si la mémorisation de progression échoue, la lecture doit continuer. Une fonction secondaire ne doit jamais bloquer le texte.

## 13. Performance

Objectifs :

- ouverture rapide sur Android ;
- aucun clignotement de thème clair avant le thème sombre ;
- scroll 60 fps sur les longues sourates autant que le terminal le permet ;
- aucune requête réseau pendant le défilement ;
- aucune animation lourde sur l'écran de lecture ;
- absence totale de scroll horizontal accidentel.

Les optimisations doivent préserver la possibilité de sélectionner/copier le texte si cette capacité est conservée.

## 14. Accessibilité et confort

Minimum :

- contraste WCAG AA ;
- zones tactiles confortables ;
- support du zoom navigateur ;
- fonctionnement à 200 % de zoom ;
- focus clavier visible sur desktop même si Android est prioritaire ;
- aucune information essentielle donnée uniquement par la couleur.

Le confort perçu prime sur la densité d'information.

## 15. Responsive

Priorité de conception :

1. Android 360–430 px ;
2. tablette ;
3. desktop comme compatibilité secondaire.

Tester au minimum : 320, 360, 390, 430, 768 et 1024 px.

Sur grand écran, limiter la largeur de la colonne de lecture au lieu d'étirer le texte sur toute la fenêtre.

## 16. Tests d'acceptation V0

La V0 est acceptable si :

- les 114 sourates sont listées ;
- une sourate s'ouvre et affiche tous ses versets dans l'ordre ;
- le défilement au doigt est fluide ;
- `A−` et `A+` fonctionnent sans casser la mise en page ;
- le choix de taille persiste ;
- la dernière position de lecture est retrouvée après fermeture/réouverture ;
- le bouton Continuer ma lecture fonctionne ;
- l'application est installable sur Android ;
- elle fonctionne hors ligne après initialisation ;
- aucune largeur testée ne produit de scroll horizontal ;
- une longue session de lecture reste visuellement confortable ;
- aucun ancien projet du dépôt n'interfère avec l'application.

## 17. Règle de décision

Face à toute nouvelle idée pendant la V0, poser deux questions :

1. **Est-ce indispensable pour lire une sourate confortablement ?**
2. **Est-ce que cela rend l'écran de lecture plus calme ou plus encombré ?**

Si la fonction n'est pas indispensable à la lecture ou augmente la charge visuelle, elle est repoussée après la V0.
