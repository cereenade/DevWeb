'use server';

/* Préférences de la personne connectée : lecture, langue, rappels, installation. */

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '../db';
import { utilisateurs } from '../db/schema';
import { idUtilisateur } from '../donnees';
import { LANGUES, type CleReglage } from '@/lib/data';

type Modification = Partial<typeof utilisateurs.$inferInsert>;

async function modifier(modification: Modification) {
  const id = await idUtilisateur();
  await db.update(utilisateurs).set(modification).where(eq(utilisateurs.id, id));
  revalidatePath('/', 'layout');
}

const COLONNES_REGLAGES: Record<CleReglage, 'reglageRappels' | 'reglageAnalyses' | 'reglageResume'> = {
  rappels: 'reglageRappels',
  analyses: 'reglageAnalyses',
  resume: 'reglageResume'
};

const TAILLES = [1, 1.15, 1.32];

export async function terminerOnboarding() {
  await modifier({ onboardingVu: true });
}

export async function choisirLangue(code: string) {
  if (LANGUES.some((l) => l.code === code)) await modifier({ langue: code });
}

export async function definirLectureFacile(active: boolean) {
  await modifier({ lectureFacile: active });
}

export async function choisirTailleTexte(taille: number) {
  if (TAILLES.includes(taille)) await modifier({ tailleTexte: taille });
}

export async function definirReglage(cle: CleReglage, actif: boolean) {
  const colonne = COLONNES_REGLAGES[cle];
  if (colonne) await modifier({ [colonne]: actif });
}

export async function masquerInstallation() {
  await modifier({ installMasque: true });
}
