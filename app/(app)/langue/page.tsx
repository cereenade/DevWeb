import type { Metadata } from 'next';
import { Langue } from '@/components/vues/Langue';
import { utilisateurCourant } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Langue' };

export default async function Page() {
  const { langue } = await utilisateurCourant();
  return <Langue langue={langue} />;
}
