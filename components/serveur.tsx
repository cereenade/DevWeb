/* Composants serveur qui lisent la session : toujours placés sous <Suspense>. */

import { redirect } from 'next/navigation';
import { AppliquerPreferences } from './AppliquerPreferences';
import { utilisateurCourant, utilisateurOptionnel } from '@/serveur/donnees';

/** Préférences de lecture de la personne connectée (et protection de l'écran). */
export async function PreferencesUtilisateur() {
  const u = await utilisateurCourant();
  return <AppliquerPreferences lectureFacile={u.lectureFacile} tailleTexte={u.tailleTexte} />;
}

/** Sur la page d'accueil publique : une personne connectée est envoyée vers l'application. */
export async function RedirectionSiConnecte() {
  const u = await utilisateurOptionnel();
  if (u) redirect(u.onboardingVu ? '/tableau-de-bord' : '/onboarding');
  return null;
}

/** Affiché pendant le chargement des données d'un écran. */
export function Chargement() {
  return <p className="visuellement-cache" role="status">Chargement…</p>;
}
