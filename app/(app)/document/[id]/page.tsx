import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Document } from '@/components/vues/Document';
import { DOCUMENTS, documentParId } from '@/lib/data';

/* Titre fixe : avec Cache Components, un titre calculé à partir de l'identifiant
   bloquerait le prérendu de la page pour les identifiants inconnus au build. */
export const metadata: Metadata = { title: "Résultat de l'analyse" };

export function generateStaticParams() {
  return DOCUMENTS.map((d) => ({ id: d.id }));
}

export default async function Page({ params }: PageProps<'/document/[id]'>) {
  const doc = documentParId((await params).id);
  if (!doc) notFound();
  return <Document doc={doc} />;
}
