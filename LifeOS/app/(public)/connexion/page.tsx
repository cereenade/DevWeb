import type { Metadata } from 'next';
import { Connexion } from '@/components/vues/Connexion';

export const metadata: Metadata = { title: 'Connexion' };

export default function Page() {
  return <Connexion />;
}
