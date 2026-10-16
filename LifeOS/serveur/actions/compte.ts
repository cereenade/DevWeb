'use server';

/* Création de compte, connexion, déconnexion et suppression des données. */

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '../db';
import { utilisateurs } from '../db/schema';
import { creerContenuDemo } from '../db/demo';
import { hacherMotDePasse, verifierMotDePasse } from '../motDePasse';
import { fermerSession, lireSession, ouvrirSession } from '../session';

export interface EtatFormulaire {
  erreur?: string;
  /* Renvoyées pour réafficher la saisie : React vide le formulaire après l'envoi. */
  valeurs?: { prenom?: string; email?: string };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function creerCompte(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const prenom = String(donnees.get('prenom') ?? '').trim();
  const email = String(donnees.get('email') ?? '').trim().toLowerCase();
  const motDePasse = String(donnees.get('motdepasse') ?? '');

  if (!prenom) return { erreur: 'Merci d’indiquer votre prénom.', valeurs: { prenom, email } };
  if (!EMAIL.test(email)) return { erreur: 'Merci d’indiquer une adresse e-mail valide.', valeurs: { prenom, email } };
  if (motDePasse.length < 8) return { erreur: 'Le mot de passe doit contenir au moins 8 caractères.', valeurs: { prenom, email } };
  if (donnees.get('conditions') !== 'on') return { erreur: 'Merci d’accepter les conditions d’utilisation.', valeurs: { prenom, email } };

  const existant = await db.query.utilisateurs.findFirst({ where: eq(utilisateurs.email, email), columns: { id: true } });
  if (existant) return { erreur: 'Un compte existe déjà avec cette adresse. Connectez-vous.', valeurs: { prenom, email } };

  const [compte] = await db.insert(utilisateurs)
    .values({ prenom, email, motDePasse: await hacherMotDePasse(motDePasse) })
    .returning({ id: utilisateurs.id });
  await creerContenuDemo(compte.id);
  await ouvrirSession(compte.id);
  revalidatePath('/', 'layout');
  redirect('/onboarding');
}

export async function seConnecter(_: EtatFormulaire, donnees: FormData): Promise<EtatFormulaire> {
  const email = String(donnees.get('email') ?? '').trim().toLowerCase();
  const motDePasse = String(donnees.get('motdepasse') ?? '');

  const compte = await db.query.utilisateurs.findFirst({ where: eq(utilisateurs.email, email) });
  if (!compte || !(await verifierMotDePasse(motDePasse, compte.motDePasse))) {
    return { erreur: 'Adresse e-mail ou mot de passe incorrect.', valeurs: { email } };
  }

  await ouvrirSession(compte.id);
  revalidatePath('/', 'layout');
  redirect(compte.onboardingVu ? '/tableau-de-bord' : '/onboarding');
}

export async function seDeconnecter() {
  await fermerSession();
  revalidatePath('/', 'layout');
  redirect('/');
}

/** Supprime le compte et tout ce qui s'y rattache (documents, notifications, sessions). */
export async function supprimerMesDonnees() {
  const id = await lireSession();
  if (id) await db.delete(utilisateurs).where(eq(utilisateurs.id, id));
  await fermerSession();
  revalidatePath('/', 'layout');
  redirect('/');
}
