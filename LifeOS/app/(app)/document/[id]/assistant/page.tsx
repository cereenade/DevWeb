import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Assistant } from '@/components/vues/Assistant';
import { monDocument } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Assistant' };

export default async function Page({ params }: PageProps<'/document/[id]/assistant'>) {
  const doc = await monDocument((await params).id);
  if (!doc) notFound();
  return <Assistant doc={doc} />;
}
