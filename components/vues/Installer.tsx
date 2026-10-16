'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { Icone, Logo } from '@/components/Icone';
import { EnteteEcran } from '@/components/ui';
import { dejaInstallee, lancerInstallation } from '@/lib/navigateur';

async function installer() {
  if (!(await lancerInstallation())) {
    alert("Pour installer LifeOS : ouvrez le menu de votre navigateur, puis choisissez « Ajouter à l'écran d'accueil ».");
  }
}

export function Installer() {
  const deja = useSyncExternalStore(() => () => {}, dejaInstallee, () => false);

  return (
    <>
      <EnteteEcran titre="Installer LifeOS" retour="/parametres" />
      <div className="pile">
        {deja ? (
          <div className="carte" style={{ background: 'var(--vert-clair)', border: 'none', alignItems: 'center', textAlign: 'center', padding: 26 }}>
            <Icone nom="coche" taille={38} couleur="#2F7D57" epaisseur={2.6} />
            <h2 style={{ fontSize: '1.3rem', color: '#1B5138' }}>LifeOS est déjà installée</h2>
            <p style={{ color: '#2C4F3E' }}>Vous utilisez LifeOS depuis votre écran d&apos;accueil.</p>
          </div>
        ) : (
          <div className="carte carte--lavande surgit" style={{ alignItems: 'center', textAlign: 'center', padding: 26 }}>
            <Logo taille={78} />
            <h2 style={{ fontSize: '1.35rem', color: '#2F2B45' }}>LifeOS sur votre écran d&apos;accueil</h2>
            <p style={{ color: '#3F3372' }}>Installez LifeOS comme une application : un appui suffit pour photographier un courrier, sans passer par votre navigateur.</p>
            <button type="button" className="bouton bouton--bloc" onClick={installer}><Icone nom="telecharger" taille={20} couleur="#fff" />Installer maintenant</button>
          </div>
        )}

        <h2 className="titre-section">Si l&apos;installation ne se lance pas</h2>
        <ol className="pile-s">
          {['Ouvrez le menu de votre navigateur.',
            'Choisissez « Ajouter à l’écran d’accueil ».',
            'Confirmez : l’icône LifeOS apparaît avec vos applications.'].map((t, i) => (
            <li key={t} className="carte carte--plate" style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
              <span className="etape-case" style={{ background: 'var(--lavande-clair)', borderColor: 'transparent', color: 'var(--lavande-fonce)' }}>{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>

        <div className="carte">
          <h2 style={{ fontSize: '1.05rem' }}>Une fois installée</h2>
          {['L’appareil photo s’ouvre directement depuis l’icône.',
            'Les rappels d’échéance arrivent sur votre téléphone.',
            'Vos explications déjà lues restent consultables hors connexion.'].map((t) => (
            <span key={t} className="rangee" style={{ alignItems: 'flex-start', gap: 11, color: 'var(--texte-2)' }}>
              <Icone nom="coche" taille={19} couleur="#2F7D57" epaisseur={2.4} />{t}
            </span>
          ))}
        </div>

        <div className="carte" style={{ background: 'var(--orange-clair)', border: 'none', flexDirection: 'row', gap: 11 }}>
          <Icone nom="reseau" taille={21} couleur="#8A5310" />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <strong style={{ color: '#6F4310' }}>Sans connexion</strong>
            <span style={{ color: '#6F4310', fontSize: '.92rem' }}>Vous pouvez relire vos démarches et vos explications. L&apos;analyse d&apos;un nouveau document reprendra dès le retour du réseau.</span>
          </span>
        </div>

        <Link className="bouton bouton--secondaire bouton--bloc" href="/tableau-de-bord">Plus tard</Link>
      </div>
    </>
  );
}
