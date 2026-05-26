# Super Mode Vocal — Protocole agentique validé par Amor

Statut : validé 100% par Amor le 2026-05-26.

Objectif : permettre à un agent Hermès/RMS-AI de faire entendre rapidement sa réponse à Amor via le projet ChatGPT `Mode Vocal`, sans dépendre d'une lecture manuelle par l'utilisateur.

## Pré-requis

- Navigateur commun Amor/Hermès : Google Chrome stable.
- Profil persistant : `C:\Users\A\.hermes\browser-profiles\marco-default`.
- Projet ChatGPT existant : `Mode Vocal`.
- Instructions du projet : ChatGPT doit répéter exactement l'entrée reçue, à la lettre/virgule près, sans réfléchir, expliquer, résumer, reformuler, corriger ni ajouter de commentaire.
- Le compositeur ChatGPT du projet doit être en mode `Instant`, pas `Étendue`/`Thinking`.

## Procédure rapide validée

1. Générer la réponse à faire entendre.
2. Ouvrir/focaliser la fenêtre `ChatGPT - Mode Vocal - Google Chrome` dans le navigateur commun.
3. Appuyer sur `Esc` pour fermer les menus éventuels, puis aller en bas de conversation.
4. Coller la réponse dans le compositeur du projet `Mode Vocal`.
5. Envoyer en mode `Instant`.
6. Dès que la réponse miroir apparaît, rester au bas de la conversation.
7. Détecter le bouton UI Automation `Plus d’actions` sous la dernière réponse, de préférence le plus bas visible.
8. Cliquer `Plus d’actions`.
9. Cibler exactement le `MenuItem` nommé `Lire à haute voix` — ne pas cliquer un simple texte contenant ces mots.
10. Cliquer `Lire à haute voix`.
11. Vérifier que l'état devient `Arrêter`, ou qu'un indicateur audio Chrome/ChatGPT confirme la lecture.
12. Si la détection automatique échoue, utiliser la coordonnée de secours uniquement après s'être assuré d'être au bas de la dernière réponse.

## Optimisation validée

- Éviter les captures/analyses visuelles entre chaque clic : utiliser UI Automation pour détecter `Plus d’actions` puis le `MenuItem` exact `Lire à haute voix`.
- Ne pas viser par texte approximatif : un long message peut contenir les mots `Lire à haute voix`; il faut viser le contrôle de menu réel.
- Amor a validé le dernier test à 100% : le Super Mode Vocal doit fonctionner le plus rapidement possible et est actif par défaut.

## Définition opérationnelle

Quand Amor dit `active le super mode vocal`, l'agent doit exécuter le flux complet : réponse → projet ChatGPT `Mode Vocal` → `Instant` → miroir → `Plus d’actions` → `Lire à haute voix` → vérification `Arrêter`.

Quand le Super Mode Vocal est actif par défaut, les réponses peuvent être plus développées, structurées et agréables à écouter, tant que l'exécution reste rapide.
