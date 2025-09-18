# Requis techniques minimaux pour une application web statique PWA

1. Simplicité et autonomie
- Chaque composant doit être autonome, testable indépendamment et documenté.
- La structure du projet doit rester simple (YAGNI : ne pas ajouter de complexité inutile).
- Utiliser en priorité du code vanille plutôt que des librairies externes.

2. Testabilité
- Les tests doivent être écrits avant l’implémentation (TDD obligatoire).
- Les tests doivent être validés par l’utilisateur avant le développement.
- Cycle Red-Green-Refactor strictement appliqué.

3. Interface utilisateur
- L’application doit fonctionner en mode statique (HTML/CSS/JS sans backend dynamique).
- Doit respecter les standards PWA : manifest, service worker, responsive design.

4. Observabilité et débogage
- Journalisation structurée (logs lisibles et exploitables).
- Text I/O pour faciliter le débogage.

5. Versioning et évolutivité
- Utiliser un format de version MAJOR.MINOR.BUILD.
- Toute modification majeure doit être documentée et validée.

6. Sécurité et conformité
- Respecter les standards de sécurité du web (HTTPS, CSP, etc.).
- Définir les politiques de déploiement et de conformité.

7. Workflow de développement
- Revue de code obligatoire avant tout déploiement.
- Les PRs doivent vérifier la conformité à la constitution.