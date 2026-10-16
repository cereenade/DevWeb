import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Assistant } from '@/components/vues/Assistant';
import { DOCUMENTS, documentParId } from '@/lib/data';

export const metadata: Metadata = { title: 'Assistant' };

export function generateStaticParams() {
  return DOCUMENTS.map((d) => ({ id: d.id }));
}

export default async function Page({ params }: PageProps<'/document/[id]/assistant'>) {
  const doc = documentParId((await params).id);
  if (!doc) notFound();
  return <Assistant doc={doc} />;
}
