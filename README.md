# LifeOS — Vos papiers. En clair.

Application Next.js (App Router) qui explique les documents administratifs français.
Version de démonstration : les documents sont des exemples et l'état est conservé dans le navigateur (localStorage).

## Lancer

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start
```

Le service worker (`public/sw.js`, mode hors connexion) n'est enregistré qu'en production.

## Organisation

- `app/` — les routes. `(public)` : accueil, connexion, onboarding ; `(app)` : écrans connectés avec la barre d'onglets ; `(plein-ecran)` : écran d'analyse.
- `components/vues/` — un composant par écran.
- `components/` — icônes, petits composants partagés, garde de connexion, démarrage (préférences, hors connexion, PWA).
- `lib/data.ts` — données de démonstration ; `lib/store.ts` — état local ; `lib/format.ts` — dates ; `lib/navigateur.ts` — notifications, installation, export.
- `app/manifest.ts` — manifeste PWA (servi à `/manifest.webmanifest`).
