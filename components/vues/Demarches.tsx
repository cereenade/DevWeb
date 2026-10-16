'use client';

import { useState } from 'react';
import { Icone } from '@/components/Icone';
import { CarteDocument } from '@/components/ui';
import { DOCUMENTS } from '@/lib/data';
import { demarcheTerminee, progression, useEtatCharge } from '@/lib/store';

type Onglet = 'afaire' | 'encours' | 'terminees';

const ONGLETS: [Onglet, string][] = [['afaire', 'À faire'], ['encours', 'En cours'], ['terminees', 'Terminées']];

const VIDES: Record<Onglet, string> = {
  afaire: 'Vous n’avez aucune démarche en attente. Analysez un document pour en ajouter une.',
  encours: 'Aucune démarche commencée pour le moment.',
  terminees: 'Vos démarches terminées apparaîtront ici.'
};

export function Demarches() {
  const etat = useEtatCharge();
  const [onglet, setOnglet] = useState<Onglet>('afaire');

  const avecEtapes = DOCUMENTS.filter((d) => d.etapes.length || d.echeance);
  const listes: Record<Onglet, typeof DOCUMENTS> = {
    afaire: avecEtapes.filter((d) => !demarcheTerminee(etat, d) && progression(etat, d) === 0),
    encours: avecEtapes.filter((d) => !demarcheTerminee(etat, d) && progression(etat, d) > 0),
    terminees: DOCUMENTS.filter((d) => demarcheTerminee(etat, d))
  };
  const liste = listes[onglet];

  return (
    <>
      <h1 style={{ fontSize: '1.6rem', marginBottom: 16 }}>Mes démarches</h1>
      <div className="segments" role="tablist" aria-label="Filtrer les démarches" style={{ marginBottom: 16 }}>
        {ONGLETS.map(([cle, nom]) => (
          <button key={cle} type="button" role="tab" aria-selected={onglet === cle} onClick={() => setOnglet(cle)}>{nom}</button>
        ))}
      </div>
      <div className="pile-s">
        {liste.length
          ? liste.map((d) => <CarteDocument key={d.id} doc={d} part={progression(etat, d)} />)
          : (
            <div className="carte" style={{ alignItems: 'center', textAlign: 'center', padding: 30, borderStyle: 'dashed' }}>
              <Icone nom="fichier" taille={36} couleur="#C9C3B8" epaisseur={1.8} />
              <p style={{ fontWeight: 700 }}>Aucune démarche ici</p>
              <p className="carte-detail">{VIDES[onglet]}</p>
            </div>
          )}
      </div>
    </>
  );
}
