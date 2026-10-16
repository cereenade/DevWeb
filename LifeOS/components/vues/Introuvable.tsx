import Link from 'next/link';
import { Icone } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';

export function Introuvable() {
  return (
    <>
      <EnteteEcran titre="Page introuvable" retour="/tableau-de-bord" />
      <div className="carte" style={{ alignItems: 'center', textAlign: 'center', padding: 30 }}>
        <Icone nom="fichier" taille={40} couleur="#C9C3B8" epaisseur={1.8} />
        <p style={{ fontWeight: 700 }}>Cette page n&apos;existe pas.</p>
        <Link className="bouton bouton--bloc" href="/tableau-de-bord">Revenir à l&apos;accueil</Link>
      </div>
    </>
  );
}
