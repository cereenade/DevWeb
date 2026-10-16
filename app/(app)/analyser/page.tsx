import type { Metadata } from 'next';
import { Analyser } from '@/components/vues/Analyser';
import { idUtilisateur } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Analyser un document' };

export default async function Page() {
  await idUtilisateur(); // redirige vers /connexion si personne n'est connecté
  return <Analyser />;
}
