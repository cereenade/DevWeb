'use client';

/* Ce qui tourne en permanence, quel que soit l'écran : préférences de lecture,
   bandeau hors connexion, invitation d'installation et service worker. */

import { useEffect, useSyncExternalStore } from 'react';
import { useEtat } from '@/lib/store';
import { ecouterInstallation } from '@/lib/navigateur';

function abonnerReseau(fn: () => void) {
  window.addEventListener('online', fn);
  window.addEventListener('offline', fn);
  return () => {
    window.removeEventListener('online', fn);
    window.removeEventListener('offline', fn);
  };
}

export function Demarrage() {
  const etat = useEtat();
  const enLigne = useSyncExternalStore(abonnerReseau, () => navigator.onLine, () => true);

  /* Mode lecture facile et taille du texte. */
  useEffect(() => {
    if (!etat) return;
    document.body.classList.toggle('lecture-facile', etat.lectureFacile);
    document.documentElement.style.setProperty('--echelle', String(etat.tailleTexte || 1));
  }, [etat]);

  useEffect(() => ecouterInstallation(), []);

  useEffect(() => {
    /* En développement, un service worker mettrait en cache des fichiers qui changent sans cesse. */
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* Le service worker exige HTTPS ou localhost : l'application marche quand même. */
    });
  }, []);

  return (
    <div className="bandeau-hors-ligne" role="status" hidden={enLigne}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4 21 20" /><path d="M5.5 10.5a11 11 0 0 1 4-2.4M15 8.4a11 11 0 0 1 3.6 2.1M8.6 14.2a6 6 0 0 1 6.8.6M12 19.4v.2" />
      </svg>
      Vous êtes hors connexion. Vos documents déjà analysés restent consultables.
    </div>
  );
}
