import type { Metadata } from 'next';
import { Analyse } from '@/components/vues/Analyse';
import { idUtilisateur } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Analyse en cours' };

export default async function Page() {
  await idUtilisateur(); // redirige vers /connexion si personne n'est connecté
  return <Analyse />;
}
