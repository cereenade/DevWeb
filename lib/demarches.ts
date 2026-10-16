/* Avancement d'une démarche, calculé à partir des étapes cochées. */

import type { DocumentAdmin } from './data';

export function demarcheTerminee(doc: DocumentAdmin): boolean {
  if (!doc.etapes.length) return doc.statut === 'termine';
  return doc.etapesFaites.every(Boolean);
}

export function progression(doc: DocumentAdmin): number {
  if (!doc.etapes.length) return doc.statut === 'termine' ? 1 : 0;
  return doc.etapesFaites.filter(Boolean).length / doc.etapes.length;
}

export function nombreEtapesFaites(doc: DocumentAdmin): number {
  return doc.etapesFaites.filter(Boolean).length;
}
