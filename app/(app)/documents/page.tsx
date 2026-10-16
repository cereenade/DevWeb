import type { Metadata } from 'next';
import { Documents } from '@/components/vues/Documents';

export const metadata: Metadata = { title: 'Mes documents' };

export default function Page() {
  return <Documents />;
}
