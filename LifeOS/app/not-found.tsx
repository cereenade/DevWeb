import type { Metadata } from 'next';
import { Introuvable } from '@/components/vues/Introuvable';

export const metadata: Metadata = { title: 'Page introuvable' };

/* Adresse inconnue : affichée hors de tout groupe, donc avec sa propre zone principale. */
export default function PageIntrouvable() {
  return (
    <main id="contenu" className="ecran" tabIndex={-1}>
      <Introuvable />
    </main>
  );
}
