import type { Metadata } from 'next';
import { Notifications } from '@/components/vues/Notifications';
import { mesNotifications } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Notifications' };

export default async function Page() {
  return <Notifications notifications={await mesNotifications()} />;
}
