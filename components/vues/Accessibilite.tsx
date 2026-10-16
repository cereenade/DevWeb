'use client';

import Link from 'next/link';
import { Icone } from '@/components/Icone';
import { BadgeStatut, EnteteEcran } from '@/components/ui';
import { DOCUMENTS } from '@/lib/data';
import { dateLongue } from '@/lib/format';
import { ecrire, useEtatCharge } from '@/lib/store';

const TAILLES: [number, string, string][] = [[1, 'Normal', '.95rem'], [1.15, 'Grand', '1.08rem'], [1.32, 'Très grand', '1.2rem']];

export function Accessibilite() {
  const etat = useEtatCharge();
  const exemple = DOCUMENTS[0];
  const apercu = etat.lectureFacile ? exemple.enClairFacile : exemple.enClair.fr;

  return (
    <>
      <EnteteEcran titre="Lecture et accessibilité" retour="/parametres" />
      <div className="pile">
        <div className="carte" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <span className="vignette" style={{ background: 'var(--lavande-clair)', color: 'var(--lavande-fonce)' }}><Icone nom="texte" taille={22} couleur="#4737A0" /></span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1 }}>
            <strong>Mode lecture facile</strong>
            <span className="carte-detail">Texte plus grand et explications encore plus simples.</span>
          </span>
          <button type="button" className="interrupteur" role="switch" aria-checked={etat.lectureFacile}
            aria-label="Mode lecture facile" onClick={() => ecrire({ lectureFacile: !etat.lectureFacile })}><span /></button>
        </div>

        <div className="carte">
          <h2 style={{ fontSize: '1.05rem' }}>Taille du texte</h2>
          <div className="rangee" style={{ gap: 8 }}>
            {TAILLES.map(([v, nom, taille]) => (
              <button key={v} type="button" className="puce" style={{ flexGrow: 1, justifyContent: 'center', fontSize: taille }}
                aria-pressed={etat.tailleTexte === v} onClick={() => ecrire({ tailleTexte: v })}>{nom}</button>
            ))}
          </div>
        </div>

        <h2 className="titre-section">Aperçu</h2>
        <div className="carte">
          <BadgeStatut cle="action" />
          <span className="carte-titre">{exemple.organisme}</span>
          <p>{apercu}</p>
          <p style={{ fontWeight: 700, color: '#A4382D' }}>{etat.lectureFacile ? 'À faire avant le 28 septembre.' : 'Date limite : ' + dateLongue(exemple.echeance)}</p>
        </div>

        <div className="carte">
          <h2 style={{ fontSize: '1.05rem' }}>Ce que le mode change</h2>
          {['Des phrases plus courtes, une idée par phrase.',
            'Aucun mot administratif sans explication.',
            'Des textes plus grands et plus espacés.'].map((t) => (
            <span key={t} className="rangee" style={{ alignItems: 'flex-start', gap: 10, color: 'var(--texte-2)' }}>
              <Icone nom="coche" taille={18} couleur="#2F7D57" epaisseur={2.6} />{t}
            </span>
          ))}
        </div>

        <Link className="bouton bouton--bloc" href="/tableau-de-bord">Enregistrer mes réglages</Link>
      </div>
    </>
  );
}
