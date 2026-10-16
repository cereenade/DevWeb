import type { Metadata } from 'next';
import { TableauDeBord } from '@/components/vues/TableauDeBord';
import { mesDocuments, nombreNotificationsNonLues, utilisateurCourant } from '@/serveur/donnees';

export const metadata: Metadata = { title: 'Tableau de bord' };

export default async function Page() {
  const [utilisateur, documents, nonLues] = await Promise.all([
    utilisateurCourant(), mesDocuments(), nombreNotificationsNonLues()
  ]);
  return <TableauDeBord utilisateur={utilisateur} documents={documents} nonLues={nonLues} />;
}
