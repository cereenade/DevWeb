/* Remet à jour les dates des documents d'exemple de tous les comptes existants : `pnpm db:demo-a-jour`.
   Les dates repartent d'aujourd'hui ; les étapes cochées et les rappels sont conservés. */

import { and, eq } from 'drizzle-orm';
import { db } from '../serveur/db';
import { documents, notifications, utilisateurs } from '../serveur/db/schema';
import { migrerBase } from '../serveur/db/migrer';
import { documentsDemoDates, notificationsDemoDatees } from '../lib/demoDates';

async function principal() {
  await migrerBase();
  const modeles = documentsDemoDates();
  const notes = notificationsDemoDatees();
  const comptes = await db.select({ id: utilisateurs.id, email: utilisateurs.email }).from(utilisateurs);

  for (const compte of comptes) {
    for (const m of modeles) {
      await db.update(documents)
        .set({
          recuLe: m.recuLe, echeance: m.echeance, objet: m.objet, enClair: m.enClair,
          enClairFacile: m.enClairFacile, extraitExplique: m.extraitExplique, questions: m.questions
        })
        .where(and(eq(documents.utilisateurId, compte.id), eq(documents.slug, m.slug)));
    }
    for (const n of notes) {
      await db.update(notifications)
        .set({ texte: n.texte, creeLe: new Date(Date.now() - n.joursAvant * 86400000) })
        .where(and(eq(notifications.utilisateurId, compte.id), eq(notifications.titre, n.titre)));
    }
    console.log(`Dates d'exemple mises à jour : ${compte.email}`);
  }
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
