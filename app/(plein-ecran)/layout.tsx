/* Écrans réservés aux personnes connectées, affichés sans barre d'onglets. */

import { Garde } from '@/components/Garde';

export default function LayoutPleinEcran({ children }: { children: React.ReactNode }) {
  return (
    <main id="contenu" className="ecran" tabIndex={-1}>
      <Garde>{children}</Garde>
    </main>
  );
}
