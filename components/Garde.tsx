'use client';

/* Protège les écrans réservés aux personnes connectées.
   Tant que l'état local n'est pas lu, rien n'est affiché (pas de clignotement). */

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEtat } from '@/lib/store';

export function Garde({ children }: { children: ReactNode }) {
  const etat = useEtat();
  const router = useRouter();
  const connecte = Boolean(etat?.compte);

  useEffect(() => {
    if (etat && !etat.compte) router.replace('/connexion');
  }, [etat, router]);

  return connecte ? children : null;
}

/** Sur la page d'accueil publique : une personne connectée est envoyée vers l'application. */
export function RedirectionSiConnecte() {
  const etat = useEtat();
  const router = useRouter();

  useEffect(() => {
    if (etat?.compte) router.replace(etat.onboardingVu ? '/tableau-de-bord' : '/onboarding');
  }, [etat, router]);

  return null;
}
