import type { Metadata } from 'next';
import { Onboarding } from '@/components/vues/Onboarding';

export const metadata: Metadata = { title: 'Bienvenue' };

export default function Page() {
  return <Onboarding />;
}
