# LifeOS — Vos papiers. En clair.

Application Next.js (App Router) qui explique les documents administratifs français.
Le front et le back sont dans ce même projet : pages React, actions serveur et base de données SQLite locale.

## Démarrer

```bash
pnpm install
pnpm db:seed    # facultatif : crée le compte de démo camille@exemple.fr / lifeos-demo
pnpm dev        # http://localhost:3000
```

La base est un simple fichier, `data/lifeos.db`. Elle est créée et mise à jour automatiquement
au démarrage du serveur (`instrumentation.ts`). Chaque nouveau compte reçoit cinq documents d'exemple.

## Consulter la base de données

```bash
pnpm db:studio
```

Ouvre Drizzle Studio dans le navigateur : tables `utilisateurs`, `sessions`, `documents`, `notifications`,
avec lecture et modification. Le fichier `data/lifeos.db` s'ouvre aussi avec n'importe quel outil SQLite
(DB Browser for SQLite, extension SQLite de VS Code…).

## Scripts base de données

| Commande | Rôle |
| --- | --- |
| `pnpm db:generate` | Crée une migration après une modification de `serveur/db/schema.ts` |
| `pnpm db:migrate` | Applique les migrations (fait aussi au démarrage du serveur) |
| `pnpm db:seed` | (Re)crée le compte de démonstration |
| `pnpm db:studio` | Interface pour consulter et modifier la base |

Pour utiliser un autre fichier, définir `DATABASE_URL` (par exemple `file:data/autre.db`).

## Déployer sur Vercel

Le disque de Vercel est en lecture seule : la base doit être hébergée. LifeOS utilise libSQL,
donc une base [Turso](https://turso.tech) (offre gratuite) convient sans changer le code.

1. **Root Directory** : dans le projet Vercel, *Settings → Build and Deployment → Root Directory*,
   indiquer `LifeOS` (le dossier qui contient `package.json`). Sans cela : erreur `NEXT_NO_VERSION`.
2. **Base Turso** : dans le projet Vercel, onglet *Storage* → *Create Database* → **Turso**, puis
   la connecter au projet (tous les environnements). Vercel ajoute alors `TURSO_DATABASE_URL` et
   `TURSO_AUTH_TOKEN`, que LifeOS lit directement. (Autre possibilité : une base créée sur turso.tech,
   avec `DATABASE_URL` et `DATABASE_AUTH_TOKEN` saisies à la main.)
3. Redéployer. Les tables sont créées au premier démarrage. Pour créer le compte de démo en ligne :
   `vercel env pull .env.production.local --environment production`, puis lancer `pnpm db:seed`
   avec ces variables chargées.

`pnpm db:studio` fonctionne aussi sur la base Turso avec ces variables.

## Organisation

- `app/` — les routes. `(public)` : connexion ; `(app)` : écrans connectés avec la barre d'onglets ;
  `(plein-ecran)` : onboarding et analyse ; `api/mes-donnees` : export des données.
- `components/vues/` — un composant d'interface par écran ; `components/` — éléments partagés.
- `serveur/` — le back-end, jamais envoyé au navigateur :
  - `db/` : schéma, connexion, migrations, contenu de démonstration ;
  - `session.ts` : sessions par cookie httpOnly ; `motDePasse.ts` : empreintes scrypt ;
  - `donnees.ts` : lectures, toujours limitées à la personne connectée ;
  - `actions/` : actions serveur (compte, préférences, documents).
- `lib/` — types, constantes et fonctions partagés par le serveur et l'interface.
- `public/sw.js` — service worker (mode hors connexion), enregistré en production seulement.
