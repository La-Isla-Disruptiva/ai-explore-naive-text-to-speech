# Phase 0 : Recherche

## Synthèse vocale JavaScript
- Utilisation de l’API Web Speech (SpeechSynthesis) pour la lecture à voix haute.
- Support natif dans la plupart des navigateurs modernes.
- Limites : qualité des voix, support variable selon le navigateur, options de voix masculine/féminine.

## Détection de langue
- Utilisation de bibliothèques JS simples ou d’algorithmes maison pour détecter la langue dominante (français, anglais, espagnol).
- Affichage du pourcentage de chaque langue détectée dans le texte.
- Blocage si la langue dominante < 50%.

## Limitations PWA
- Fonctionnement hors-ligne possible grâce au service worker.
- Manifest pour installation sur mobile/desktop.
- Pas de backend, pas de base de données, tout est local.

## Contraintes
- Texte ≤ 500 mots.
- Voix masculine par défaut, option voix féminine.
- Pas d’API externe, pas de stockage distant.

---
