/* Crée (ou recrée) le compte de démonstration : `pnpm db:seed`.
   Identifiants : camille@exemple.fr / lifeos-demo */

import { eq } from 'drizzle-orm';
import { db } from '../serveur/db';
import { utilisateurs } from '../serveur/db/schema';
import { migrerBase } from '../serveur/db/migrer';
import { creerContenuDemo } from '../serveur/db/demo';
import { hacherMotDePasse } from '../serveur/motDePasse';

const EMAIL = 'camille@exemple.fr';
const MOT_DE_PASSE = 'lifeos-demo';

async function principal() {
  await migrerBase();
  await db.delete(utilisateurs).where(eq(utilisateurs.email, EMAIL));
  const [compte] = await db.insert(utilisateurs)
    .values({ prenom: 'Camille', email: EMAIL, motDePasse: await hacherMotDePasse(MOT_DE_PASSE), onboardingVu: true })
    .returning({ id: utilisateurs.id });
  await creerContenuDemo(compte.id);
  console.log(`Compte de démonstration prêt : ${EMAIL} / ${MOT_DE_PASSE}`);
}

principal().catch((erreur) => {
  console.error(erreur);
  process.exit(1);
});
