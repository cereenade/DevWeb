import type { Metadata } from 'next';
import { Analyse } from '@/components/vues/Analyse';

export const metadata: Metadata = { title: 'Analyse en cours' };

export default function Page() {
  return <Analyse />;
}
