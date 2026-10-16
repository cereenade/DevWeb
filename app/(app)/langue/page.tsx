import type { Metadata } from 'next';
import { Langue } from '@/components/vues/Langue';

export const metadata: Metadata = { title: 'Langue' };

export default function Page() {
  return <Langue />;
}
