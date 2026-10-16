import type { Metadata } from 'next';
import { Demarches } from '@/components/vues/Demarches';
import { mesDocuments } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Mes démarches' };

export default async function Page() {
  return <Demarches documents={await mesDocuments()} />;
}
