/* Exécuté une fois au démarrage du serveur Next.js : la base est créée ou mise à jour automatiquement. */

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { migrerBase } = await import('./serveur/db/migrer');
  await migrerBase();
}
