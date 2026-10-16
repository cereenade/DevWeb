import type { Metadata } from 'next';
import { Parametres } from '@/components/vues/Parametres';
import { utilisateurCourant } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Paramètres' };

export default async function Page() {
  return <Parametres utilisateur={await utilisateurCourant()} />;
}
