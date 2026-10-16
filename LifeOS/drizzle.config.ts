import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './serveur/db/schema.ts',
  out: './serveur/db/migrations',
  dbCredentials: { url: process.env.DATABASE_URL ?? 'file:data/lifeos.db' }
});
