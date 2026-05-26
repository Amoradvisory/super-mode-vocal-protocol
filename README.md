# Super Mode Vocal Protocol

Procédure agentique validée par Amor pour faire lire rapidement une réponse Hermès/RMS-AI via ChatGPT.

## Statut

Validé 100% en conditions réelles :

- projet ChatGPT `Mode Vocal` ;
- mode `Instant` ;
- effet miroir exact ;
- déclenchement rapide de `Lire à haute voix` ;
- vérification par l'état `Arrêter`.

## Objectif

Permettre à un agent local de :

1. focaliser le navigateur commun persistant ;
2. coller/envoyer la réponse à faire entendre ;
3. attendre la réponse miroir ;
4. cliquer le vrai menu `Plus d’actions` ;
5. sélectionner le `MenuItem` exact `Lire à haute voix` ;
6. vérifier que la lecture est active.

## Pré-requis

- Windows.
- Google Chrome déjà ouvert avec une session ChatGPT connectée.
- Projet ChatGPT nommé `Mode Vocal`.
- Instructions du projet : répéter exactement le texte reçu, sans raisonnement ni commentaire.
- Compositeur du projet réglé sur `Instant`.
- Python avec `pyautogui`, `pyperclip`, `pywinauto`.

## Utilisation

```bash
python scripts/super_mode_vocal_fast.py --text "Texte à faire lire par ChatGPT."
```

Ou :

```bash
python scripts/super_mode_vocal_fast.py --file message.txt
```

## Points critiques

- Ne pas utiliser un navigateur jetable : viser le Chrome persistant où ChatGPT est déjà connecté.
- Ne pas cliquer un texte qui contient les mots `Lire à haute voix` : cibler le vrai `MenuItem`.
- Éviter les captures écran dans le chemin rapide ; utiliser l'UI Automation.
- En cas d'échec : aller en bas de la réponse, rouvrir `Plus d’actions`, puis cliquer `Lire à haute voix`.

## Origine

Ce protocole a été créé pour Amor/Hermès/RMS-AI afin de transformer une réponse textuelle en lecture vocale rapide, reproductible et vérifiée.
