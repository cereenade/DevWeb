/* Connexion à la base de données.
   - En local : fichier SQLite data/lifeos.db (par défaut).
   - En ligne (Vercel…) : base libSQL hébergée, par exemple Turso, via DATABASE_URL
     (« libsql://… ») et DATABASE_AUTH_TOKEN. Les noms créés par l'intégration Turso de Vercel
     (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN) sont aussi reconnus. Le disque d'un hébergeur sans serveur est
     en lecture seule et effacé à chaque déploiement : un fichier local n'y tiendrait pas. */

import { mkdirSync } from 'node:fs';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const urlConfiguree = process.env.DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
const jeton = process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN;

if (process.env.VERCEL && !urlConfiguree) {
  throw new Error(
    'Base de données manquante : sur Vercel, LifeOS a besoin d’une base hébergée. '
    + 'Connectez Turso au projet (onglet Storage) ou définissez DATABASE_URL et DATABASE_AUTH_TOKEN.'
  );
}

export const URL_BASE = urlConfiguree ?? 'file:data/lifeos.db';

if (URL_BASE.startsWith('file:')) mkdirSync('data', { recursive: true });

/* En développement, le rechargement à chaud réévalue ce module : on garde un seul client. */
const globale = globalThis as typeof globalThis & { clientLifeOS?: Client };
const client = globale.clientLifeOS ?? createClient({ url: URL_BASE, authToken: jeton });
if (process.env.NODE_ENV !== 'production') globale.clientLifeOS = client;

export const db = drizzle(client, { schema });
export { schema };
