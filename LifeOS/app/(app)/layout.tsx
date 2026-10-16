/* Écrans de l'application, réservés aux personnes connectées, avec la barre d'onglets.
   Chaque page lit la session : elle redirige vers /connexion si personne n'est connecté. */

import { Suspense } from 'react';
import { BarreOnglets } from '@/components/BarreOnglets';
import { Chargement, PreferencesUtilisateur } from '@/components/serveur';

export default function LayoutApplication({ children }: { children: React.ReactNode }) {
  return (
    <div className="avec-onglets">
      <main id="contenu" className="ecran" tabIndex={-1}>
        <Suspense fallback={<Chargement />}>{children}</Suspense>
      </main>
      <Suspense>
        <BarreOnglets />
      </Suspense>
      <Suspense>
        <PreferencesUtilisateur />
      </Suspense>
    </div>
  );
}
