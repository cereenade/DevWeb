/* Connexion à la base de données.
   - En local : fichier SQLite data/lifeos.db (par défaut).
   - En ligne (Vercel…) : base libSQL hébergée, par exemple Turso, via DATABASE_URL
     (« libsql://… ») et DATABASE_AUTH_TOKEN. Le disque d'un hébergeur sans serveur est
     en lecture seule et effacé à chaque déploiement : un fichier local n'y tiendrait pas. */

import { mkdirSync } from 'node:fs';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

if (process.env.VERCEL && !process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL manquante : sur Vercel, LifeOS a besoin d’une base hébergée (Turso, par exemple). '
    + 'Ajoutez DATABASE_URL et DATABASE_AUTH_TOKEN dans les variables d’environnement du projet.'
  );
}

export const URL_BASE = process.env.DATABASE_URL ?? 'file:data/lifeos.db';

if (URL_BASE.startsWith('file:')) mkdirSync('data', { recursive: true });

/* En développement, le rechargement à chaud réévalue ce module : on garde un seul client. */
const globale = globalThis as typeof globalThis & { clientLifeOS?: Client };
const client = globale.clientLifeOS ?? createClient({ url: URL_BASE, authToken: process.env.DATABASE_AUTH_TOKEN });
if (process.env.NODE_ENV !== 'production') globale.clientLifeOS = client;

export const db = drizzle(client, { schema });
export { schema };
