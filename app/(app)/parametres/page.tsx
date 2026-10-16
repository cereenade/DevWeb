import type { Metadata } from 'next';
import { Parametres } from '@/components/vues/Parametres';

export const metadata: Metadata = { title: 'Paramètres' };

export default function Page() {
  return <Parametres />;
}
