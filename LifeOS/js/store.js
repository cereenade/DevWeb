/* État de l'application, conservé dans le navigateur (localStorage).
   Aucune donnée n'est envoyée ailleurs dans cette version de démonstration. */

const CLE = 'lifeos.etat.v1';

const PAR_DEFAUT = {
  compte: null,            // { prenom, email } une fois le compte créé
  onboardingVu: false,
  langue: 'fr',            // langue des explications ; l'interface reste en français
  lectureFacile: false,
  tailleTexte: 1,          // 1 | 1.15 | 1.32
  etapes: {},              // { [idDocument]: [true, false, ...] }
  rappels: {},             // { [idDocument]: true }
  reglages: { rappels: true, analyses: true, resume: false },
  notificationsLues: [],
  installMasque: false
};

let etat = charger();
const abonnes = new Set();

function charger() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return structuredClone(PAR_DEFAUT);
    return Object.assign(structuredClone(PAR_DEFAUT), JSON.parse(brut));
  } catch (e) {
    return structuredClone(PAR_DEFAUT);
  }
}

function sauver() {
  try {
    localStorage.setItem(CLE, JSON.stringify(etat));
  } catch (e) {
    /* Navigation privée ou stockage plein : l'application continue de fonctionner. */
  }
}

export function lire() {
  return etat;
}

export function ecrire(modification) {
  etat = Object.assign({}, etat, modification);
  sauver();
  abonnes.forEach((fn) => fn(etat));
  return etat;
}

export function abonner(fn) {
  abonnes.add(fn);
  return () => abonnes.delete(fn);
}

export function reinitialiser() {
  etat = structuredClone(PAR_DEFAUT);
  try { localStorage.removeItem(CLE); } catch (e) { /* ignoré */ }
  abonnes.forEach((fn) => fn(etat));
}

/* --- Étapes d'une démarche --- */

export function etapesDe(document_) {
  const total = document_.etapes.length;
  const enregistrees = etat.etapes[document_.id] || [];
  const liste = [];
  for (let i = 0; i < total; i++) liste.push(Boolean(enregistrees[i]));
  return liste;
}

export function basculerEtape(idDocument, index, total) {
  const liste = [];
  const enregistrees = etat.etapes[idDocument] || [];
  for (let i = 0; i < total; i++) liste.push(Boolean(enregistrees[i]));
  liste[index] = !liste[index];
  ecrire({ etapes: Object.assign({}, etat.etapes, { [idDocument]: liste }) });
  return liste;
}

export function demarcheTerminee(document_) {
  if (!document_.etapes.length) return document_.statut === 'termine';
  return etapesDe(document_).every(Boolean);
}

export function progression(document_) {
  if (!document_.etapes.length) return document_.statut === 'termine' ? 1 : 0;
  const faites = etapesDe(document_).filter(Boolean).length;
  return faites / document_.etapes.length;
}

/* --- Rappels --- */

export function rappelsActifs(idDocument) {
  return Boolean(etat.rappels[idDocument]);
}

export function basculerRappels(idDocument) {
  const suite = Object.assign({}, etat.rappels);
  suite[idDocument] = !suite[idDocument];
  ecrire({ rappels: suite });
  return suite[idDocument];
}
