'use client';

/* Applique le mode lecture facile et la taille du texte de la personne connectée. */

import { useEffect } from 'react';

export function AppliquerPreferences({ lectureFacile, tailleTexte }: { lectureFacile: boolean; tailleTexte: number }) {
  useEffect(() => {
    document.body.classList.toggle('lecture-facile', lectureFacile);
    document.documentElement.style.setProperty('--echelle', String(tailleTexte || 1));
    return () => {
      document.body.classList.remove('lecture-facile');
      document.documentElement.style.removeProperty('--echelle');
    };
  }, [lectureFacile, tailleTexte]);

  return null;
}
