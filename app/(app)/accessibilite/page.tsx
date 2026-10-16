import type { Metadata } from 'next';
import { Accessibilite } from '@/components/vues/Accessibilite';

export const metadata: Metadata = { title: 'Accessibilité' };

export default function Page() {
  return <Accessibilite />;
}
