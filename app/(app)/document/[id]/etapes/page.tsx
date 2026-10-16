import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Etapes } from '@/components/vues/Etapes';
import { DOCUMENTS, documentParId } from '@/lib/data';

export const metadata: Metadata = { title: 'Étapes de la démarche' };

export function generateStaticParams() {
  return DOCUMENTS.filter((d) => d.etapes.length).map((d) => ({ id: d.id }));
}

export default async function Page({ params }: PageProps<'/document/[id]/etapes'>) {
  const doc = documentParId((await params).id);
  if (!doc || !doc.etapes.length) notFound();
  return <Etapes doc={doc} />;
}
