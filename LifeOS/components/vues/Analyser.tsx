'use client';

import { useRouter } from 'next/navigation';
import { useState, type DragEvent } from 'react';
import { Icone, type NomIcone } from '@/components/Icone';
import { EnteteEcran, Separateur } from '@/components/ui';

const FORMATS: [NomIcone, string][] = [['image', 'Photo'], ['fichier', 'PDF'], ['scan', 'Scan']];

export function Analyser() {
  const router = useRouter();
  const [survol, setSurvol] = useState(false);
  const lancerAnalyse = () => router.push('/analyse');

  function glisser(ev: DragEvent, dessus: boolean) {
    ev.preventDefault();
    setSurvol(dessus);
  }

  return (
    <>
      <EnteteEcran titre="Analyser un document" retour="/tableau-de-bord" />
      <div className="pile">
        <p style={{ fontSize: '1.15rem', fontWeight: 700 }}>Vous avez reçu un document que vous ne comprenez pas ?</p>
        <p style={{ color: 'var(--texte-3)' }}>Prenez-le en photo ou importez-le. LifeOS s&apos;occupe du reste.</p>

        <div className={`depot${survol ? ' survol' : ''}`}
          onDragEnter={(ev) => glisser(ev, true)}
          onDragOver={(ev) => glisser(ev, true)}
          onDragLeave={(ev) => glisser(ev, false)}
          onDrop={(ev) => { glisser(ev, false); lancerAnalyse(); }}>
          <Icone nom="fichier" taille={64} couleur="#6A57CC" epaisseur={1.5} />
          <p style={{ fontWeight: 700, color: 'var(--texte-2)' }}>Déposez votre fichier ici</p>
        </div>

        <label className="bouton bouton--bloc" htmlFor="prise-photo">
          <Icone nom="photo" taille={24} couleur="#fff" />Prendre une photo
          <input id="prise-photo" type="file" accept="image/*" capture="environment" className="visuellement-cache" onChange={lancerAnalyse} />
        </label>
        <label className="bouton bouton--secondaire bouton--bloc" htmlFor="import-fichier">
          <Icone nom="televerser" taille={24} couleur="#6A57CC" />Importer un document
          <input id="import-fichier" type="file" accept="image/*,application/pdf" className="visuellement-cache" onChange={lancerAnalyse} />
        </label>

        <Separateur style={{ gap: 10, marginTop: 6 }}>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--texte-4)' }}>Formats acceptés</span>
        </Separateur>
        <div className="rangee" style={{ gap: 10 }}>
          {FORMATS.map(([i, t]) => (
            <span key={t} className="carte carte--plate" style={{ flexGrow: 1, alignItems: 'center', gap: 7, padding: '14px 8px' }}>
              <Icone nom={i} taille={22} epaisseur={1.8} /><span style={{ fontSize: '.85rem', fontWeight: 700 }}>{t}</span>
            </span>
          ))}
        </div>

        <div className="carte carte--lavande" style={{ flexDirection: 'row', gap: 10, padding: '15px 16px' }}>
          <Icone nom="cadenas" taille={20} couleur="#5A48B8" />
          <p style={{ fontSize: '.88rem', color: '#4A4757' }}>Vos documents restent privés et protégés. Vous pouvez les supprimer à tout moment depuis vos paramètres.</p>
        </div>

        <p className="note-bas">Démonstration : le document analysé est un exemple fictif de courrier France Travail.</p>
      </div>
    </>
  );
}
