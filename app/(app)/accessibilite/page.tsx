import type { Metadata } from 'next';
import { Accessibilite } from '@/components/vues/Accessibilite';
import { utilisateurCourant } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Accessibilité' };

export default async function Page() {
  const { lectureFacile, tailleTexte } = await utilisateurCourant();
  return <Accessibilite lectureFacile={lectureFacile} tailleTexte={tailleTexte} />;
}
