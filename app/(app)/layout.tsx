/* Écrans de l'application, réservés aux personnes connectées, avec la barre d'onglets. */

import { Suspense } from 'react';
import { Garde } from '@/components/Garde';
import { BarreOnglets } from '@/components/BarreOnglets';

export default function LayoutApplication({ children }: { children: React.ReactNode }) {
  return (
    <Garde>
      <div className="avec-onglets">
        <main id="contenu" className="ecran" tabIndex={-1}>{children}</main>
        <Suspense>
          <BarreOnglets />
        </Suspense>
      </div>
    </Garde>
  );
}
