/* Connexion à la base SQLite locale (fichier data/lifeos.db par défaut). */

import { mkdirSync } from 'node:fs';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

export const URL_BASE = process.env.DATABASE_URL ?? 'file:data/lifeos.db';

if (URL_BASE.startsWith('file:')) mkdirSync('data', { recursive: true });

/* En développement, le rechargement à chaud réévalue ce module : on garde un seul client. */
const globale = globalThis as typeof globalThis & { clientLifeOS?: Client };
const client = globale.clientLifeOS ?? createClient({ url: URL_BASE });
if (process.env.NODE_ENV !== 'production') globale.clientLifeOS = client;

export const db = drizzle(client, { schema });
export { schema };
