'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icone } from '@/components/Icone';
import { ETAPES_ANALYSE } from '@/lib/data';
import { annoncer } from '@/lib/navigateur';

const CIBLE = '/document/france-travail-actualisation';

export function Analyse() {
  const router = useRouter();
  const [remplie, setRemplie] = useState(false);

  useEffect(() => {
    /* Laisse le navigateur peindre la jauge vide avant de lancer la transition. */
    const image = requestAnimationFrame(() => setRemplie(true));
    annoncer('Analyse du document en cours.');
    const minuterie = setTimeout(() => {
      annoncer('Analyse terminée.');
      router.push(CIBLE);
    }, 5600);
    return () => {
      cancelAnimationFrame(image);
      clearTimeout(minuterie);
      setRemplie(false);
    };
  }, [router]);

  return (
    <>
      <div className="pile" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 20 }}>
        <div className="doc-anime">
          <Icone nom="fichier" taille={58} couleur="#C4B9F0" epaisseur={1.6} />
          <span className="rotation" style={{ position: 'absolute', bottom: -14, right: -14, background: 'var(--creme)', borderRadius: 99, padding: 5 }}>
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="14" stroke="#E2DBF8" strokeWidth="4" />
              <path d="M20 6a14 14 0 0 1 14 14" stroke="#6A57CC" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <h1 style={{ fontSize: '1.45rem', marginTop: 28 }}>Analyse de votre document…</h1>
        <p style={{ color: 'var(--texte-3)' }}>Cela prend quelques secondes.</p>
        <div className="jauge" style={{ width: '100%', marginTop: 14 }}>
          <span style={{ width: remplie ? '100%' : '6%', transition: remplie ? 'width 5.2s cubic-bezier(.4,0,.2,1)' : 'none' }} />
        </div>
      </div>

      <ul className="pile-s" style={{ marginTop: 26 }}>
        {ETAPES_ANALYSE.map((e, i) => (
          <li key={e} className="etape-analyse" style={{ animationDelay: `${0.2 + i}s` }}>
            <Icone nom="coche" taille={20} couleur="#2F7D57" epaisseur={2.4} />{e}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 26 }}>
        <Link className="bouton bouton--bloc" href={CIBLE}>Voir le résultat <Icone nom="suivant" taille={20} couleur="#fff" /></Link>
      </div>
    </>
  );
}
