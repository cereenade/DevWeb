/* Types et constantes partagés entre le serveur et l'interface. */

import type { NomIcone } from '@/components/Icone';

export type CleStatut = 'action' | 'verifier' | 'info' | 'termine' | 'archive';

export interface Langue {
  code: string;
  nom: string;
  sousTitre: string;
  rtl: boolean;
}

export interface Statut {
  libelle: string;
  classe: string;
  couleur: string;
  fond: string;
  texte: string;
  icone: NomIcone;
}

export interface Question {
  q: string;
  r: string;
}

/** Contenu d'un document, tel qu'il sort de l'analyse. */
export interface ModeleDocument {
  slug: string;
  organisme: string;
  initiales: string;
  categorie: string;
  objet: string;
  demarche: string;
  recuLe: string;
  echeance: string | null;
  statut: CleStatut;
  teinte: { fond: string; texte: string };
  enClair: Record<string, string>;
  enClairFacile: string;
  extrait: string;
  extraitExplique: string;
  etapes: string[];
  questions: Question[];
}

/** Un document d'une personne, avec son suivi. */
export interface DocumentAdmin extends ModeleDocument {
  etapesFaites: boolean[];
  rappels: boolean;
}

export interface ModeleNotification {
  titre: string;
  texte: string;
  joursAvant: number;
  ton: CleStatut;
  lien: string;
  action: string;
}

export interface NotificationLifeOS {
  id: string;
  titre: string;
  texte: string;
  creeLe: Date;
  ton: CleStatut;
  lien: string;
  action: string;
  lue: boolean;
}

/** Ce que l'interface connaît de la personne connectée (jamais le mot de passe). */
export interface Utilisateur {
  prenom: string;
  email: string;
  onboardingVu: boolean;
  langue: string;              // langue des explications ; l'interface reste en français
  lectureFacile: boolean;
  tailleTexte: number;         // 1 | 1.15 | 1.32
  reglages: { rappels: boolean; analyses: boolean; resume: boolean };
  installMasque: boolean;
}

export type CleReglage = keyof Utilisateur['reglages'];

export const LANGUES: Langue[] = [
  { code: 'fr', nom: 'Français simple', sousTitre: 'Langue par défaut', rtl: false },
  { code: 'en', nom: 'English', sousTitre: 'Anglais', rtl: false },
  { code: 'es', nom: 'Español', sousTitre: 'Espagnol', rtl: false },
  { code: 'tr', nom: 'Türkçe', sousTitre: 'Turc', rtl: false },
  { code: 'ar', nom: 'العربية', sousTitre: 'Arabe', rtl: true },
  { code: 'pt', nom: 'Português', sousTitre: 'Portugais', rtl: false },
  { code: 'it', nom: 'Italiano', sousTitre: 'Italien', rtl: false },
  { code: 'de', nom: 'Deutsch', sousTitre: 'Allemand', rtl: false },
  { code: 'zh', nom: '中文', sousTitre: 'Chinois', rtl: false }
];

export const CATEGORIES = [
  'Tous', 'France Travail', 'CAF', 'Impôts', 'Assurance Maladie', 'Préfecture',
  'Logement', 'Travail', 'Études', 'Banque', 'Assurance', 'Autres'
];

export const STATUTS: Record<CleStatut, Statut> = {
  action: { libelle: 'Action nécessaire', classe: 'statut--action', couleur: '#C0483B', fond: '#FBE9E6', texte: '#A4382D', icone: 'alerte' },
  verifier: { libelle: 'À vérifier', classe: 'statut--verifier', couleur: '#C97C22', fond: '#FAEFDF', texte: '#8A5310', icone: 'attention' },
  info: { libelle: 'Pour information', classe: 'statut--info', couleur: '#3A57A8', fond: '#E9EFFB', texte: '#33509E', icone: 'info' },
  termine: { libelle: 'Terminé', classe: 'statut--termine', couleur: '#2F7D57', fond: '#E6F2EB', texte: '#1E5E3E', icone: 'coche' },
  archive: { libelle: 'Archivé', classe: 'statut--archive', couleur: '#8B8896', fond: '#EFEDE9', texte: '#5E5C6B', icone: 'boite' }
};

/* Étapes affichées pendant l'analyse d'un document. */
export const ETAPES_ANALYSE = [
  'Identification de l’organisme',
  'Lecture du document',
  'Recherche des informations importantes',
  'Identification des démarches à effectuer',
  'Détection des dates limites'
];

