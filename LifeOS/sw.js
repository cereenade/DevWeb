/* Service worker de LifeOS.
   Objectif : l'application s'ouvre et reste lisible même sans connexion. */

const VERSION = 'lifeos-v1';
const CACHE_COQUILLE = `${VERSION}-coquille`;
const CACHE_EXTERNE = `${VERSION}-externe`;

/* Fichiers indispensables au démarrage de l'application. */
const COQUILLE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/vues.js',
  './js/routeur.js',
  './js/store.js',
  './js/data.js',
  './js/ui.js',
  './js/icones.js',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (evenement) => {
  evenement.waitUntil(
    caches.open(CACHE_COQUILLE)
      .then((cache) => cache.addAll(COQUILLE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(
        cles.filter((c) => !c.startsWith(VERSION)).map((c) => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evenement) => {
  const requete = evenement.request;
  if (requete.method !== 'GET') return;

  const url = new URL(requete.url);

  /* Navigation : on tente le réseau, puis on retombe sur la page mise en cache. */
  if (requete.mode === 'navigate') {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE_COQUILLE).then((cache) => cache.put('./index.html', copie));
          return reponse;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Polices Google : on sert la version en cache et on la rafraîchit en arrière-plan. */
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com')) {
    evenement.respondWith(
      caches.open(CACHE_EXTERNE).then(async (cache) => {
        const enCache = await cache.match(requete);
        const reseau = fetch(requete)
          .then((reponse) => { cache.put(requete, reponse.clone()); return reponse; })
          .catch(() => enCache);
        return enCache || reseau;
      })
    );
    return;
  }

  /* Fichiers de l'application : cache d'abord, réseau ensuite. */
  if (url.origin === self.location.origin) {
    evenement.respondWith(
      caches.match(requete).then((enCache) => enCache || fetch(requete).then((reponse) => {
        const copie = reponse.clone();
        caches.open(CACHE_COQUILLE).then((cache) => cache.put(requete, copie));
        return reponse;
      }))
    );
  }
});

/* Rappels d'échéance envoyés par un serveur (à brancher plus tard). */
self.addEventListener('push', (evenement) => {
  let donnees = { titre: 'LifeOS', corps: 'Vous avez une démarche à effectuer.', lien: './index.html#/tableau-de-bord' };
  try { donnees = Object.assign(donnees, evenement.data ? evenement.data.json() : {}); } catch (e) { /* charge utile libre */ }

  evenement.waitUntil(
    self.registration.showNotification(donnees.titre, {
      body: donnees.corps,
      lang: 'fr',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      data: { lien: donnees.lien },
      actions: [{ action: 'ouvrir', title: 'Voir les étapes' }]
    })
  );
});

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const lien = (evenement.notification.data && evenement.notification.data.lien) || './index.html';
  evenement.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
      const ouverte = fenetres.find((f) => 'focus' in f);
      if (ouverte) { ouverte.focus(); ouverte.navigate(lien); return; }
      return self.clients.openWindow(lien);
    })
  );
});
