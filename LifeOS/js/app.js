/* Point d'entrée de LifeOS : routage, rendu, interactions, installation PWA. */

import * as vues from './vues.js';
import { icone } from './icones.js';
import { documentParId } from './data.js';
import {
  lire, ecrire, basculerEtape, basculerRappels, reinitialiser
} from './store.js';
import { annoncer } from './ui.js';
import {
  definirRendu, rafraichir, naviguer, cheminActuel, segments,
  annulerMinuteries
} from './routeur.js';

const conteneur = document.getElementById('contenu');
const barreOnglets = document.getElementById('barre-onglets');
const bandeauReseau = document.getElementById('etat-reseau');

const ONGLETS = [
  { chemin: '/tableau-de-bord', nom: 'Accueil', icone: 'accueil' },
  { chemin: '/analyser', nom: 'Analyser', icone: 'analyser', principal: true },
  { chemin: '/demarches', nom: 'Démarches', icone: 'demarches' },
  { chemin: '/documents', nom: 'Documents', icone: 'documents' }
];

const PUBLIQUES = ['/', '/connexion', '/onboarding'];

/* ------------------------------------------------------------------ */
/* Rendu                                                               */
/* ------------------------------------------------------------------ */

function choisirVue() {
  const parties = segments();
  const chemin = cheminActuel();
  const etat = lire();

  if (chemin === '/' && etat.compte) {
    return etat.onboardingVu ? vues.tableauDeBord() : vues.onboarding();
  }
  if (!etat.compte && !PUBLIQUES.includes(chemin)) {
    naviguer('#/connexion');
    return vues.connexion();
  }

  switch (parties[0]) {
    case undefined: return vues.accueil();
    case 'connexion': return vues.connexion();
    case 'onboarding': return vues.onboarding();
    case 'tableau-de-bord': return vues.tableauDeBord();
    case 'analyser': return vues.analyser();
    case 'analyse': return vues.analyse();
    case 'demarches': return vues.demarches();
    case 'echeances': return vues.echeances();
    case 'documents': return vues.documents();
    case 'notifications': return vues.notifications();
    case 'langue': return vues.langue();
    case 'accessibilite': return vues.accessibilite();
    case 'parametres': return vues.parametres();
    case 'installer': return vues.installer();
    case 'document':
      if (!parties[1]) return vues.introuvable();
      if (parties[2] === 'etapes') return vues.etapes(parties[1]);
      if (parties[2] === 'assistant') return vues.assistant(parties[1]);
      return vues.document_(parties[1]);
    default: return vues.introuvable();
  }
}

function rendre() {
  annulerMinuteries();
  appliquerPreferences();

  const vue = choisirVue();
  document.title = vue.titre;
  conteneur.className = 'ecran' + (vue.pleineLargeur ? ' ecran--large' : '');
  conteneur.innerHTML = vue.html;

  document.body.classList.toggle('avec-onglets', Boolean(vue.onglets));
  barreOnglets.hidden = !vue.onglets;
  if (vue.onglets) rendreOnglets();

  if (typeof vue.apres === 'function') vue.apres();
}

function rendreOnglets() {
  const chemin = cheminActuel();

  barreOnglets.innerHTML = ONGLETS.map((o) => {
    const actif =
      chemin === o.chemin ||
      (o.chemin === '/documents' && chemin.startsWith('/document'));

    return `
      <a href="#${o.chemin}"
         class="${actif ? 'onglet-actif' : ''}"
         ${actif ? 'aria-current="page"' : ''}>
        ${icone(o.icone, { taille: 22 })}
        ${o.nom}
      </a>
    `;
  }).join('');
}


function appliquerPreferences() {
  const etat = lire();
  document.body.classList.toggle('lecture-facile', etat.lectureFacile);
  document.documentElement.style.setProperty('--echelle', String(etat.tailleTexte || 1));
}

/* ------------------------------------------------------------------ */
/* Interactions (délégation d'événements)                              */
/* ------------------------------------------------------------------ */

document.addEventListener('click', (ev) => {
  const cible = ev.target.closest('[data-action]');
  if (!cible || cible.tagName === 'FORM' || cible.type === 'file') return;
  const action = cible.dataset.action;
  const local = vues.etatLocal();

  switch (action) {
    case 'segment':
      local[cible.dataset.cible] = cible.dataset.valeur;
      rafraichir();
      break;

    case 'basculer':
      local[cible.dataset.cle] = !local[cible.dataset.cle];
      rafraichir();
      break;

    case 'onboarding-suivant':
      local.onboarding = Math.min((local.onboarding || 0) + 1, 2);
      rafraichir();
      break;

    case 'terminer-onboarding':
      ecrire({ onboardingVu: true });
      naviguer('#/tableau-de-bord');
      break;

    case 'valider-compte':
      creerCompte();
      break;

    case 'basculer-etape': {
      const id = cible.dataset.doc;
      const total = Number(cible.dataset.total);
      const liste = basculerEtape(id, Number(cible.dataset.index), total);
      const doc = documentParId(id);
      if (liste.every(Boolean)) {
        annoncer('Démarche terminée. LifeOS ne vous enverra plus de rappel pour cette échéance.');
        if (doc) notifierLocalement('Démarche terminée', `${doc.demarche} : c'est fait.`);
      }
      rafraichir();
      break;
    }

    case 'basculer-rappels': {
      const actif = basculerRappels(cible.dataset.doc);
      annoncer(actif ? 'Rappels activés.' : 'Rappels désactivés.');
      if (actif) demanderNotifications();
      rafraichir();
      break;
    }

    case 'poser':
      local.posees = (local.posees || []).concat([Number(cible.dataset.index)]);
      rafraichir();
      break;

    case 'categorie':
      local.categorie = cible.dataset.valeur;
      local.focusRecherche = false;
      rafraichir();
      break;

    case 'choisir-langue':
      ecrire({ langue: cible.dataset.code });
      rafraichir();
      break;

    case 'basculer-lecture-facile':
      ecrire({ lectureFacile: !lire().lectureFacile });
      rafraichir();
      break;

    case 'taille-texte':
      ecrire({ tailleTexte: Number(cible.dataset.valeur) });
      rafraichir();
      break;

    case 'basculer-reglage': {
      const reglages = Object.assign({}, lire().reglages);
      reglages[cible.dataset.cle] = !reglages[cible.dataset.cle];
      ecrire({ reglages });
      rafraichir();
      break;
    }

    case 'tout-lu':
      ecrire({ notificationsLues: ['n1', 'n2', 'n3'] });
      annoncer('Toutes les notifications sont marquées comme lues.');
      rafraichir();
      break;

    case 'autoriser-notifications':
      demanderNotifications();
      break;

    case 'masquer-install':
      ecrire({ installMasque: true });
      rafraichir();
      break;

    case 'installer':
      lancerInstallation();
      break;

    case 'supprimer-document':
      if (confirm('Supprimer ce document et la démarche associée ? Cette action est définitive.')) {
        naviguer('#/documents');
      }
      break;

    case 'exporter-donnees':
      exporterDonnees();
      break;

    case 'supprimer-donnees':
      if (confirm('Supprimer toutes vos données LifeOS enregistrées sur cet appareil ?')) {
        reinitialiser();
        naviguer('#/');
      }
      break;

    case 'aide':
      alert("Aide LifeOS\n\nPhotographiez un courrier, LifeOS vous explique ce qu'il signifie, ce que vous devez faire et avant quelle date.\n\nCette version de démonstration fonctionne avec des documents d'exemple.");
      break;

    case 'deconnexion':
      ecrire({ compte: null });
      naviguer('#/');
      break;

    default:
      break;
  }
});

/* Formulaires */
document.addEventListener('submit', (ev) => {
  const formulaire = ev.target.closest('form[data-action]');
  if (!formulaire) return;
  ev.preventDefault();
  const action = formulaire.dataset.action;

  if (action === 'valider-compte') {
    creerCompte(formulaire);
  } else if (action === 'poser-libre') {
    const champ = formulaire.querySelector('input');
    if (champ && champ.value.trim()) {
      alert("Démonstration : les questions libres ne sont pas encore reliées à une analyse réelle. Utilisez les suggestions proposées.");
      champ.value = '';
    }
  }
});

/* Recherche dans les documents */
document.addEventListener('input', (ev) => {
  const champ = ev.target.closest('[data-action="recherche"]');
  if (!champ) return;
  const local = vues.etatLocal();
  local.recherche = champ.value;
  local.focusRecherche = true;
  rafraichir();
});

/* Choix d'un fichier : on passe à l'écran d'analyse */
document.addEventListener('change', (ev) => {
  const champ = ev.target.closest('[data-action="fichier-choisi"]');
  if (!champ) return;
  naviguer('#/analyse');
});

function creerCompte(formulaire) {
  const local = vues.etatLocal();
  const creation = (local.mode || 'creation') === 'creation';
  const donnees = formulaire ? new FormData(formulaire) : null;
  const prenom = (donnees && String(donnees.get('prenom') || '').trim()) || 'Camille';
  const email = (donnees && String(donnees.get('email') || '').trim()) || 'camille@exemple.fr';

  if (formulaire && creation && !donnees.get('prenom')) {
    const erreur = document.getElementById('erreur-compte');
    if (erreur) { erreur.hidden = false; erreur.textContent = 'Merci d’indiquer votre prénom.'; }
    return;
  }

  ecrire({ compte: { prenom, email } });
  naviguer(lire().onboardingVu ? '#/tableau-de-bord' : '#/onboarding');
}

function exporterDonnees() {
  const contenu = JSON.stringify(lire(), null, 2);
  const lien = document.createElement('a');
  lien.href = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }));
  lien.download = 'mes-donnees-lifeos.json';
  lien.click();
  URL.revokeObjectURL(lien.href);
}

/* ------------------------------------------------------------------ */
/* Notifications locales                                               */
/* ------------------------------------------------------------------ */

function demanderNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') Notification.requestPermission();
}

function notifierLocalement(titre, corps) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(titre, { body: corps, icon: 'icons/icon-192.png', lang: 'fr' });
  } catch (e) { /* certains navigateurs exigent le service worker */ }
}

/* ------------------------------------------------------------------ */
/* Installation (PWA)                                                  */
/* ------------------------------------------------------------------ */

let invitationInstall = null;
window.__lifeosInstallable = false;

window.addEventListener('beforeinstallprompt', (ev) => {
  ev.preventDefault();
  invitationInstall = ev;
  window.__lifeosInstallable = true;
  rafraichir();
});

window.addEventListener('appinstalled', () => {
  invitationInstall = null;
  window.__lifeosInstallable = false;
  annoncer('LifeOS est installée sur votre appareil.');
  rafraichir();
});

async function lancerInstallation() {
  if (invitationInstall) {
    invitationInstall.prompt();
    await invitationInstall.userChoice;
    invitationInstall = null;
    window.__lifeosInstallable = false;
    rafraichir();
    return;
  }
  if (cheminActuel() !== '/installer') naviguer('#/installer');
  else alert("Pour installer LifeOS : ouvrez le menu de votre navigateur, puis choisissez « Ajouter à l'écran d'accueil ».");
}

/* ------------------------------------------------------------------ */
/* Connexion réseau                                                    */
/* ------------------------------------------------------------------ */

function majReseau() {
  bandeauReseau.hidden = navigator.onLine;
}
window.addEventListener('online', majReseau);
window.addEventListener('offline', majReseau);

/* ------------------------------------------------------------------ */
/* Démarrage                                                           */
/* ------------------------------------------------------------------ */

window.addEventListener('hashchange', () => {
  vues.reinitialiserLocal();
  rendre();
  conteneur.focus({ preventScroll: true });
  window.scrollTo(0, 0);
});

definirRendu(rendre);
majReseau();
rendre();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {
      /* Le service worker exige HTTPS ou localhost : l'application marche quand même. */
    });
  });
}
