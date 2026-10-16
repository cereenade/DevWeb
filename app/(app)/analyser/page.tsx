import type { Metadata } from 'next';
import { Analyser } from '@/components/vues/Analyser';

export const metadata: Metadata = { title: 'Analyser un document' };

export default function Page() {
  return <Analyser />;
}
