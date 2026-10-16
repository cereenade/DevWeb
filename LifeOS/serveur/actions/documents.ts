'use server';

/* Suivi des démarches : étapes, rappels, suppression, notifications. */

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { documents, notifications } from '../db/schema';
import { ajouterDocumentDemo } from '../db/demo';
import { idUtilisateur } from '../donnees';

async function documentDe(utilisateurId: string, slug: string) {
  return db.query.documents.findFirst({
    where: and(eq(documents.utilisateurId, utilisateurId), eq(documents.slug, slug))
  });
}

/** Coche ou décoche une étape ; renvoie la liste à jour. */
export async function basculerEtape(slug: string, index: number): Promise<boolean[]> {
  const id = await idUtilisateur();
  const doc = await documentDe(id, slug);
  if (!doc || index < 0 || index >= doc.etapes.length) return [];

  const liste = doc.etapes.map((_, i) => Boolean(doc.etapesFaites[i]));
  liste[index] = !liste[index];
  await db.update(documents).set({ etapesFaites: liste }).where(eq(documents.id, doc.id));
  revalidatePath('/', 'layout');
  return liste;
}

/** Active ou coupe les rappels d'un document ; renvoie le nouvel état. */
export async function basculerRappels(slug: string): Promise<boolean> {
  const id = await idUtilisateur();
  const doc = await documentDe(id, slug);
  if (!doc) return false;

  await db.update(documents).set({ rappels: !doc.rappels }).where(eq(documents.id, doc.id));
  revalidatePath('/', 'layout');
  return !doc.rappels;
}

export async function supprimerDocument(slug: string) {
  const id = await idUtilisateur();
  await db.delete(documents).where(and(eq(documents.utilisateurId, id), eq(documents.slug, slug)));
  revalidatePath('/', 'layout');
}

/** Analyse simulée : le courrier d'exemple France Travail est (re)placé dans le compte. */
export async function analyserDocument(): Promise<string> {
  const slug = 'france-travail-actualisation';
  await ajouterDocumentDemo(await idUtilisateur(), slug);
  revalidatePath('/', 'layout');
  return slug;
}

export async function toutMarquerLu() {
  const id = await idUtilisateur();
  await db.update(notifications).set({ lue: true }).where(eq(notifications.utilisateurId, id));
  revalidatePath('/', 'layout');
}
