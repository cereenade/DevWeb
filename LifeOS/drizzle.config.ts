import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL ?? 'file:data/lifeos.db';

/* Fichier local : SQLite. Base hébergée (libsql://…, Turso) : jeton d'accès en plus. */
export default url.startsWith('file:')
  ? defineConfig({
    dialect: 'sqlite',
    schema: './serveur/db/schema.ts',
    out: './serveur/db/migrations',
    dbCredentials: { url }
  })
  : defineConfig({
    dialect: 'turso',
    schema: './serveur/db/schema.ts',
    out: './serveur/db/migrations',
    dbCredentials: { url, authToken: process.env.DATABASE_AUTH_TOKEN }
  });
