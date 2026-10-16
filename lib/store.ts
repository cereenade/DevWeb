'use client';

/* État de l'application, conservé dans le navigateur (localStorage).
   Aucune donnée n'est envoyée ailleurs dans cette version de démonstration.
   Côté serveur, l'état vaut `null` : les écrans qui en dépendent s'affichent
   une fois l'application chargée dans le navigateur. */

import { useSyncExternalStore } from 'react';
import type { DocumentAdmin } from './data';

const CLE = 'lifeos.etat.v1';

export interface Etat {
  compte: { prenom: string; email: string } | null;
  onboardingVu: boolean;
  langue: string;              // langue des explications ; l'interface reste en français
  lectureFacile: boolean;
  tailleTexte: number;         // 1 | 1.15 | 1.32
  etapes: Record<string, boolean[]>;
  rappels: Record<string, boolean>;
  reglages: { rappels: boolean; analyses: boolean; resume: boolean };
  notificationsLues: string[];
  installMasque: boolean;
}

const PAR_DEFAUT: Etat = {
  compte: null,
  onboardingVu: false,
  langue: 'fr',
  lectureFacile: false,
  tailleTexte: 1,
  etapes: {},
  rappels: {},
  reglages: { rappels: true, analyses: true, resume: false },
  notificationsLues: [],
  installMasque: false
};

let etat: Etat | null = null;
const abonnes = new Set<() => void>();

function charger(): Etat {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return structuredClone(PAR_DEFAUT);
    return Object.assign(structuredClone(PAR_DEFAUT), JSON.parse(brut));
  } catch {
    return structuredClone(PAR_DEFAUT);
  }
}

function sauver() {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch {
    /* Navigation privée ou stockage plein : l'application continue de fonctionner. */
  }
}

function prevenir() {
  abonnes.forEach((fn) => fn());
}

export function lire(): Etat {
  if (!etat) etat = charger();
  return etat;
}

export function ecrire(modification: Partial<Etat>): Etat {
  etat = Object.assign({}, lire(), modification);
  sauver();
  prevenir();
  return etat;
}

export function reinitialiser() {
  etat = structuredClone(PAR_DEFAUT);
  try { localStorage.removeItem(CLE); } catch { /* ignoré */ }
  prevenir();
}

function abonner(fn: () => void) {
  abonnes.add(fn);
  /* Un autre onglet a modifié les données : on les relit. */
  const surStockage = (ev: StorageEvent) => {
    if (ev.key === CLE) { etat = charger(); fn(); }
  };
  window.addEventListener('storage', surStockage);
  return () => {
    abonnes.delete(fn);
    window.removeEventListener('storage', surStockage);
  };
}

/** L'état courant, ou `null` tant que l'application n'est pas chargée dans le navigateur. */
export function useEtat(): Etat | null {
  return useSyncExternalStore(abonner, lire, () => null);
}

/** Pour les écrans placés derrière <Garde> : l'état y est toujours déjà chargé. */
export function useEtatCharge(): Etat {
  return useEtat() ?? lire();
}

/* --- Étapes d'une démarche --- */

export function etapesDe(e: Etat, document_: DocumentAdmin): boolean[] {
  const enregistrees = e.etapes[document_.id] || [];
  return document_.etapes.map((_, i) => Boolean(enregistrees[i]));
}

export function basculerEtape(idDocument: string, index: number, total: number): boolean[] {
  const actuel = lire();
  const enregistrees = actuel.etapes[idDocument] || [];
  const liste: boolean[] = [];
  for (let i = 0; i < total; i++) liste.push(Boolean(enregistrees[i]));
  liste[index] = !liste[index];
  ecrire({ etapes: Object.assign({}, actuel.etapes, { [idDocument]: liste }) });
  return liste;
}

export function demarcheTerminee(e: Etat, document_: DocumentAdmin): boolean {
  if (!document_.etapes.length) return document_.statut === 'termine';
  return etapesDe(e, document_).every(Boolean);
}

export function progression(e: Etat, document_: DocumentAdmin): number {
  if (!document_.etapes.length) return document_.statut === 'termine' ? 1 : 0;
  const faites = etapesDe(e, document_).filter(Boolean).length;
  return faites / document_.etapes.length;
}

/* --- Rappels --- */

export function basculerRappels(idDocument: string): boolean {
  const suite = Object.assign({}, lire().rappels);
  suite[idDocument] = !suite[idDocument];
  ecrire({ rappels: suite });
  return suite[idDocument];
}
