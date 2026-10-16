/* Petites fonctions de mise en forme partagées par les écrans. */

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_COURT = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.',
  'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];

/** « 2026-09-28 » → « 28 septembre 2026 » */
export function dateLongue(iso: string | null): string {
  if (!iso) return '';
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
}

/** « 2026-09-28 » → « 28 septembre » */
export function dateCourte(iso: string | null): string {
  if (!iso) return '';
  const [, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]}`;
}

export function jourEtMois(iso: string) {
  const [, m, j] = iso.split('-').map(Number);
  return { jour: String(j), mois: MOIS_COURT[m - 1], nomMois: MOIS[m - 1] };
}

/** Nombre de jours entre aujourd'hui et une date ISO (peut être négatif). */
export function joursRestants(iso: string | null): number | null {
  if (!iso) return null;
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  const cible = new Date(iso + 'T00:00:00');
  return Math.round((cible.getTime() - aujourdhui.getTime()) / 86400000);
}

/** « Plus que 10 jours », « Demain », « Aujourd'hui », « En retard de 2 jours » */
export function delaiEnMots(iso: string | null): string {
  const jours = joursRestants(iso);
  if (jours === null) return '';
  if (jours < 0) return `En retard de ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? 's' : ''}`;
  if (jours === 0) return "Aujourd'hui";
  if (jours === 1) return 'Demain';
  return `Plus que ${jours} jours`;
}

/** « dans 10 jours », « demain », « aujourd'hui », « avec 2 jours de retard » */
export function delaiCourt(iso: string | null): string {
  const jours = joursRestants(iso);
  if (jours === null) return '';
  if (jours < 0) return `avec ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? 's' : ''} de retard`;
  if (jours === 0) return "aujourd'hui";
  if (jours === 1) return 'demain';
  return `dans ${jours} jours`;
}

/** Remplissage de la jauge d'échéance : pleine quand la date limite est atteinte. */
export function jaugeEcheance(iso: string | null): number {
  const jours = joursRestants(iso);
  if (jours === null) return 0;
  const part = Math.min(Math.max(1 - jours / 30, 0), 1);
  return Math.round(part * 100);
}
