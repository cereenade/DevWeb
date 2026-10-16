import type { Metadata } from 'next';
import { Installer } from '@/components/vues/Installer';

export const metadata: Metadata = { title: { absolute: 'Installer LifeOS' } };

export default function Page() {
  return <Installer />;
}
