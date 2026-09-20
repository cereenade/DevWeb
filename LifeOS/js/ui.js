/* Petites fonctions d'affichage partagées par les écrans. */

import { icone } from './icones.js';
import { STATUTS } from './data.js';

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MOIS_COURT = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.',
  'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];

/** Échappe le texte avant de l'insérer dans du HTML. */
export function texte(valeur) {
  return String(valeur == null ? '' : valeur)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** « 2026-09-28 » → « 28 septembre 2026 » */
export function dateLongue(iso) {
  if (!iso) return '';
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
}

/** « 2026-09-28 » → « 28 septembre » */
export function dateCourte(iso) {
  if (!iso) return '';
  const [, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]}`;
}

export function jourEtMois(iso) {
  const [, m, j] = iso.split('-').map(Number);
  return { jour: String(j), mois: MOIS_COURT[m - 1], nomMois: MOIS[m - 1] };
}

/** Nombre de jours entre aujourd'hui et une date ISO (peut être négatif). */
export function joursRestants(iso) {
  if (!iso) return null;
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);
  const cible = new Date(iso + 'T00:00:00');
  return Math.round((cible - aujourdhui) / 86400000);
}

/** « Plus que 10 jours », « Demain », « Aujourd'hui », « En retard de 2 jours » */
export function delaiEnMots(iso) {
  const jours = joursRestants(iso);
  if (jours === null) return '';
  if (jours < 0) return `En retard de ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? 's' : ''}`;
  if (jours === 0) return "Aujourd'hui";
  if (jours === 1) return 'Demain';
  return `Plus que ${jours} jours`;
}

/** Pastille de statut : couleur + icône + libellé, jamais la couleur seule. */
export function badgeStatut(cle) {
  const s = STATUTS[cle] || STATUTS.info;
  return `<span class="statut ${s.classe}">${icone(s.icone, { taille: 14, epaisseur: 2.4 })}${texte(s.libelle)}</span>`;
}

/** En-tête d'écran avec bouton retour. */
export function enteteEcran(titre, lienRetour, actions = '') {
  const retour = lienRetour
    ? `<a class="bouton-icone" href="${lienRetour}" aria-label="Revenir à l'écran précédent">${icone('retour', { taille: 20, epaisseur: 2 })}</a>`
    : '';
  return `<div class="entete-ecran">${retour}<h1>${texte(titre)}</h1>${actions}</div>`;
}

/** Carte résumant un document dans une liste. */
export function carteDocument(doc, part) {
  const s = STATUTS[doc.statut];
  const delai = doc.echeance ? delaiEnMots(doc.echeance) : '';
  return `
    <a class="carte" href="#/document/${doc.id}">
      <div class="rangee-entre">
        ${badgeStatut(doc.statut)}
        ${delai ? `<span style="font-size:.82rem;font-weight:700;color:${s.texte}">${texte(delai)}</span>` : ''}
      </div>
      <span class="carte-titre">${texte(doc.demarche)}</span>
      <span class="carte-detail">${doc.echeance ? 'À effectuer avant le ' + texte(dateLongue(doc.echeance)) : texte(doc.objet)}</span>
      ${typeof part === 'number' ? `
      <div class="rangee">
        <div class="jauge"><span style="width:${Math.max(Math.round(part * 100), 2)}%;background:${s.couleur}"></span></div>
        <span style="font-size:.82rem;font-weight:800;color:var(--texte-2)">${Math.round(part * 100)} %</span>
      </div>` : ''}
    </a>`;
}

/** « dans 10 jours », « demain », « aujourd'hui », « avec 2 jours de retard » */
export function delaiCourt(iso) {
  const jours = joursRestants(iso);
  if (jours === null) return '';
  if (jours < 0) return `avec ${Math.abs(jours)} jour${Math.abs(jours) > 1 ? 's' : ''} de retard`;
  if (jours === 0) return "aujourd'hui";
  if (jours === 1) return 'demain';
  return `dans ${jours} jours`;
}

/** Annonce un message aux lecteurs d'écran. */
export function annoncer(message) {
  const zone = document.getElementById('annonces');
  if (zone) zone.textContent = message;
}
