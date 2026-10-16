import 'server-only';

/* Couche d'accès aux données : toutes les lectures passent par la personne connectée,
   jamais par un identifiant venu du navigateur. */

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { documents, notifications, utilisateurs } from './db/schema';
import { lireSession } from './session';
import type { DocumentAdmin, NotificationLifeOS, Utilisateur } from '@/lib/data';

type LigneUtilisateur = typeof utilisateurs.$inferSelect;
type LigneDocument = typeof documents.$inferSelect;

function versUtilisateur(u: LigneUtilisateur): Utilisateur {
  return {
    prenom: u.prenom,
    email: u.email,
    onboardingVu: u.onboardingVu,
    langue: u.langue,
    lectureFacile: u.lectureFacile,
    tailleTexte: u.tailleTexte,
    reglages: { rappels: u.reglageRappels, analyses: u.reglageAnalyses, resume: u.reglageResume },
    installMasque: u.installMasque
  };
}

function versDocument(d: LigneDocument): DocumentAdmin {
  return {
    slug: d.slug,
    organisme: d.organisme,
    initiales: d.initiales,
    categorie: d.categorie,
    objet: d.objet,
    demarche: d.demarche,
    recuLe: d.recuLe,
    echeance: d.echeance,
    statut: d.statut,
    teinte: { fond: d.teinteFond, texte: d.teinteTexte },
    enClair: d.enClair,
    enClairFacile: d.enClairFacile,
    extrait: d.extrait,
    extraitExplique: d.extraitExplique,
    etapes: d.etapes,
    etapesFaites: d.etapes.map((_, i) => Boolean(d.etapesFaites[i])),
    questions: d.questions,
    rappels: d.rappels
  };
}

/** Identifiant de la personne connectée ; sinon, renvoi vers la page de connexion. */
export const idUtilisateur = cache(async (): Promise<string> => {
  const id = await lireSession();
  if (!id) redirect('/connexion');
  return id;
});

const ligneUtilisateur = cache(async (id: string) =>
  db.query.utilisateurs.findFirst({ where: eq(utilisateurs.id, id) })
);

/** La personne connectée ; renvoie vers la connexion si la session ne correspond plus à un compte. */
export async function utilisateurCourant(): Promise<Utilisateur> {
  const ligne = await ligneUtilisateur(await idUtilisateur());
  if (!ligne) redirect('/connexion');
  return versUtilisateur(ligne);
}

/** Pour les pages publiques : la personne connectée si elle existe, sans redirection. */
export async function utilisateurOptionnel(): Promise<Utilisateur | null> {
  const id = await lireSession();
  const ligne = id ? await ligneUtilisateur(id) : undefined;
  return ligne ? versUtilisateur(ligne) : null;
}

export async function mesDocuments(): Promise<DocumentAdmin[]> {
  const id = await idUtilisateur();
  const lignes = await db.select().from(documents)
    .where(eq(documents.utilisateurId, id))
    .orderBy(desc(documents.recuLe), asc(documents.creeLe));
  return lignes.map(versDocument);
}

export async function monDocument(slug: string): Promise<DocumentAdmin | null> {
  const id = await idUtilisateur();
  const ligne = await db.query.documents.findFirst({
    where: and(eq(documents.utilisateurId, id), eq(documents.slug, slug))
  });
  return ligne ? versDocument(ligne) : null;
}

export async function mesNotifications(): Promise<NotificationLifeOS[]> {
  const id = await idUtilisateur();
  const lignes = await db.select().from(notifications)
    .where(eq(notifications.utilisateurId, id))
    .orderBy(desc(notifications.creeLe));
  return lignes.map((n) => ({
    id: n.id, titre: n.titre, texte: n.texte, creeLe: n.creeLe, ton: n.ton, lien: n.lien, action: n.action, lue: n.lue
  }));
}

export async function nombreNotificationsNonLues(): Promise<number> {
  return (await mesNotifications()).filter((n) => !n.lue).length;
}

/** Tout ce que LifeOS conserve sur la personne connectée (export « Gérer mes données »). */
export async function exportDeMesDonnees() {
  return {
    compte: await utilisateurCourant(),
    documents: await mesDocuments(),
    notifications: await mesNotifications(),
    exporteLe: new Date().toISOString()
  };
}
