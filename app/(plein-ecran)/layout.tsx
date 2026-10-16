/* Écrans réservés aux personnes connectées, affichés sans barre d'onglets. */

import { Suspense } from 'react';
import { Chargement, PreferencesUtilisateur } from '@/components/serveur';

export default function LayoutPleinEcran({ children }: { children: React.ReactNode }) {
  return (
    <main id="contenu" className="ecran" tabIndex={-1}>
      <Suspense fallback={<Chargement />}>{children}</Suspense>
      <Suspense>
        <PreferencesUtilisateur />
      </Suspense>
    </main>
  );
}
