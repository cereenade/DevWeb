/* Les écrans de LifeOS. Chaque vue renvoie { titre, html, onglets, apres? }.
   Toute l'interface est en français ; seule l'explication d'un document change de langue. */

import { icone, logo } from './icones.js';
import {
  DOCUMENTS, LANGUES, CATEGORIES, STATUTS, NOTIFICATIONS, ETAPES_ANALYSE,
  UTILISATEUR, documentParId
} from './data.js';
import {
  lire, ecrire, etapesDe, basculerEtape, demarcheTerminee, progression,
  rappelsActifs, basculerRappels, reinitialiser
} from './store.js';
import {
  texte, dateLongue, dateCourte, jourEtMois, joursRestants, delaiEnMots, delaiCourt,
  badgeStatut, enteteEcran, carteDocument, annoncer
} from './ui.js';
import { rafraichir, naviguer, minuterie } from './routeur.js';

/* État transitoire d'un écran (onglet ouvert, question posée…). */
let local = {};
export function reinitialiserLocal() { local = {}; }

/* ------------------------------------------------------------------ */
/* Page d'accueil publique                                             */
/* ------------------------------------------------------------------ */

export function accueil() {
  const html = `
  <div class="landing">
    <header class="entete-site">
      <a class="marque" href="#/">${logo(34)}<span>LifeOS</span></a>
      <nav aria-label="Navigation du site">
        <a href="#comprendre">Comment ça marche</a>
        <a href="#organismes">Organismes</a>
        <a href="#langues">Langues</a>
        <a href="#confidentialite">Confidentialité</a>
      </nav>
      <a class="lien-texte" href="#/connexion" style="color:#3B3947">Se connecter</a>
    </header>

    <section class="heros pile">
      <span class="etiquette">${icone('etincelle', { taille: 16, epaisseur: 2 })}Vos papiers. En clair.</span>
      <h1>Comprenez enfin vos papiers administratifs.</h1>
      <p class="accroche">Prenez votre document en photo. LifeOS vous explique ce qu'il signifie, ce que vous devez faire et avant quelle date.</p>
      <a class="bouton bouton--bloc" href="#/connexion">${icone('photo', { taille: 22 })}Analyser mon premier document</a>
      <a class="bouton bouton--secondaire bouton--bloc" href="#comprendre">Voir comment ça marche</a>
      <div class="rangee" style="flex-wrap:wrap;gap:18px;margin-top:4px">
        <span class="rangee" style="gap:8px;font-size:.9rem;font-weight:600;color:var(--texte-2)">
          ${icone('cadenas', { taille: 18, couleur: '#5A48B8', epaisseur: 2 })}Vos documents restent privés
        </span>
        <span class="rangee" style="gap:8px;font-size:.9rem;font-weight:600;color:var(--texte-2)">
          ${icone('telephone', { taille: 18, couleur: '#5A48B8', epaisseur: 2 })}Installable sur votre téléphone
        </span>
      </div>
    </section>

    <section class="pile" style="margin-top:44px">
      <div class="carte carte--plate" style="background:var(--creme-2);border:none">
        <span class="titre-section">Votre document</span>
        <p style="font-style:italic;color:#55535F;line-height:1.7">« À défaut d'actualisation de votre situation avant la date indiquée, votre inscription sur la liste des demandeurs d'emploi pourra cesser. »</p>
      </div>
      <div class="rangee" style="justify-content:center;gap:10px">
        ${icone('suivant', { taille: 24, couleur: '#B9AEEB', epaisseur: 2 })}
        <span class="statut" style="background:var(--lavande);color:#fff;padding:9px 15px;font-size:.88rem">
          ${icone('etincelle', { taille: 15, couleur: '#fff', epaisseur: 1.9 })}LifeOS analyse
        </span>
        ${icone('suivant', { taille: 24, couleur: '#B9AEEB', epaisseur: 2 })}
      </div>
      <div class="carte">
        <div class="rangee-entre">
          <span class="carte-titre" style="font-size:1.2rem">France Travail</span>
          ${badgeStatut('action')}
        </div>
        <p>Vous devez effectuer votre actualisation mensuelle.</p>
        <span class="rangee" style="gap:9px;padding:10px 13px;background:var(--creme);border:1px solid var(--bordure);border-radius:13px;font-weight:700;font-size:.92rem;align-self:flex-start">
          ${icone('calendrier', { taille: 17, couleur: '#A4382D', epaisseur: 2 })}Avant le 28 septembre
        </span>
        <ul class="pile-s">
          ${['Connectez-vous à France Travail', 'Effectuez votre actualisation', 'Vérifiez vos informations', 'Validez']
            .map((e) => `<li class="rangee" style="gap:10px;font-size:.96rem">${icone('coche', { taille: 18, couleur: '#2F7D57', epaisseur: 2.6 })}${texte(e)}</li>`).join('')}
        </ul>
      </div>
    </section>

    <section id="comprendre" class="pile" style="margin-top:56px">
      <h2 style="font-size:1.9rem">Comment ça marche ?</h2>
      <div class="grille-3">
        ${[
          { i: 'photo', f: 'var(--lavande-clair)', c: '#4737A0', t: '1. Photographiez', d: 'Prenez en photo votre courrier ou importez votre PDF.' },
          { i: 'etincelle', f: 'var(--bleu-clair)', c: '#33509E', t: '2. Comprenez', d: 'LifeOS transforme le jargon administratif en explications simples, dans votre langue.' },
          { i: 'coche', f: 'var(--vert-clair)', c: '#1E5E3E', t: '3. Agissez', d: 'Suivez les étapes et recevez des rappels avant vos échéances.' }
        ].map((b) => `
          <div class="carte">
            <span class="vignette" style="background:${b.f};color:${b.c}">${icone(b.i, { taille: 24, couleur: b.c })}</span>
            <h3 style="font-size:1.3rem">${b.t}</h3>
            <p style="color:var(--texte-2)">${b.d}</p>
          </div>`).join('')}
      </div>
    </section>

    <section id="organismes" class="pile" style="margin-top:56px">
      <h2 style="font-size:1.9rem">Un seul endroit pour comprendre vos démarches.</h2>
      <div class="grille-2">
        ${['France Travail', 'CAF', 'Impôts', 'Assurance Maladie', 'Préfecture', 'Logement', 'Travail', 'Études']
          .map((o) => `<span class="carte carte--plate" style="align-items:center;justify-content:center;padding:16px 12px;font-weight:700;font-size:.95rem;text-align:center">${texte(o)}</span>`).join('')}
      </div>
      <p class="note-bas">LifeOS est un service indépendant. LifeOS n'est pas un service officiel de ces organismes et n'a aucun partenariat avec eux.</p>
    </section>

    <section id="langues" class="pile" style="margin-top:56px">
      <h2 style="font-size:1.9rem">Comprenez dans la langue que vous maîtrisez le mieux.</h2>
      <p style="color:var(--texte-2)">LifeOS ne traduit pas mot à mot : il réécrit le document en phrases simples, dans votre langue. L'interface, elle, reste en français.</p>
      <div class="rangee" style="flex-wrap:wrap;gap:8px">
        ${LANGUES.map((l) => `<span class="puce" style="display:inline-flex;align-items:center">${texte(l.nom)}</span>`).join('')}
      </div>
    </section>

    <section id="installer-pwa" class="carte carte--lavande" style="margin-top:56px;padding:26px">
      <h2 style="font-size:1.5rem;color:#2F2B45">Une application à installer, pas un logiciel à télécharger.</h2>
      <p style="color:#3F3372">LifeOS s'ajoute à votre écran d'accueil en un appui, depuis votre navigateur. L'appareil photo s'ouvre directement, les rappels arrivent comme des notifications et vos explications restent lisibles hors connexion.</p>
      <button type="button" class="bouton bouton--bloc" data-action="installer">${icone('telecharger', { taille: 20, couleur: '#fff' })}Installer LifeOS</button>
    </section>

    <section id="confidentialite" class="pile" style="margin-top:56px">
      <h2 style="font-size:1.9rem">Vos documents vous appartiennent.</h2>
      <p style="color:var(--texte-2)">Un courrier administratif contient des informations personnelles. LifeOS les utilise uniquement pour vous expliquer votre démarche, et vous gardez la main dessus.</p>
      <div class="grille-3">
        ${[
          ['Supprimer un document', 'Chaque document peut être supprimé depuis sa fiche, à tout moment.'],
          ['Gérer mes données', 'Vous voyez ce qui est enregistré et vous pouvez l’exporter.'],
          ['Tout effacer', 'La suppression de votre compte efface vos documents et vos démarches.']
        ].map(([t, d]) => `<div class="carte"><h3 style="font-size:1.1rem">${t}</h3><p style="color:var(--texte-2)">${d}</p></div>`).join('')}
      </div>
    </section>

    <section class="bloc-sombre" style="margin-top:56px">
      <h2>Le prochain courrier, vous le comprendrez.</h2>
      <p>Créez votre compte, photographiez votre premier document et voyez ce que LifeOS en fait.</p>
      <a class="bouton bouton--bloc" href="#/connexion">Analyser mon premier document</a>
    </section>

    <footer class="pied-site">
      <span class="marque">${logo(28)}<span style="font-size:1.05rem">LifeOS</span></span>
      <p class="note-bas" style="text-align:left">LifeOS est un service indépendant d'aide à la compréhension des documents administratifs. Il ne remplace pas les organismes officiels et n'a aucun partenariat avec eux.</p>
    </footer>
  </div>`;
  return { titre: 'LifeOS — Vos papiers. En clair.', html, onglets: false, pleineLargeur: true };
}

/* ------------------------------------------------------------------ */
/* Connexion / création de compte                                      */
/* ------------------------------------------------------------------ */

export function connexion() {
  const mode = local.mode || 'creation';
  const creation = mode === 'creation';
  const html = `
  <div class="pile">
    <a class="marque" href="#/" style="margin-bottom:6px">${logo(32)}<span>LifeOS</span></a>
    <h1 style="font-size:1.85rem">${creation ? 'Créer votre compte' : 'Content de vous revoir'}</h1>
    <p style="color:var(--texte-3)">${creation
      ? 'Quelques secondes suffisent pour commencer à comprendre vos courriers.'
      : 'Connectez-vous pour retrouver vos démarches et vos échéances.'}</p>

    <div class="segments" role="tablist" aria-label="Créer un compte ou se connecter">
      <button type="button" role="tab" aria-selected="${creation}" data-action="segment" data-cible="mode" data-valeur="creation">Créer un compte</button>
      <button type="button" role="tab" aria-selected="${!creation}" data-action="segment" data-cible="mode" data-valeur="connexion">Se connecter</button>
    </div>

    <form class="pile" data-action="valider-compte" novalidate>
      ${creation ? `
      <div class="champ">
        <label for="prenom">Prénom</label>
        <input id="prenom" name="prenom" type="text" autocomplete="given-name" placeholder="Camille" required>
      </div>` : ''}
      <div class="champ">
        <label for="email">Adresse e-mail</label>
        <input id="email" name="email" type="email" autocomplete="email" placeholder="camille@exemple.fr" required>
      </div>
      <div class="champ">
        <label for="motdepasse">Mot de passe</label>
        <input id="motdepasse" name="motdepasse" type="password" autocomplete="${creation ? 'new-password' : 'current-password'}" placeholder="8 caractères minimum" required>
      </div>
      ${creation ? `
      <div class="case-a-cocher">
        <input id="conditions" type="checkbox" required>
        <label for="conditions">J'accepte les conditions d'utilisation et la politique de confidentialité de LifeOS.</label>
      </div>` : ''}
      <p id="erreur-compte" role="alert" style="color:#9C362B;font-weight:700;font-size:.9rem" hidden></p>
      <button type="submit" class="bouton bouton--bloc">${creation ? 'Créer mon compte' : 'Me connecter'}</button>
    </form>

    <div class="rangee" style="gap:12px">
      <span style="flex-grow:1;height:1px;background:var(--bordure-forte)"></span>
      <span style="font-size:.85rem;color:var(--texte-4)">ou</span>
      <span style="flex-grow:1;height:1px;background:var(--bordure-forte)"></span>
    </div>
    <button type="button" class="bouton bouton--secondaire bouton--bloc" data-action="valider-compte">
      ${icone('courrier', { taille: 20, couleur: '#6A57CC' })}Recevoir un lien par e-mail
    </button>

    <div class="carte carte--lavande" style="flex-direction:row;align-items:center;gap:10px;padding:14px 16px">
      ${icone('cadenas', { taille: 18, couleur: '#5A48B8' })}
      <p style="font-size:.88rem;color:#4A4757">Vos documents restent privés et protégés.</p>
    </div>
  </div>`;
  return { titre: 'Connexion — LifeOS', html, onglets: false };
}

/* ------------------------------------------------------------------ */
/* Onboarding                                                          */
/* ------------------------------------------------------------------ */

const PAGES_ONBOARDING = [
  { titre: 'Photographiez vos documents', texte: 'LifeOS vous explique ce qu’ils signifient et ce que vous devez faire.', icone: 'photo', fond: 'var(--lavande-clair)', couleur: '#4737A0' },
  { titre: 'Ne ratez plus une échéance', texte: 'LifeOS détecte les dates importantes et vous rappelle vos démarches.', icone: 'calendrier', fond: 'var(--vert-clair)', couleur: '#1E5E3E' },
  { titre: 'Comprenez dans votre langue', texte: 'LifeOS peut expliquer les documents administratifs dans la langue que vous comprenez le mieux.', icone: 'globe', fond: 'var(--bleu-clair)', couleur: '#33509E' }
];

export function onboarding() {
  const index = local.onboarding || 0;
  const page = PAGES_ONBOARDING[index];
  const derniere = index === PAGES_ONBOARDING.length - 1;
  const html = `
  <div class="pile" style="min-height:70vh">
    <div class="rangee-entre">
      <span class="marque">${logo(28)}<span style="font-size:1.05rem">LifeOS</span></span>
      <button type="button" class="lien-texte" style="background:none;border:none;color:var(--texte-3);padding:10px" data-action="terminer-onboarding">Passer</button>
    </div>

    <div class="pile apparition" style="align-items:center;text-align:center;gap:22px;margin-top:26px">
      <span style="display:flex;align-items:center;justify-content:center;width:200px;height:200px;border-radius:48px;background:${page.fond}">
        ${icone(page.icone, { taille: 84, couleur: page.couleur, epaisseur: 1.5 })}
      </span>
      <h1 style="font-size:1.8rem">${texte(page.titre)}</h1>
      <p style="font-size:1.05rem;color:var(--texte-2);max-width:320px">${texte(page.texte)}</p>
    </div>

    <div class="pousse"></div>

    <div class="rangee" style="justify-content:center;gap:8px" role="img" aria-label="Étape ${index + 1} sur ${PAGES_ONBOARDING.length}">
      ${PAGES_ONBOARDING.map((_, i) => `<span style="display:block;height:8px;border-radius:99px;width:${i === index ? '26px' : '8px'};background:${i === index ? 'var(--lavande)' : '#D8D3EC'}"></span>`).join('')}
    </div>

    ${derniere
      ? `<button type="button" class="bouton bouton--bloc" data-action="terminer-onboarding">Commencer</button>`
      : `<button type="button" class="bouton bouton--bloc" data-action="onboarding-suivant">Suivant ${icone('suivant', { taille: 20, couleur: '#fff' })}</button>`}
  </div>`;
  return { titre: 'Bienvenue — LifeOS', html, onglets: false };
}

/* ------------------------------------------------------------------ */
/* Tableau de bord                                                     */
/* ------------------------------------------------------------------ */

export function tableauDeBord() {
  const etat = lire();
  const prenom = (etat.compte && etat.compte.prenom) || UTILISATEUR.prenom;
  const aFaire = DOCUMENTS.filter((d) => d.echeance && !demarcheTerminee(d));
  const rien = DOCUMENTS.filter((d) => !d.echeance || demarcheTerminee(d));
  const prochaine = aFaire.slice().sort((a, b) => a.echeance.localeCompare(b.echeance))[0];
  const nonLues = NOTIFICATIONS.filter((n) => !etat.notificationsLues.includes(n.id)).length;

  const html = `
  <div class="pile">
    <div class="rangee-entre" style="align-items:flex-start">
      <div>
        <h1 style="font-size:1.6rem">Bonjour ${texte(prenom)}</h1>
        <p style="color:var(--texte-3)">Voici ce qui nécessite votre attention.</p>
      </div>
      <a class="bouton-icone" href="#/notifications" aria-label="Centre de notifications${nonLues ? `, ${nonLues} non lues` : ''}" style="position:relative">
        ${icone('cloche', { taille: 22 })}
        ${nonLues ? '<span style="position:absolute;top:9px;right:10px;width:9px;height:9px;border-radius:99px;background:#C0483B;border:2px solid #fff"></span>' : ''}
      </a>
    </div>

    <a class="bouton bouton--bloc" href="#/analyser" style="justify-content:flex-start;gap:14px;padding:18px;border-radius:22px;min-height:84px">
      <span style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:16px;background:rgba(255,255,255,.18)">${icone('plus', { taille: 26, couleur: '#fff' })}</span>
      <span style="display:flex;flex-direction:column;gap:3px;text-align:left">
        <span style="font-family:'Outfit',sans-serif;font-size:1.15rem">Analyser un document</span>
        <span style="font-size:.85rem;font-weight:600;color:#E4DEFA">Photo, PDF ou scan</span>
      </span>
    </a>

    ${bandeauInstallation()}

    <div class="rangee-entre">
      <h2 style="font-size:1.12rem">À faire</h2>
      <a class="lien-texte" href="#/demarches">Tout voir</a>
    </div>

    ${aFaire.length
      ? aFaire.map((d) => carteDocument(d, progression(d))).join('')
      : `<div class="carte" style="align-items:center;text-align:center;padding:26px">
           ${icone('coche', { taille: 34, couleur: '#2F7D57', epaisseur: 2.2 })}
           <p style="font-weight:700">Rien à faire pour le moment</p>
           <p class="carte-detail">Toutes vos démarches sont à jour.</p>
         </div>`}

    ${rien.map((d) => `
      <div class="carte carte--plate" style="flex-direction:row;align-items:center;gap:13px">
        <span class="vignette" style="background:${STATUTS[d.statut].fond};color:${STATUTS[d.statut].texte}">${icone(STATUTS[d.statut].icone, { taille: 20, couleur: STATUTS[d.statut].texte, epaisseur: 2.2 })}</span>
        <span style="display:flex;flex-direction:column;gap:2px">
          <a href="#/document/${d.id}" style="font-weight:700;color:var(--anthracite)">${texte(d.organisme)}</a>
          <span class="carte-detail">${d.statut === 'termine' ? 'Aucune action nécessaire' : texte(d.objet)}</span>
        </span>
      </div>`).join('')}

    ${prochaine ? `
    <a class="carte carte--lavande" href="#/echeances" style="flex-direction:row;align-items:center;gap:11px">
      ${icone('calendrier', { taille: 20, couleur: '#5A48B8' })}
      <p style="flex-grow:1;color:#4A4757">Prochaine échéance <strong>${texte(delaiCourt(prochaine.echeance))}</strong></p>
      <span class="lien-texte">Voir</span>
    </a>` : ''}
  </div>`;
  return { titre: 'Tableau de bord — LifeOS', html, onglets: true };
}

function bandeauInstallation() {
  if (lire().installMasque || !window.__lifeosInstallable) return '';
  return `
  <div class="bandeau-install">
    ${icone('telephone', { taille: 22, couleur: '#4737A0' })}
    <span style="display:flex;flex-direction:column;gap:2px;flex-grow:1">
      <strong>Installer LifeOS</strong>
      <span style="font-size:.86rem;color:var(--texte-2)">Ouvrez l'application depuis votre écran d'accueil.</span>
    </span>
    <button type="button" class="puce" data-action="installer">Installer</button>
    <button type="button" class="bouton-icone" data-action="masquer-install" aria-label="Masquer la proposition d'installation">${icone('chevron', { taille: 18 })}</button>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Import / photographie                                               */
/* ------------------------------------------------------------------ */

export function analyser() {
  const html = `
  ${enteteEcran('Analyser un document', '#/tableau-de-bord')}
  <div class="pile">
    <p style="font-size:1.15rem;font-weight:700">Vous avez reçu un document que vous ne comprenez pas ?</p>
    <p style="color:var(--texte-3)">Prenez-le en photo ou importez-le. LifeOS s'occupe du reste.</p>

    <div class="depot" id="zone-depot">
      ${icone('fichier', { taille: 64, couleur: '#6A57CC', epaisseur: 1.5 })}
      <p style="font-weight:700;color:var(--texte-2)">Déposez votre fichier ici</p>
    </div>

    <label class="bouton bouton--bloc" for="prise-photo">
      ${icone('photo', { taille: 24, couleur: '#fff' })}Prendre une photo
      <input id="prise-photo" type="file" accept="image/*" capture="environment" class="visuellement-cache" data-action="fichier-choisi">
    </label>
    <label class="bouton bouton--secondaire bouton--bloc" for="import-fichier">
      ${icone('televerser', { taille: 24, couleur: '#6A57CC' })}Importer un document
      <input id="import-fichier" type="file" accept="image/*,application/pdf" class="visuellement-cache" data-action="fichier-choisi">
    </label>

    <div class="rangee" style="gap:10px;margin-top:6px">
      <span style="flex-grow:1;height:1px;background:var(--bordure-forte)"></span>
      <span style="font-size:.82rem;font-weight:700;color:var(--texte-4)">Formats acceptés</span>
      <span style="flex-grow:1;height:1px;background:var(--bordure-forte)"></span>
    </div>
    <div class="rangee" style="gap:10px">
      ${[['image', 'Photo'], ['fichier', 'PDF'], ['scan', 'Scan']].map(([i, t]) => `
        <span class="carte carte--plate" style="flex-grow:1;align-items:center;gap:7px;padding:14px 8px">
          ${icone(i, { taille: 22, epaisseur: 1.8 })}<span style="font-size:.85rem;font-weight:700">${t}</span>
        </span>`).join('')}
    </div>

    <div class="carte carte--lavande" style="flex-direction:row;gap:10px;padding:15px 16px">
      ${icone('cadenas', { taille: 20, couleur: '#5A48B8' })}
      <p style="font-size:.88rem;color:#4A4757">Vos documents restent privés et protégés. Vous pouvez les supprimer à tout moment depuis vos paramètres.</p>
    </div>

    <p class="note-bas">Démonstration : le document analysé est un exemple fictif de courrier France Travail.</p>
  </div>`;

  function apres() {
    const zone = document.getElementById('zone-depot');
    if (!zone) return;
    ['dragenter', 'dragover'].forEach((e) => zone.addEventListener(e, (ev) => {
      ev.preventDefault(); zone.classList.add('survol');
    }));
    ['dragleave', 'drop'].forEach((e) => zone.addEventListener(e, (ev) => {
      ev.preventDefault(); zone.classList.remove('survol');
    }));
    zone.addEventListener('drop', () => naviguer('#/analyse'));
  }

  return { titre: 'Analyser un document — LifeOS', html, onglets: true, apres };
}

/* ------------------------------------------------------------------ */
/* Analyse en cours                                                    */
/* ------------------------------------------------------------------ */

export function analyse() {
  const cible = '#/document/france-travail-actualisation';
  const html = `
  <div class="pile" style="align-items:center;text-align:center;padding-top:20px">
    <div class="doc-anime">
      ${icone('fichier', { taille: 58, couleur: '#C4B9F0', epaisseur: 1.6 })}
      <span class="rotation" style="position:absolute;bottom:-14px;right:-14px;background:var(--creme);border-radius:99px;padding:5px">
        <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="14" stroke="#E2DBF8" stroke-width="4"></circle>
          <path d="M20 6a14 14 0 0 1 14 14" stroke="#6A57CC" stroke-width="4" stroke-linecap="round"></path>
        </svg>
      </span>
    </div>
    <h1 style="font-size:1.45rem;margin-top:28px">Analyse de votre document…</h1>
    <p style="color:var(--texte-3)">Cela prend quelques secondes.</p>
    <div class="jauge" style="width:100%;margin-top:14px"><span id="jauge-analyse" style="width:6%;transition:width 5.2s cubic-bezier(.4,0,.2,1)"></span></div>
  </div>

  <ul class="pile-s" style="margin-top:26px">
    ${ETAPES_ANALYSE.map((e, i) => `
      <li class="etape-analyse" style="animation-delay:${0.2 + i}s">
        ${icone('coche', { taille: 20, couleur: '#2F7D57', epaisseur: 2.4 })}${texte(e)}
      </li>`).join('')}
  </ul>

  <div style="margin-top:26px">
    <a class="bouton bouton--bloc" href="${cible}">Voir le résultat ${icone('suivant', { taille: 20, couleur: '#fff' })}</a>
  </div>`;

  function apres() {
    const jauge = document.getElementById('jauge-analyse');
    if (jauge) requestAnimationFrame(() => { jauge.style.width = '100%'; });
    annoncer('Analyse du document en cours.');
    minuterie(() => {
      annoncer('Analyse terminée.');
      naviguer(cible);
    }, 5600);
  }

  return { titre: 'Analyse en cours — LifeOS', html, onglets: false, apres };
}

/* ------------------------------------------------------------------ */
/* Résultat / détail d'un document                                     */
/* ------------------------------------------------------------------ */

export function document_(id) {
  const doc = documentParId(id);
  if (!doc) return introuvable();

  const etat = lire();
  const s = STATUTS[doc.statut];
  const langue = LANGUES.find((l) => l.code === etat.langue) || LANGUES[0];
  const traduction = doc.enClair[langue.code];
  const enClair = etat.lectureFacile && langue.code === 'fr'
    ? doc.enClairFacile
    : (traduction || doc.enClair.fr);
  const rappels = rappelsActifs(doc.id);
  const terminee = demarcheTerminee(doc);
  const part = progression(doc);
  const faites = doc.etapes.length ? etapesDe(doc).filter(Boolean).length : 0;

  const html = `
  ${enteteEcran('Résultat de l\'analyse', '#/documents')}
  <div class="pile">

    <div class="carte">
      <div class="rangee">
        <span class="vignette" style="background:${doc.teinte.fond};color:${doc.teinte.texte}">${texte(doc.initiales)}</span>
        <span style="display:flex;flex-direction:column;gap:2px">
          <span class="carte-titre" style="font-size:1.25rem">${texte(doc.organisme)}</span>
          <span class="carte-detail">${texte(doc.demarche)}</span>
        </span>
      </div>
      ${badgeStatut(terminee ? 'termine' : doc.statut)}
    </div>

    <div class="carte carte--lavande">
      <div class="rangee" style="gap:8px">
        ${icone('etincelle', { taille: 20, couleur: '#5A48B8' })}
        <h2 style="font-size:1.05rem;color:#3F3372">En clair</h2>
      </div>
      <p lang="${langue.code}" dir="${langue.rtl ? 'rtl' : 'ltr'}" style="font-size:1.04rem;line-height:1.65;color:#2F2B45${langue.rtl ? ';text-align:right' : ''}">${texte(enClair)}</p>
      ${!traduction && langue.code !== 'fr'
        ? `<p style="font-size:.82rem;color:#5A48B8">Démonstration : ce document d'exemple n'est traduit qu'en français. Le document France Travail montre les neuf langues.</p>`
        : ''}
      <a class="lien-texte" href="#/langue">${icone('globe', { taille: 16 })} Changer la langue de l'explication</a>
    </div>

    ${doc.echeance ? `
    <div class="carte">
      <div class="rangee">
        <span class="vignette" style="background:${s.fond};color:${s.texte}">${icone('calendrier', { taille: 22, couleur: s.texte })}</span>
        <span style="display:flex;flex-direction:column;gap:2px;flex-grow:1">
          <span style="font-size:.86rem;font-weight:700;color:var(--texte-3)">Date limite</span>
          <span class="carte-titre" style="font-size:1.2rem">${texte(dateLongue(doc.echeance))}</span>
        </span>
      </div>
      <div class="rangee" style="padding:12px 14px;background:var(--creme);border-radius:14px">
        <div class="jauge"><span style="width:${jaugeEcheance(doc.echeance)}%;background:${s.couleur}"></span></div>
        <span style="font-size:.88rem;font-weight:800;color:${s.texte}">${texte(delaiEnMots(doc.echeance))}</span>
      </div>
      <button type="button" class="bouton ${rappels ? 'bouton--secondaire' : 'bouton--sombre'} bouton--bloc"
              data-action="basculer-rappels" data-doc="${doc.id}" aria-pressed="${rappels}">
        ${icone('cloche', { taille: 20, couleur: rappels ? '#1E5E3E' : '#fff' })}${rappels ? 'Rappels activés' : 'Activer les rappels'}
      </button>
      ${rappels ? `
      <div class="carte carte--plate apparition" style="background:var(--vert-clair);border:none;gap:8px">
        <strong style="font-size:.88rem;color:#1E5E3E">Vos rappels</strong>
        ${['7 jours avant', '2 jours avant', 'Le jour même'].map((r) => `
          <span class="rangee" style="gap:8px;font-size:.92rem">${icone('coche', { taille: 16, couleur: '#26714A', epaisseur: 2.6 })}${r}</span>`).join('')}
      </div>` : ''}
    </div>` : ''}

    <div class="carte">
      <h2 style="font-size:1.05rem">Le texte d'origine</h2>
      <p style="font-style:italic;color:#55535F;line-height:1.65">${texte(doc.extrait)}</p>
      <button type="button" class="bouton bouton--bloc" style="background:var(--lavande-clair);color:var(--lavande-fonce);box-shadow:none;min-height:52px"
              data-action="basculer" data-cle="explication" aria-expanded="${Boolean(local.explication)}">
        ${icone('etincelle', { taille: 20, couleur: '#4737A0' })}Expliquez-moi simplement
      </button>
      ${local.explication ? `
      <div class="carte carte--plate apparition" style="background:var(--creme);gap:6px">
        <strong style="font-size:.82rem;color:#5A48B8">En clair</strong>
        <p>${texte(doc.extraitExplique)}</p>
      </div>` : ''}
    </div>

    ${doc.etapes.length ? `
    <a class="carte" href="#/document/${doc.id}/etapes">
      <div class="rangee">
        <span class="vignette" style="background:var(--lavande-clair);color:var(--lavande-fonce)">${icone('demarches', { taille: 20, couleur: '#5A48B8' })}</span>
        <span style="display:flex;flex-direction:column;gap:2px;flex-grow:1">
          <strong>${doc.etapes.length} étapes à suivre</strong>
          <span class="carte-detail">${faites} étape${faites > 1 ? 's' : ''} déjà faite${faites > 1 ? 's' : ''}</span>
        </span>
        ${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}
      </div>
      <div class="jauge"><span style="width:${Math.max(Math.round(part * 100), 2)}%;background:${terminee ? '#2F7D57' : 'var(--lavande)'}"></span></div>
    </a>` : ''}

    <a class="carte" href="#/document/${doc.id}/assistant" style="flex-direction:row;align-items:center;gap:12px">
      ${icone('discussion', { taille: 22, couleur: '#5A48B8' })}
      <strong style="flex-grow:1">Une question sur ce document ?</strong>
      ${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}
    </a>

    <div class="rangee" style="gap:10px">
      <button type="button" class="bouton bouton--secondaire" style="flex-grow:1;min-height:52px">${icone('telecharger', { taille: 19 })}Télécharger</button>
      <button type="button" class="bouton bouton--danger" style="flex-grow:1;min-height:52px" data-action="supprimer-document">${icone('corbeille', { taille: 19, couleur: '#9C362B' })}Supprimer</button>
    </div>

    ${doc.etapes.length ? `<a class="bouton bouton--bloc" href="#/document/${doc.id}/etapes">Ce que je dois faire ${icone('suivant', { taille: 20, couleur: '#fff' })}</a>` : ''}

    <p class="note-bas">Reçu le ${texte(dateLongue(doc.recuLe))} · Exemple de démonstration</p>
  </div>`;
  return { titre: `${doc.organisme} — LifeOS`, html, onglets: true };
}

function jaugeEcheance(iso) {
  const jours = joursRestants(iso);
  if (jours === null) return 0;
  const part = Math.min(Math.max(1 - jours / 30, 0), 1);
  return Math.round(part * 100);
}

/* ------------------------------------------------------------------ */
/* Étapes d'une démarche                                               */
/* ------------------------------------------------------------------ */

export function etapes(id) {
  const doc = documentParId(id);
  if (!doc || !doc.etapes.length) return introuvable();

  const faites = etapesDe(doc);
  const nb = faites.filter(Boolean).length;
  const terminee = nb === doc.etapes.length;

  const html = `
  ${enteteEcran('Ce que vous devez faire', `#/document/${doc.id}`)}
  <div class="pile">
    <div class="carte">
      <div>
        <span class="carte-titre">${texte(doc.demarche)}</span>
        ${doc.echeance ? `<p class="carte-detail">À effectuer avant le ${texte(dateLongue(doc.echeance))}</p>` : ''}
      </div>
      <div class="rangee">
        <div class="jauge"><span style="width:${Math.round((nb / doc.etapes.length) * 100)}%;background:${terminee ? '#2F7D57' : 'var(--lavande)'}"></span></div>
        <span style="font-size:.88rem;font-weight:800;color:var(--texte-2)">${nb} / ${doc.etapes.length}</span>
      </div>
    </div>

    <ul class="pile-s">
      ${doc.etapes.map((e, i) => `
        <li>
          <button type="button" class="etape" aria-pressed="${faites[i]}"
                  data-action="basculer-etape" data-doc="${doc.id}" data-index="${i}" data-total="${doc.etapes.length}">
            <span class="etape-case">${faites[i] ? icone('coche', { taille: 18, couleur: '#fff', epaisseur: 2.8 }) : String(i + 1)}</span>
            <span class="etape-texte">${texte(e)}</span>
          </button>
        </li>`).join('')}
    </ul>

    ${terminee ? `
    <div class="carte surgit" style="background:var(--vert-clair);border:none;align-items:center;text-align:center;padding:26px">
      <span style="display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:99px;background:#2F7D57">
        ${icone('coche', { taille: 34, couleur: '#fff', epaisseur: 3 })}
      </span>
      <h2 style="font-size:1.35rem;color:#1B5138">Démarche terminée !</h2>
      <p style="color:#2C4F3E">Vous avez terminé cette démarche. LifeOS ne vous enverra plus de rappel pour cette échéance.</p>
      <a class="bouton bouton--bloc" style="background:#2F7D57;box-shadow:none" href="#/tableau-de-bord">Revenir à l'accueil</a>
    </div>`
    : `
    <div class="carte carte--lavande">
      <div class="rangee" style="gap:9px">
        ${icone('cloche', { taille: 20, couleur: '#4737A0' })}
        <h2 style="font-size:1rem;color:#3F3372">LifeOS vous rappellera</h2>
      </div>
      <p style="color:#2F2B45">Vous recevrez un rappel 7 jours, 2 jours et le jour même de l'échéance, tant que la démarche n'est pas terminée.</p>
    </div>`}

    <a class="carte" href="#/document/${doc.id}/assistant" style="flex-direction:row;align-items:center;gap:12px">
      ${icone('discussion', { taille: 22, couleur: '#5A48B8' })}
      <strong style="flex-grow:1">Une étape n'est pas claire ?</strong>
      ${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}
    </a>

    <a class="bouton bouton--secondaire bouton--bloc" href="#/echeances">${icone('calendrier', { taille: 20 })}Voir mes échéances</a>
  </div>`;
  return { titre: 'Étapes de la démarche — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Assistant                                                           */
/* ------------------------------------------------------------------ */

export function assistant(id) {
  const doc = documentParId(id);
  if (!doc) return introuvable();

  const posees = local.posees || [];
  const restantes = doc.questions.map((q, i) => i).filter((i) => !posees.includes(i));

  const html = `
  ${enteteEcran('Assistant LifeOS', `#/document/${doc.id}`)}
  <div class="pile">
    <div class="carte carte--lavande" style="flex-direction:row;align-items:center;gap:10px;padding:12px 14px">
      ${icone('fichier', { taille: 18, couleur: '#5A48B8' })}
      <p style="font-size:.88rem;color:#3F3372">Vos réponses portent sur : <strong>${texte(doc.organisme)} — ${texte(doc.demarche)}</strong></p>
    </div>

    <div class="fil">
      <div class="rangee" style="align-items:flex-start;gap:10px">
        <span class="avatar">${icone('etincelle', { taille: 18, couleur: '#fff' })}</span>
        <p class="bulle bulle--lifeos">Bonjour. Posez-moi votre question sur ce document, je réponds en français simple.</p>
      </div>
      ${posees.map((i) => `
        <p class="bulle bulle--moi apparition">${texte(doc.questions[i].q)}</p>
        <div class="rangee apparition" style="align-items:flex-start;gap:10px">
          <span class="avatar">${icone('etincelle', { taille: 18, couleur: '#fff' })}</span>
          <p class="bulle bulle--lifeos">${texte(doc.questions[i].r)}</p>
        </div>`).join('')}
    </div>

    ${restantes.length ? `
    <div class="pile-s">
      <span class="titre-section">Suggestions</span>
      ${restantes.map((i) => `
        <button type="button" class="carte carte--plate" style="flex-direction:row;align-items:center;justify-content:space-between;gap:10px;min-height:48px;padding:12px 16px;text-align:left;font-weight:600;cursor:pointer;width:100%"
                data-action="poser" data-index="${i}">
          ${texte(doc.questions[i].q)}${icone('chevron', { taille: 16, couleur: '#6A57CC', epaisseur: 2.2 })}
        </button>`).join('')}
    </div>` : ''}

    <form class="zone-saisie" data-action="poser-libre">
      <label class="visuellement-cache" for="question">Votre question</label>
      <input id="question" name="question" type="text" placeholder="Posez votre question à LifeOS…" autocomplete="off">
      <button type="submit" class="envoyer" aria-label="Envoyer la question">${icone('envoyer', { taille: 20, couleur: '#fff' })}</button>
    </form>
    <p class="note-bas">Démonstration : les réponses libres ne sont pas encore branchées sur une analyse réelle.</p>
  </div>`;
  return { titre: 'Assistant — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Mes démarches                                                       */
/* ------------------------------------------------------------------ */

export function demarches() {
  const onglet = local.onglet || 'afaire';
  const avecEtapes = DOCUMENTS.filter((d) => d.etapes.length || d.echeance);
  const listes = {
    afaire: avecEtapes.filter((d) => !demarcheTerminee(d) && progression(d) === 0),
    encours: avecEtapes.filter((d) => !demarcheTerminee(d) && progression(d) > 0),
    terminees: DOCUMENTS.filter((d) => demarcheTerminee(d))
  };
  const vides = {
    afaire: 'Vous n’avez aucune démarche en attente. Analysez un document pour en ajouter une.',
    encours: 'Aucune démarche commencée pour le moment.',
    terminees: 'Vos démarches terminées apparaîtront ici.'
  };
  const liste = listes[onglet];

  const html = `
  <h1 style="font-size:1.6rem;margin-bottom:16px">Mes démarches</h1>
  <div class="segments" role="tablist" aria-label="Filtrer les démarches" style="margin-bottom:16px">
    ${[['afaire', 'À faire'], ['encours', 'En cours'], ['terminees', 'Terminées']].map(([cle, nom]) => `
      <button type="button" role="tab" aria-selected="${onglet === cle}" data-action="segment" data-cible="onglet" data-valeur="${cle}">${nom}</button>`).join('')}
  </div>
  <div class="pile-s">
    ${liste.length
      ? liste.map((d) => carteDocument(d, progression(d))).join('')
      : `<div class="carte" style="align-items:center;text-align:center;padding:30px;border-style:dashed">
           ${icone('fichier', { taille: 36, couleur: '#C9C3B8', epaisseur: 1.8 })}
           <p style="font-weight:700">Aucune démarche ici</p>
           <p class="carte-detail">${vides[onglet]}</p>
         </div>`}
  </div>`;
  return { titre: 'Mes démarches — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Mes échéances                                                       */
/* ------------------------------------------------------------------ */

export function echeances() {
  const vue = local.vue || 'liste';
  const avecDate = DOCUMENTS.filter((d) => d.echeance).sort((a, b) => a.echeance.localeCompare(b.echeance));

  const parMois = {};
  avecDate.forEach((d) => {
    const { nomMois } = jourEtMois(d.echeance);
    const annee = d.echeance.slice(0, 4);
    const cle = `${nomMois} ${annee}`;
    (parMois[cle] = parMois[cle] || []).push(d);
  });

  const html = `
  ${enteteEcran('Mes échéances', '#/tableau-de-bord')}
  <div class="segments" role="tablist" aria-label="Choisir l'affichage" style="margin-bottom:18px">
    <button type="button" role="tab" aria-selected="${vue === 'liste'}" data-action="segment" data-cible="vue" data-valeur="liste">Vue liste</button>
    <button type="button" role="tab" aria-selected="${vue === 'calendrier'}" data-action="segment" data-cible="vue" data-valeur="calendrier">Vue calendrier</button>
  </div>

  ${vue === 'liste' ? `
  <div class="pile-l">
    ${Object.keys(parMois).map((mois) => `
      <div class="pile-s">
        <h2 class="titre-section">${texte(mois)}</h2>
        ${parMois[mois].map((d) => {
          const s = STATUTS[demarcheTerminee(d) ? 'termine' : d.statut];
          const { jour, mois: court } = jourEtMois(d.echeance);
          return `
          <a class="carte" href="#/document/${d.id}" style="flex-direction:row;gap:14px">
            <span class="vignette vignette--haute" style="flex-direction:column;background:${s.fond};color:${s.texte}">
              <span style="font-size:1.3rem;font-weight:700">${jour}</span>
              <span style="font-size:.66rem;font-weight:800;letter-spacing:.04em">${court}</span>
            </span>
            <span style="display:flex;flex-direction:column;gap:5px;justify-content:center">
              <span style="font-size:.82rem;font-weight:800;color:var(--texte-3)">${texte(d.organisme)}</span>
              <span class="carte-titre" style="font-size:1.05rem">${texte(d.demarche)}</span>
              ${badgeStatut(demarcheTerminee(d) ? 'termine' : d.statut)}
            </span>
          </a>`;
        }).join('')}
      </div>`).join('')}
  </div>`
  : calendrier(avecDate)}
  `;
  return { titre: 'Mes échéances — LifeOS', html, onglets: true };
}

function calendrier(documents) {
  const aujourdhui = new Date();
  const annee = aujourdhui.getFullYear();
  const mois = aujourdhui.getMonth();
  const premier = new Date(annee, mois, 1);
  const decalage = (premier.getDay() + 6) % 7; // semaine commençant lundi
  const nbJours = new Date(annee, mois + 1, 0).getDate();
  const nomMois = premier.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const reperes = {};
  documents.forEach((d) => {
    const date = new Date(d.echeance + 'T00:00:00');
    if (date.getFullYear() === annee && date.getMonth() === mois) reperes[date.getDate()] = d;
  });

  let cases = '';
  for (let i = 0; i < decalage; i++) cases += '<span></span>';
  for (let j = 1; j <= nbJours; j++) {
    const doc = reperes[j];
    const estAujourdhui = j === aujourdhui.getDate();
    let style = 'display:flex;align-items:center;justify-content:center;height:40px;border-radius:12px;font-size:.9rem;font-weight:600';
    if (estAujourdhui) style += ';background:var(--lavande-clair);color:var(--lavande-fonce);font-weight:800;border:1.5px solid var(--lavande)';
    if (doc) {
      const s = STATUTS[demarcheTerminee(doc) ? 'termine' : doc.statut];
      style = `display:flex;align-items:center;justify-content:center;height:40px;border-radius:12px;font-size:.9rem;font-weight:800;background:${s.couleur};color:#fff`;
    }
    const contenu = doc
      ? `<a href="#/document/${doc.id}" style="${style};width:100%;color:#fff" aria-label="${texte(dateCourte(doc.echeance))} : ${texte(doc.demarche)}">${j}</a>`
      : `<span style="${style}">${j}</span>`;
    cases += contenu;
  }

  return `
  <div class="carte">
    <div class="rangee-entre">
      <h2 style="font-size:1.1rem;text-transform:capitalize">${texte(nomMois)}</h2>
    </div>
    <div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px">
      ${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((j) => `<span style="text-align:center;font-size:.76rem;font-weight:800;color:#8B8896">${j}</span>`).join('')}
      ${cases}
    </div>
    <div class="pile-s" style="padding-top:6px">
      ${documents.map((d) => {
        const s = STATUTS[demarcheTerminee(d) ? 'termine' : d.statut];
        return `<span class="rangee" style="gap:9px;font-size:.86rem;color:var(--texte-2)">
          <span style="display:block;width:10px;height:10px;border-radius:99px;background:${s.couleur}"></span>
          ${texte(dateCourte(d.echeance))} — ${texte(d.organisme)} : ${texte(d.demarche)}
        </span>`;
      }).join('')}
    </div>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* Mes documents                                                       */
/* ------------------------------------------------------------------ */

export function documents() {
  const categorie = local.categorie || 'Tous';
  const recherche = (local.recherche || '').toLowerCase();
  let liste = categorie === 'Tous' ? DOCUMENTS : DOCUMENTS.filter((d) => d.categorie === categorie);
  if (recherche) {
    liste = liste.filter((d) => (d.organisme + ' ' + d.objet + ' ' + d.demarche).toLowerCase().includes(recherche));
  }

  const html = `
  <h1 style="font-size:1.6rem;margin-bottom:14px">Mes documents</h1>

  <div class="rangee" style="gap:10px;padding:0 16px;background:#fff;border:1.5px solid var(--bordure-forte);border-radius:16px;margin-bottom:14px">
    ${icone('recherche', { taille: 20, couleur: '#6E6C7A' })}
    <label class="visuellement-cache" for="recherche">Rechercher un document</label>
    <input id="recherche" type="search" placeholder="Rechercher un document…" value="${texte(local.recherche || '')}"
           data-action="recherche" style="border:none;background:transparent" autocomplete="off">
  </div>

  <div class="puces" style="margin-bottom:14px">
    ${CATEGORIES.map((c) => `<button type="button" class="puce" aria-pressed="${c === categorie}" data-action="categorie" data-valeur="${texte(c)}">${texte(c)}</button>`).join('')}
  </div>

  <ul class="pile-s">
    ${liste.length ? liste.map((d) => {
      const s = STATUTS[demarcheTerminee(d) ? 'termine' : d.statut];
      return `
      <li>
        <a class="carte" href="#/document/${d.id}" style="flex-direction:row;gap:14px">
          <span class="vignette vignette--haute" style="background:${d.teinte.fond};color:${d.teinte.texte}">${texte(d.initiales)}</span>
          <span style="display:flex;flex-direction:column;gap:6px;flex-grow:1">
            <span class="carte-titre" style="font-size:1.05rem">${texte(d.organisme)}</span>
            <span style="font-size:.92rem;color:var(--texte-2)">${texte(d.objet)}</span>
            <span style="font-size:.8rem;color:var(--texte-4)">Reçu le ${texte(dateLongue(d.recuLe))}</span>
            <span class="rangee" style="flex-wrap:wrap;gap:7px">
              ${badgeStatut(demarcheTerminee(d) ? 'termine' : d.statut)}
              ${d.echeance ? `<span class="statut statut--archive">${icone('calendrier', { taille: 13, epaisseur: 2.2 })}Avant le ${texte(dateCourte(d.echeance))}</span>` : ''}
            </span>
          </span>
        </a>
      </li>`;
    }).join('')
    : `<li class="carte" style="align-items:center;text-align:center;padding:30px;border-style:dashed">
         <p style="font-weight:700">Aucun document</p>
         <p class="carte-detail">Aucun document ne correspond à cette recherche.</p>
       </li>`}
  </ul>`;

  function apres() {
    const champ = document.getElementById('recherche');
    if (champ && local.focusRecherche) {
      champ.focus();
      champ.setSelectionRange(champ.value.length, champ.value.length);
    }
  }

  return { titre: 'Mes documents — LifeOS', html, onglets: true, apres };
}

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export function notifications() {
  const etat = lire();
  const html = `
  ${enteteEcran('Notifications', '#/tableau-de-bord',
    `<a class="bouton-icone" href="#/parametres" aria-label="Réglages des notifications">${icone('reglages', { taille: 20 })}</a>`)}

  <div class="pile">
    ${NOTIFICATIONS.map((n) => {
      const s = STATUTS[n.ton];
      const lue = etat.notificationsLues.includes(n.id);
      return `
      <div class="carte ${lue ? 'carte--plate' : ''}" style="flex-direction:row;gap:13px;${lue ? '' : 'border-color:#E0DBF4'}">
        <span class="vignette" style="background:${s.fond};color:${s.texte}">${icone(s.icone, { taille: 20, couleur: s.texte, epaisseur: 2.1 })}</span>
        <span style="display:flex;flex-direction:column;gap:6px;flex-grow:1">
          <span class="rangee-entre">
            <strong style="font-size:1rem">${texte(n.titre)}</strong>
            <span style="font-size:.78rem;color:#8B8896;white-space:nowrap">${texte(n.quand)}</span>
          </span>
          <span style="font-size:.92rem;color:var(--texte-2)">${texte(n.texte)}</span>
          <a class="puce" href="${n.lien}" style="align-self:flex-start;display:inline-flex;align-items:center;min-height:44px">${texte(n.action)}</a>
        </span>
      </div>`;
    }).join('')}

    <button type="button" class="bouton bouton--secondaire bouton--bloc" data-action="tout-lu">
      ${icone('coche', { taille: 19, epaisseur: 2.2 })}Tout marquer comme lu
    </button>

    <div class="carte carte--lavande" style="flex-direction:row;gap:10px">
      ${icone('cloche', { taille: 20, couleur: '#5A48B8' })}
      <span style="flex-grow:1">
        <strong style="display:block;color:#3F3372">Recevoir les rappels sur cet appareil</strong>
        <span style="font-size:.88rem;color:#4A4757">Autorisez les notifications pour être prévenu avant vos échéances.</span>
      </span>
      <button type="button" class="puce" data-action="autoriser-notifications">Autoriser</button>
    </div>
  </div>`;
  return { titre: 'Notifications — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Langue de l'explication                                             */
/* ------------------------------------------------------------------ */

export function langue() {
  const etat = lire();
  const choisie = LANGUES.find((l) => l.code === etat.langue) || LANGUES[0];
  const exemple = DOCUMENTS[0];
  const apercu = exemple.enClair[choisie.code] || exemple.enClair.fr;

  const html = `
  ${enteteEcran('Langue de l\'explication', '#/parametres')}
  <div class="pile">
    <p style="color:var(--texte-3)">LifeOS reste en français. Choisissez la langue dans laquelle vous souhaitez que vos documents vous soient expliqués.</p>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">
      ${LANGUES.map((l) => {
        const active = l.code === choisie.code;
        return `
        <button type="button" aria-pressed="${active}" data-action="choisir-langue" data-code="${l.code}"
          style="display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:64px;padding:13px 15px;border-radius:16px;text-align:left;
                 background:${active ? 'var(--lavande)' : '#fff'};color:${active ? '#fff' : 'var(--anthracite)'};border:1.5px solid ${active ? 'var(--lavande)' : 'var(--bordure-forte)'}">
          <span style="display:flex;flex-direction:column;gap:3px">
            <span style="font-weight:700">${texte(l.nom)}</span>
            <span style="font-size:.76rem;font-weight:600;color:${active ? '#DDD6F7' : 'var(--texte-4)'}">${texte(l.sousTitre)}</span>
          </span>
          ${active ? icone('coche', { taille: 20, couleur: '#fff', epaisseur: 2.6 }) : ''}
        </button>`;
      }).join('')}
    </div>

    <div class="carte">
      <div class="rangee" style="gap:9px">
        ${icone('etincelle', { taille: 20, couleur: '#5A48B8' })}
        <h2 style="font-size:1.05rem">Aperçu de l'explication</h2>
      </div>
      <p style="font-size:.85rem;font-weight:700;color:var(--texte-4)">${texte(exemple.organisme)} — ${texte(exemple.demarche)}</p>
      <p lang="${choisie.code}" dir="${choisie.rtl ? 'rtl' : 'ltr'}"
         style="padding:16px;background:var(--creme);border-radius:16px;line-height:1.65${choisie.rtl ? ';text-align:right' : ''}">${texte(apercu)}</p>
      <p style="font-size:.84rem;color:var(--texte-4)">LifeOS ne traduit pas mot à mot : il réécrit le document en phrases simples dans la langue choisie.</p>
    </div>

    <div class="carte carte--lavande" style="flex-direction:row;gap:10px">
      ${icone('info', { taille: 20, couleur: '#5A48B8' })}
      <p style="font-size:.9rem;color:#3F3372">L'interface de LifeOS (menus, boutons, réglages) reste en français. Seules les explications de vos documents changent de langue.</p>
    </div>

    <a class="bouton bouton--bloc" href="#/tableau-de-bord">Enregistrer ce choix</a>
  </div>`;
  return { titre: 'Langue — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Lecture facile et accessibilité                                     */
/* ------------------------------------------------------------------ */

export function accessibilite() {
  const etat = lire();
  const exemple = DOCUMENTS[0];
  const apercu = etat.lectureFacile ? exemple.enClairFacile : exemple.enClair.fr;

  const html = `
  ${enteteEcran('Lecture et accessibilité', '#/parametres')}
  <div class="pile">
    <div class="carte" style="flex-direction:row;align-items:center;gap:14px">
      <span class="vignette" style="background:var(--lavande-clair);color:var(--lavande-fonce)">${icone('texte', { taille: 22, couleur: '#4737A0' })}</span>
      <span style="display:flex;flex-direction:column;gap:3px;flex-grow:1">
        <strong>Mode lecture facile</strong>
        <span class="carte-detail">Texte plus grand et explications encore plus simples.</span>
      </span>
      <button type="button" class="interrupteur" role="switch" aria-checked="${etat.lectureFacile}"
              aria-label="Mode lecture facile" data-action="basculer-lecture-facile"><span></span></button>
    </div>

    <div class="carte">
      <h2 style="font-size:1.05rem">Taille du texte</h2>
      <div class="rangee" style="gap:8px">
        ${[[1, 'Normal', '.95rem'], [1.15, 'Grand', '1.08rem'], [1.32, 'Très grand', '1.2rem']].map(([v, nom, taille]) => `
          <button type="button" class="puce" style="flex-grow:1;justify-content:center;font-size:${taille}" aria-pressed="${etat.tailleTexte === v}"
                  data-action="taille-texte" data-valeur="${v}">${nom}</button>`).join('')}
      </div>
    </div>

    <h2 class="titre-section">Aperçu</h2>
    <div class="carte">
      ${badgeStatut('action')}
      <span class="carte-titre">${texte(exemple.organisme)}</span>
      <p>${texte(apercu)}</p>
      <p style="font-weight:700;color:#A4382D">${etat.lectureFacile ? 'À faire avant le 28 septembre.' : 'Date limite : ' + texte(dateLongue(exemple.echeance))}</p>
    </div>

    <div class="carte">
      <h2 style="font-size:1.05rem">Ce que le mode change</h2>
      ${['Des phrases plus courtes, une idée par phrase.',
         'Aucun mot administratif sans explication.',
         'Des textes plus grands et plus espacés.']
        .map((t) => `<span class="rangee" style="align-items:flex-start;gap:10px;color:var(--texte-2)">${icone('coche', { taille: 18, couleur: '#2F7D57', epaisseur: 2.6 })}${t}</span>`).join('')}
    </div>

    <a class="bouton bouton--bloc" href="#/tableau-de-bord">Enregistrer mes réglages</a>
  </div>`;
  return { titre: 'Accessibilité — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Paramètres et confidentialité                                       */
/* ------------------------------------------------------------------ */

export function parametres() {
  const etat = lire();
  const compte = etat.compte || UTILISATEUR;
  const langueNom = (LANGUES.find((l) => l.code === etat.langue) || LANGUES[0]).nom;
  const lignes = [
    ['rappels', 'Rappels de démarches', '7 jours, 2 jours et le jour même.'],
    ['analyses', 'Nouveau document analysé', 'Quand une analyse est terminée.'],
    ['resume', 'Résumé hebdomadaire', 'Chaque lundi matin.']
  ];

  const html = `
  ${enteteEcran('Paramètres', '#/tableau-de-bord')}
  <div class="pile">
    <div class="carte" style="flex-direction:row;align-items:center;gap:14px">
      <span class="vignette" style="width:54px;height:54px;border-radius:18px;background:var(--lavande-clair);color:var(--lavande-fonce);font-size:1.15rem">${texte(compte.prenom.slice(0, 1))}</span>
      <span style="display:flex;flex-direction:column;gap:3px;flex-grow:1">
        <strong style="font-family:'Outfit',sans-serif;font-size:1.1rem">${texte(compte.prenom)}</strong>
        <span class="carte-detail">${texte(compte.email)}</span>
      </span>
    </div>

    <h2 class="titre-section">Rappels</h2>
    <div class="carte" style="padding:0;gap:0;overflow:hidden">
      ${lignes.map(([cle, titre, detail]) => `
        <div class="ligne-reglage">
          <span style="display:flex;flex-direction:column;gap:3px;flex-grow:1">
            <strong>${titre}</strong>
            <span class="carte-detail" style="font-size:.84rem">${detail}</span>
          </span>
          <button type="button" class="interrupteur" role="switch" aria-checked="${Boolean(etat.reglages[cle])}"
                  aria-label="${titre}" data-action="basculer-reglage" data-cle="${cle}"><span></span></button>
        </div>`).join('')}
    </div>

    <h2 class="titre-section">Lecture et langue</h2>
    <div class="liste-liens">
      <a href="#/langue">${icone('globe', { taille: 21, couleur: '#3A57A8' })}<span style="flex-grow:1">Langue de l'explication</span>
        <span style="font-weight:600;color:var(--texte-3)">${texte(langueNom)}</span>${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}</a>
      <a href="#/accessibilite">${icone('texte', { taille: 21, couleur: '#4737A0' })}<span style="flex-grow:1">Mode lecture facile</span>
        <span style="font-weight:600;color:var(--texte-3)">${etat.lectureFacile ? 'Activé' : 'Désactivé'}</span>${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}</a>
    </div>

    <h2 class="titre-section">Application</h2>
    <a class="bandeau-install" href="#/installer">
      ${icone('telephone', { taille: 22, couleur: '#4737A0' })}
      <span style="display:flex;flex-direction:column;gap:3px;flex-grow:1">
        <strong>Installer LifeOS sur cet appareil</strong>
        <span style="font-size:.86rem;color:var(--texte-2)">Ouvrez LifeOS depuis votre écran d'accueil.</span>
      </span>
      ${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}
    </a>

    <h2 class="titre-section">Confidentialité</h2>
    <div class="carte">
      <div class="rangee" style="gap:10px">
        ${icone('cadenas', { taille: 20, couleur: '#5A48B8' })}
        <h3 style="font-size:1.05rem">Vos documents vous appartiennent.</h3>
      </div>
      <p style="color:var(--texte-2);font-size:.94rem">Vos documents servent uniquement à vous expliquer vos démarches. Vous pouvez les consulter, les exporter ou les supprimer quand vous le souhaitez.</p>
      <button type="button" class="bouton bouton--secondaire bouton--bloc" style="justify-content:space-between;min-height:52px" data-action="exporter-donnees">
        Gérer mes données${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}</button>
      <button type="button" class="bouton bouton--danger bouton--bloc" style="justify-content:space-between;min-height:52px" data-action="supprimer-donnees">
        Supprimer mes données${icone('corbeille', { taille: 18, couleur: '#9C362B' })}</button>
    </div>

    <div class="liste-liens">
      <button type="button" data-action="aide">${icone('aide', { taille: 21 })}<span style="flex-grow:1">Aide et questions fréquentes</span>${icone('chevron', { taille: 18, couleur: '#6E6C7A', epaisseur: 2.2 })}</button>
      <button type="button" style="color:#9C362B" data-action="deconnexion">${icone('deconnexion', { taille: 21, couleur: '#9C362B' })}Me déconnecter</button>
    </div>

    <p class="note-bas">LifeOS est un service indépendant. LifeOS n'est pas un service officiel de France Travail, de la CAF, des Impôts, de l'Assurance Maladie ou d'une préfecture.</p>
  </div>`;
  return { titre: 'Paramètres — LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */
/* Installation (PWA)                                                  */
/* ------------------------------------------------------------------ */

export function installer() {
  const deja = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  const html = `
  ${enteteEcran('Installer LifeOS', '#/parametres')}
  <div class="pile">
    ${deja ? `
    <div class="carte" style="background:var(--vert-clair);border:none;align-items:center;text-align:center;padding:26px">
      ${icone('coche', { taille: 38, couleur: '#2F7D57', epaisseur: 2.6 })}
      <h2 style="font-size:1.3rem;color:#1B5138">LifeOS est déjà installée</h2>
      <p style="color:#2C4F3E">Vous utilisez LifeOS depuis votre écran d'accueil.</p>
    </div>` : `
    <div class="carte carte--lavande surgit" style="align-items:center;text-align:center;padding:26px">
      ${logo(78)}
      <h2 style="font-size:1.35rem;color:#2F2B45">LifeOS sur votre écran d'accueil</h2>
      <p style="color:#3F3372">Installez LifeOS comme une application : un appui suffit pour photographier un courrier, sans passer par votre navigateur.</p>
      <button type="button" class="bouton bouton--bloc" data-action="installer">${icone('telecharger', { taille: 20, couleur: '#fff' })}Installer maintenant</button>
    </div>`}

    <h2 class="titre-section">Si l'installation ne se lance pas</h2>
    <ol class="pile-s">
      ${['Ouvrez le menu de votre navigateur.',
         'Choisissez « Ajouter à l’écran d’accueil ».',
         'Confirmez : l’icône LifeOS apparaît avec vos applications.']
        .map((t, i) => `
        <li class="carte carte--plate" style="flex-direction:row;align-items:center;gap:13px">
          <span class="etape-case" style="background:var(--lavande-clair);border-color:transparent;color:var(--lavande-fonce)">${i + 1}</span>
          <span>${texte(t)}</span>
        </li>`).join('')}
    </ol>

    <div class="carte">
      <h2 style="font-size:1.05rem">Une fois installée</h2>
      ${['L’appareil photo s’ouvre directement depuis l’icône.',
         'Les rappels d’échéance arrivent sur votre téléphone.',
         'Vos explications déjà lues restent consultables hors connexion.']
        .map((t) => `<span class="rangee" style="align-items:flex-start;gap:11px;color:var(--texte-2)">${icone('coche', { taille: 19, couleur: '#2F7D57', epaisseur: 2.4 })}${texte(t)}</span>`).join('')}
    </div>

    <div class="carte" style="background:var(--orange-clair);border:none;flex-direction:row;gap:11px">
      ${icone('reseau', { taille: 21, couleur: '#8A5310' })}
      <span style="display:flex;flex-direction:column;gap:4px">
        <strong style="color:#6F4310">Sans connexion</strong>
        <span style="color:#6F4310;font-size:.92rem">Vous pouvez relire vos démarches et vos explications. L'analyse d'un nouveau document reprendra dès le retour du réseau.</span>
      </span>
    </div>

    <a class="bouton bouton--secondaire bouton--bloc" href="#/tableau-de-bord">Plus tard</a>
  </div>`;
  return { titre: 'Installer LifeOS', html, onglets: true };
}

/* ------------------------------------------------------------------ */

export function introuvable() {
  const html = `
  ${enteteEcran('Page introuvable', '#/tableau-de-bord')}
  <div class="carte" style="align-items:center;text-align:center;padding:30px">
    ${icone('fichier', { taille: 40, couleur: '#C9C3B8', epaisseur: 1.8 })}
    <p style="font-weight:700">Cette page n'existe pas.</p>
    <a class="bouton bouton--bloc" href="#/tableau-de-bord">Revenir à l'accueil</a>
  </div>`;
  return { titre: 'Page introuvable — LifeOS', html, onglets: false };
}

/* Accès à l'état transitoire pour app.js */
export function etatLocal() { return local; }
