import type { Metadata } from 'next';
import { Echeances } from '@/components/vues/Echeances';

export const metadata: Metadata = { title: 'Mes échéances' };

export default function Page() {
  return <Echeances />;
}
