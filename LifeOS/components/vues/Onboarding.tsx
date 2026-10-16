'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Icone, Logo, type NomIcone } from '@/components/Icone';
import { terminerOnboarding } from '@/serveur/actions/preferences';

const PAGES: { titre: string; texte: string; icone: NomIcone; fond: string; couleur: string }[] = [
  { titre: 'Photographiez vos documents', texte: 'LifeOS vous explique ce qu’ils signifient et ce que vous devez faire.', icone: 'photo', fond: 'var(--lavande-clair)', couleur: '#4737A0' },
  { titre: 'Ne ratez plus une échéance', texte: 'LifeOS détecte les dates importantes et vous rappelle vos démarches.', icone: 'calendrier', fond: 'var(--vert-clair)', couleur: '#1E5E3E' },
  { titre: 'Comprenez dans votre langue', texte: 'LifeOS peut expliquer les documents administratifs dans la langue que vous comprenez le mieux.', icone: 'globe', fond: 'var(--bleu-clair)', couleur: '#33509E' }
];

export function Onboarding() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [, demarrer] = useTransition();
  const page = PAGES[index];
  const derniere = index === PAGES.length - 1;

  function terminer() {
    demarrer(async () => {
      await terminerOnboarding();
      router.push('/tableau-de-bord');
    });
  }

  return (
    <div className="pile" style={{ minHeight: '70vh' }}>
      <div className="rangee-entre">
        <span className="marque"><Logo taille={28} /><span style={{ fontSize: '1.05rem' }}>LifeOS</span></span>
        <button type="button" className="lien-texte" style={{ background: 'none', border: 'none', color: 'var(--texte-3)', padding: 10 }} onClick={terminer}>Passer</button>
      </div>

      {/* La clé relance l'animation d'apparition à chaque page. */}
      <div key={index} className="pile apparition" style={{ alignItems: 'center', textAlign: 'center', gap: 22, marginTop: 26 }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 200, height: 200, borderRadius: 48, background: page.fond }}>
          <Icone nom={page.icone} taille={84} couleur={page.couleur} epaisseur={1.5} />
        </span>
        <h1 style={{ fontSize: '1.8rem' }}>{page.titre}</h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--texte-2)', maxWidth: 320 }}>{page.texte}</p>
      </div>

      <div className="pousse" />

      <div className="rangee" style={{ justifyContent: 'center', gap: 8 }} role="img" aria-label={`Étape ${index + 1} sur ${PAGES.length}`}>
        {PAGES.map((p, i) => (
          <span key={p.titre} style={{ display: 'block', height: 8, borderRadius: 99, width: i === index ? 26 : 8, background: i === index ? 'var(--lavande)' : '#D8D3EC' }} />
        ))}
      </div>

      {derniere
        ? <button type="button" className="bouton bouton--bloc" onClick={terminer}>Commencer</button>
        : <button type="button" className="bouton bouton--bloc" onClick={() => setIndex(index + 1)}>Suivant <Icone nom="suivant" taille={20} couleur="#fff" /></button>}
    </div>
  );
}
