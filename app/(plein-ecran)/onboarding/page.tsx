import type { Metadata } from 'next';
import { Onboarding } from '@/components/vues/Onboarding';
import { idUtilisateur } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Bienvenue' };

export default async function Page() {
  await idUtilisateur(); // redirige vers /connexion si personne n'est connecté
  return <Onboarding />;
}
