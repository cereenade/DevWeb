'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icone, type NomIcone } from './Icone';

const ONGLETS: { chemin: string; nom: string; icone: NomIcone }[] = [
  { chemin: '/tableau-de-bord', nom: 'Accueil', icone: 'accueil' },
  { chemin: '/analyser', nom: 'Analyser', icone: 'analyser' },
  { chemin: '/demarches', nom: 'Démarches', icone: 'demarches' },
  { chemin: '/documents', nom: 'Documents', icone: 'documents' }
];

export function BarreOnglets() {
  const chemin = usePathname();

  return (
    <nav className="barre-onglets" aria-label="Navigation principale">
      {ONGLETS.map((o) => {
        const actif = chemin === o.chemin || (o.chemin === '/documents' && chemin.startsWith('/document/'));
        return (
          <Link key={o.chemin} href={o.chemin} aria-current={actif ? 'page' : undefined}>
            <Icone nom={o.icone} taille={22} />
            {o.nom}
          </Link>
        );
      })}
    </nav>
  );
}
