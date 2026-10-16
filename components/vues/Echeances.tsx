'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { BadgeStatut, EnteteEcran } from '@/components/ui';
import { DOCUMENTS, STATUTS, type DocumentAdmin } from '@/lib/data';
import { dateCourte, jourEtMois } from '@/lib/format';
import { demarcheTerminee, useEtatCharge, type Etat } from '@/lib/store';

export function Echeances() {
  const etat = useEtatCharge();
  const [vue, setVue] = useState<'liste' | 'calendrier'>('liste');
  const avecDate = DOCUMENTS.filter((d) => d.echeance).sort((a, b) => a.echeance!.localeCompare(b.echeance!));

  const parMois: Record<string, DocumentAdmin[]> = {};
  avecDate.forEach((d) => {
    const { nomMois } = jourEtMois(d.echeance!);
    const cle = `${nomMois} ${d.echeance!.slice(0, 4)}`;
    (parMois[cle] = parMois[cle] || []).push(d);
  });

  return (
    <>
      <EnteteEcran titre="Mes échéances" retour="/tableau-de-bord" />
      <div className="segments" role="tablist" aria-label="Choisir l'affichage" style={{ marginBottom: 18 }}>
        <button type="button" role="tab" aria-selected={vue === 'liste'} onClick={() => setVue('liste')}>Vue liste</button>
        <button type="button" role="tab" aria-selected={vue === 'calendrier'} onClick={() => setVue('calendrier')}>Vue calendrier</button>
      </div>

      {vue === 'liste' ? (
        <div className="pile-l">
          {Object.keys(parMois).map((mois) => (
            <div key={mois} className="pile-s">
              <h2 className="titre-section">{mois}</h2>
              {parMois[mois].map((d) => {
                const cle = demarcheTerminee(etat, d) ? 'termine' : d.statut;
                const s = STATUTS[cle];
                const { jour, mois: court } = jourEtMois(d.echeance!);
                return (
                  <Link key={d.id} className="carte" href={`/document/${d.id}`} style={{ flexDirection: 'row', gap: 14 }}>
                    <span className="vignette vignette--haute" style={{ flexDirection: 'column', background: s.fond, color: s.texte }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{jour}</span>
                      <span style={{ fontSize: '.66rem', fontWeight: 800, letterSpacing: '.04em' }}>{court}</span>
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'center' }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--texte-3)' }}>{d.organisme}</span>
                      <span className="carte-titre" style={{ fontSize: '1.05rem' }}>{d.demarche}</span>
                      <BadgeStatut cle={cle} />
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <Calendrier documents={avecDate} etat={etat} />
      )}
    </>
  );
}

const CASE: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 12, fontSize: '.9rem', fontWeight: 600 };

function Calendrier({ documents, etat }: { documents: DocumentAdmin[]; etat: Etat }) {
  const aujourdhui = new Date();
  const annee = aujourdhui.getFullYear();
  const mois = aujourdhui.getMonth();
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7; // semaine commençant lundi
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const nomMois = premier.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const reperes: Record<number, DocumentAdmin> = {};
  documents.forEach((d) => {
    const date = new Date(d.echeance + 'T00:00:00');
    if (date.getFullYear() === annee && date.getMonth() === mois) reperes[date.getDate()] = d;
  });

  const couleurDe = (d: DocumentAdmin) => STATUTS[demarcheTerminee(etat, d) ? 'termine' : d.statut].couleur;

  const cases = [];
  for (let i = 0; i < decalage; i++) cases.push(<span key={`vide-${i}`} />);
  for (let j = 1; j <= nbJours; j++) {
    const doc = reperes[j];
    if (doc) {
      cases.push(
        <Link key={j} href={`/document/${doc.id}`} aria-label={`${dateCourte(doc.echeance)} : ${doc.demarche}`}
          style={{ ...CASE, width: '100%', fontWeight: 800, background: couleurDe(doc), color: '#fff' }}>{j}</Link>
      );
    } else {
      const estAujourdhui = j === aujourdhui.getDate();
      const style = estAujourdhui
        ? { ...CASE, background: 'var(--lavande-clair)', color: 'var(--lavande-fonce)', fontWeight: 800, border: '1.5px solid var(--lavande)' }
        : CASE;
      cases.push(<span key={j} style={style}>{j}</span>);
    }
  }

  return (
    <div className="carte">
      <div className="rangee-entre">
        <h2 style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{nomMois}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,minmax(0,1fr))', gap: 6 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((j, i) => (
          <span key={i} style={{ textAlign: 'center', fontSize: '.76rem', fontWeight: 800, color: '#8B8896' }}>{j}</span>
        ))}
        {cases}
      </div>
      <div className="pile-s" style={{ paddingTop: 6 }}>
        {documents.map((d) => (
          <span key={d.id} className="rangee" style={{ gap: 9, fontSize: '.86rem', color: 'var(--texte-2)' }}>
            <span style={{ display: 'block', width: 10, height: 10, borderRadius: 99, background: couleurDe(d) }} />
            {dateCourte(d.echeance)} — {d.organisme} : {d.demarche}
          </span>
        ))}
      </div>
    </div>
  );
}
