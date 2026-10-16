import type { Metadata } from 'next';
import { Echeances } from '@/components/vues/Echeances';
import { mesDocuments } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Mes échéances' };

export default async function Page() {
  return <Echeances documents={await mesDocuments()} />;
}
