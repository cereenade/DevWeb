import type { Metadata } from 'next';
import { TableauDeBord } from '@/components/vues/TableauDeBord';

export const metadata: Metadata = { title: 'Tableau de bord' };

export default function Page() {
  return <TableauDeBord />;
}
