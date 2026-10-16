'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icone } from '@/components/Icone';
import { BadgeStatut } from '@/components/ui';
import { CATEGORIES, type DocumentAdmin } from '@/lib/data';
import { dateCourte, dateLongue } from '@/lib/format';
import { demarcheTerminee } from '@/lib/demarches';

export function Documents({ documents }: { documents: DocumentAdmin[] }) {
  const [categorie, setCategorie] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  const terme = recherche.toLowerCase();
  let liste = categorie === 'Tous' ? documents : documents.filter((d) => d.categorie === categorie);
  if (terme) {
    liste = liste.filter((d) => (d.organisme + ' ' + d.objet + ' ' + d.demarche).toLowerCase().includes(terme));
  }

  return (
    <>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 14 }}>Mes documents</h1>

      <div className="rangee" style={{ gap: 10, padding: '0 16px', background: '#fff', border: '1.5px solid var(--bordure-forte)', borderRadius: 16, marginBottom: 14 }}>
        <Icone nom="recherche" taille={20} couleur="#6E6C7A" />
        <label className="visuellement-cache" htmlFor="recherche">Rechercher un document</label>
        <input id="recherche" type="search" placeholder="Rechercher un document…" value={recherche}
          onChange={(ev) => setRecherche(ev.target.value)} style={{ border: 'none', background: 'transparent' }} autoComplete="off" />
      </div>

      <div className="puces" style={{ marginBottom: 14 }}>
        {CATEGORIES.map((c) => (
          <button key={c} type="button" className="puce" aria-pressed={c === categorie} onClick={() => setCategorie(c)}>{c}</button>
        ))}
      </div>

      <ul className="pile-s">
        {liste.length ? liste.map((d) => {
          const cle = demarcheTerminee(d) ? 'termine' : d.statut;
          return (
            <li key={d.slug}>
              <Link className="carte" href={`/document/${d.slug}`} style={{ flexDirection: 'row', gap: 14 }}>
                <span className="vignette vignette--haute" style={{ background: d.teinte.fond, color: d.teinte.texte }}>{d.initiales}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 6, flexGrow: 1 }}>
                  <span className="carte-titre" style={{ fontSize: '1.05rem' }}>{d.organisme}</span>
                  <span style={{ fontSize: '.92rem', color: 'var(--texte-2)' }}>{d.objet}</span>
                  <span style={{ fontSize: '.8rem', color: 'var(--texte-4)' }}>Reçu le {dateLongue(d.recuLe)}</span>
                  <span className="rangee" style={{ flexWrap: 'wrap', gap: 7 }}>
                    <BadgeStatut cle={cle} />
                    {d.echeance && <span className="statut statut--archive"><Icone nom="calendrier" taille={13} epaisseur={2.2} />Avant le {dateCourte(d.echeance)}</span>}
                  </span>
                </span>
              </Link>
            </li>
          );
        }) : (
          <li className="carte" style={{ alignItems: 'center', textAlign: 'center', padding: 30, borderStyle: 'dashed' }}>
            <p style={{ fontWeight: 700 }}>Aucun document</p>
            <p className="carte-detail">Aucun document ne correspond à cette recherche.</p>
          </li>
        )}
      </ul>
    </>
  );
}
