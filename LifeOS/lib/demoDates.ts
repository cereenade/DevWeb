/* Contenu de démonstration daté par rapport à un jour donné (la création du compte, en général).
   Les dates de lib/demo.ts sont décalées du même nombre de jours, et les {date} des textes
   sont écrites dans la langue de chaque texte. */

import type { ModeleDocument, ModeleNotification } from './data';
import { DOCUMENTS_DEMO, JOUR_REFERENCE_DEMO, NOTIFICATIONS_DEMO } from './demo';
import { dateCourte, dateLongue } from './format';

const UN_JOUR = 86400000;

/* Langue d'un texte → format de date. L'arabe garde les chiffres latins, comme dans le texte d'origine. */
const LOCALES: Record<string, string> = {
  en: 'en-GB', es: 'es-ES', tr: 'tr-TR', ar: 'ar-u-nu-latn', pt: 'pt-PT', it: 'it-IT', de: 'de-DE', zh: 'zh-CN'
};

function versIso(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

function depuisIso(iso: string): Date {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(a, m - 1, j);
}

function decaler(iso: string, jours: number): string {
  const d = depuisIso(iso);
  d.setDate(d.getDate() + jours);
  return versIso(d);
}

function dateDansLaLangue(iso: string, langue: string): string {
  if (langue === 'fr') return dateLongue(iso);
  return new Intl.DateTimeFormat(LOCALES[langue] ?? langue, { day: 'numeric', month: 'long', year: 'numeric' })
    .format(depuisIso(iso));
}

function moisEtAnnee(iso: string): string {
  const texte = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(depuisIso(iso));
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

function remplir(texte: string, echeance: string | null, langue = 'fr'): string {
  if (!echeance) return texte;
  return texte
    .replaceAll('{date}', dateDansLaLangue(echeance, langue))
    .replaceAll('{dateCourte}', dateCourte(echeance))
    .replaceAll('{mois}', moisEtAnnee(echeance));
}

/** Nombre de jours entre le jour de référence des exemples et `jour`. */
function decalageJusqua(jour: Date): number {
  const debut = new Date(jour.getFullYear(), jour.getMonth(), jour.getDate());
  return Math.round((debut.getTime() - depuisIso(JOUR_REFERENCE_DEMO).getTime()) / UN_JOUR);
}

/** Un document d'exemple, daté comme s'il avait été reçu juste avant `jour`. */
export function documentDemoDate(modele: ModeleDocument, jour = new Date()): ModeleDocument {
  const decalage = decalageJusqua(jour);
  const echeance = modele.echeance ? decaler(modele.echeance, decalage) : null;
  const texte = (t: string, langue?: string) => remplir(t, echeance, langue);
  return {
    ...modele,
    recuLe: decaler(modele.recuLe, decalage),
    echeance,
    objet: texte(modele.objet),
    enClair: Object.fromEntries(Object.entries(modele.enClair).map(([langue, t]) => [langue, texte(t, langue)])),
    enClairFacile: texte(modele.enClairFacile),
    extraitExplique: texte(modele.extraitExplique),
    questions: modele.questions.map((q) => ({ q: q.q, r: texte(q.r) }))
  };
}

export function documentsDemoDates(jour = new Date()): ModeleDocument[] {
  return DOCUMENTS_DEMO.map((m) => documentDemoDate(m, jour));
}

export function notificationsDemoDatees(jour = new Date()): ModeleNotification[] {
  const documents = documentsDemoDates(jour);
  return NOTIFICATIONS_DEMO.map((n) => {
    const lie = documents.find((d) => d.slug === n.document);
    return { ...n, texte: remplir(n.texte, lie?.echeance ?? null) };
  });
}
