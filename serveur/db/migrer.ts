/* Applique les migrations en attente. Appelé au démarrage du serveur (instrumentation.ts)
   et par `pnpm db:migrate`. */

import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index';

export async function migrerBase() {
  await migrate(db, { migrationsFolder: 'serveur/db/migrations' });
}
