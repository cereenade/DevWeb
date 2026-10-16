/* Applique les migrations en attente. Appelé au démarrage du serveur (instrumentation.ts)
   et par `pnpm db:migrate`. Les fichiers de migration sont inclus dans le déploiement
   par next.config.ts (outputFileTracingIncludes). */

import path from 'node:path';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index';

export async function migrerBase() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), 'serveur/db/migrations') });
}
