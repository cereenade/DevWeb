import type { Metadata } from 'next';
import { Installer } from '@/components/vues/Installer';
import { idUtilisateur } from '@/serveur/donnees';

export const metadata: Metadata = { title: { absolute: 'Installer LifeOS' } };

export default async function Page() {
  await idUtilisateur(); // redirige vers /connexion si personne n'est connecté
  return <Installer />;
}
