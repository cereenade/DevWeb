import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Etapes } from '@/components/vues/Etapes';
import { monDocument } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Étapes de la démarche' };

export default async function Page({ params }: PageProps<'/document/[id]/etapes'>) {
  const doc = await monDocument((await params).id);
  if (!doc || !doc.etapes.length) notFound();
  return <Etapes doc={doc} />;
}
