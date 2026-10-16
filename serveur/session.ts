import 'server-only';

/* Sessions : un jeton aléatoire dans un cookie httpOnly, son empreinte en base.
   Un vol de la base ne permet donc pas de se faire passer pour quelqu'un. */

import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { and, eq, gt } from 'drizzle-orm';
import { db } from './db';
import { sessions } from './db/schema';

const COOKIE = 'lifeos_session';
const DUREE_JOURS = 30;

function empreinte(jeton: string) {
  return createHash('sha256').update(jeton).digest('hex');
}

export async function ouvrirSession(utilisateurId: string) {
  const jeton = randomBytes(32).toString('base64url');
  const expireLe = new Date(Date.now() + DUREE_JOURS * 86400000);
  await db.insert(sessions).values({ id: empreinte(jeton), utilisateurId, expireLe });
  (await cookies()).set(COOKIE, jeton, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expireLe
  });
}

/** Identifiant de la personne connectée, ou `null`. */
export async function lireSession(): Promise<string | null> {
  const jeton = (await cookies()).get(COOKIE)?.value;
  if (!jeton) return null;
  /* La validité dépend de l'heure : cette lecture se fait forcément à la demande. */
  await connection();
  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.id, empreinte(jeton)), gt(sessions.expireLe, new Date()))
  });
  return session?.utilisateurId ?? null;
}

export async function fermerSession() {
  const magasin = await cookies();
  const jeton = magasin.get(COOKIE)?.value;
  if (jeton) await db.delete(sessions).where(eq(sessions.id, empreinte(jeton)));
  magasin.delete(COOKIE);
}
