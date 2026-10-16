/* Petits composants d'affichage partagés par les écrans. */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icone } from './Icone';
import { STATUTS, type CleStatut, type DocumentAdmin } from '@/lib/data';
import { dateLongue, delaiEnMots } from '@/lib/format';

/** Pastille de statut : couleur + icône + libellé, jamais la couleur seule. */
export function BadgeStatut({ cle }: { cle: CleStatut }) {
  const s = STATUTS[cle] || STATUTS.info;
  return (
    <span className={`statut ${s.classe}`}>
      <Icone nom={s.icone} taille={14} epaisseur={2.4} />{s.libelle}
    </span>
  );
}

/** En-tête d'écran avec bouton retour. */
export function EnteteEcran({ titre, retour, children }: { titre: string; retour?: string; children?: ReactNode }) {
  return (
    <div className="entete-ecran">
      {retour && (
        <Link className="bouton-icone" href={retour} aria-label="Revenir à l'écran précédent">
          <Icone nom="retour" taille={20} epaisseur={2} />
        </Link>
      )}
      <h1>{titre}</h1>
      {children}
    </div>
  );
}

/** Carte résumant un document dans une liste. */
export function CarteDocument({ doc, part }: { doc: DocumentAdmin; part?: number }) {
  const s = STATUTS[doc.statut];
  const delai = doc.echeance ? delaiEnMots(doc.echeance) : '';
  return (
    <Link className="carte" href={`/document/${doc.slug}`}>
      <div className="rangee-entre">
        <BadgeStatut cle={doc.statut} />
        {delai && <span style={{ fontSize: '.82rem', fontWeight: 700, color: s.texte }}>{delai}</span>}
      </div>
      <span className="carte-titre">{doc.demarche}</span>
      <span className="carte-detail">{doc.echeance ? 'À effectuer avant le ' + dateLongue(doc.echeance) : doc.objet}</span>
      {typeof part === 'number' && (
        <div className="rangee">
          <div className="jauge"><span style={{ width: `${Math.max(Math.round(part * 100), 2)}%`, background: s.couleur }} /></div>
          <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--texte-2)' }}>{Math.round(part * 100)} %</span>
        </div>
      )}
    </Link>
  );
}

/** Ligne « séparateur — texte — séparateur ». */
export function Separateur({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rangee" style={{ gap: 12, ...style }}>
      <span style={{ flexGrow: 1, height: 1, background: 'var(--bordure-forte)' }} />
      {children}
      <span style={{ flexGrow: 1, height: 1, background: 'var(--bordure-forte)' }} />
    </div>
  );
}

/** Lien en forme de carte : icône, texte, chevron. */
export function CarteLien({ href, icone, children }: { href: string; icone: 'discussion'; children: ReactNode }) {
  return (
    <Link className="carte" href={href} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Icone nom={icone} taille={22} couleur="#5A48B8" />
      <strong style={{ flexGrow: 1 }}>{children}</strong>
      <Icone nom="chevron" taille={18} couleur="#6E6C7A" epaisseur={2.2} />
    </Link>
  );
}
