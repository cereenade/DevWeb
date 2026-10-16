import type { Metadata } from 'next';
import { Demarches } from '@/components/vues/Demarches';

export const metadata: Metadata = { title: 'Mes démarches' };

export default function Page() {
  return <Demarches />;
}
