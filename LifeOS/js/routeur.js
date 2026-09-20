/* Routeur minimal basé sur le fragment d'URL (#/chemin).
   Le rendu est branché depuis app.js pour éviter les imports circulaires. */

let rendre = null;
const minuteries = [];

export function definirRendu(fn) {
  rendre = fn;
}

export function rafraichir() {
  if (rendre) rendre();
}

export function naviguer(chemin) {
  if (location.hash === chemin) rafraichir();
  else location.hash = chemin;
}

export function cheminActuel() {
  const brut = location.hash.replace(/^#/, '');
  return brut && brut.startsWith('/') ? brut : '/';
}

export function segments() {
  return cheminActuel().split('/').filter(Boolean);
}

/** Minuteries liées à l'écran courant : annulées à chaque changement d'écran. */
export function minuterie(fn, delai) {
  minuteries.push(setTimeout(fn, delai));
}

export function annulerMinuteries() {
  while (minuteries.length) clearTimeout(minuteries.pop());
}
