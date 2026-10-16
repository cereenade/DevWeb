import type { Metadata } from 'next';
import { Documents } from '@/components/vues/Documents';
import { mesDocuments } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Mes documents' };

export default async function Page() {
  return <Documents documents={await mesDocuments()} />;
}
