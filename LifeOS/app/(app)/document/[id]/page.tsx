import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Document } from '@/components/vues/Document';
import { monDocument, utilisateurCourant } from '@/serveur/donnees';

export const metadata: Metadata = { title: "Résultat de l'analyse" };

export default async function Page({ params }: PageProps<'/document/[id]'>) {
  const { id } = await params;
  const [doc, utilisateur] = await Promise.all([monDocument(id), utilisateurCourant()]);
  if (!doc) notFound();
  return <Document doc={doc} langueChoisie={utilisateur.langue} lectureFacile={utilisateur.lectureFacile} />;
}
