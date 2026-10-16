/* Service worker de LifeOS.
   Objectif : l'application s'ouvre et reste lisible même sans connexion.
   Il n'est enregistré qu'en production (voir components/Demarrage.tsx). */

const VERSION = 'lifeos-v3';
const CACHE_COQUILLE = `${VERSION}-coquille`;
const CACHE_EXTERNE = `${VERSION}-externe`;

/* Pages publiques indispensables au démarrage. Les pages du compte et les fichiers
   /_next/static/ sont mis en cache au fil des visites. */
const COQUILLE = [
  '/',
  '/connexion',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

/* Pages de repli quand une adresse n'a jamais été visitée hors connexion. */
const REPLIS = ['/tableau-de-bord', '/'];

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
          caches.open(CACHE_COQUILLE).then((cache) => cache.put(requete, copie));
          return reponse;
        })
        .catch(async () => {
          for (const adresse of [requete, ...REPLIS]) {
            const enCache = await caches.match(adresse);
            if (enCache) return enCache;
          }
          return Response.error();
        })
    );
    return;
  }

  /* Les données personnelles exportées (API) ne sont jamais mises en cache. */
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  /* Fichiers versionnés par Next.js (leur nom change à chaque build) : cache d'abord. */
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    evenement.respondWith(
      caches.match(requete).then((enCache) => enCache || fetch(requete).then((reponse) => {
        const copie = reponse.clone();
        caches.open(CACHE_COQUILLE).then((cache) => cache.put(requete, copie));
        return reponse;
      }))
    );
    return;
  }

  /* Polices (servies par Next.js depuis /_next/static/media) et autres fichiers :
     réseau d'abord, cache en secours. Les données des pages (RSC) passent aussi par ici. */
  evenement.respondWith(
    caches.open(CACHE_EXTERNE).then((cache) =>
      fetch(requete)
        .then((reponse) => { if (reponse.ok) cache.put(requete, reponse.clone()); return reponse; })
        .catch(() => cache.match(requete))
    )
  );
});

/* Rappels d'échéance envoyés par un serveur (à brancher plus tard). */
self.addEventListener('push', (evenement) => {
  let donnees = { titre: 'LifeOS', corps: 'Vous avez une démarche à effectuer.', lien: '/tableau-de-bord' };
  try { donnees = Object.assign(donnees, evenement.data ? evenement.data.json() : {}); } catch { /* charge utile libre */ }

  evenement.waitUntil(
    self.registration.showNotification(donnees.titre, {
      body: donnees.corps,
      lang: 'fr',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { lien: donnees.lien },
      actions: [{ action: 'ouvrir', title: 'Voir les étapes' }]
    })
  );
});

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const lien = (evenement.notification.data && evenement.notification.data.lien) || '/';
  evenement.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
      const ouverte = fenetres.find((f) => 'focus' in f);
      if (ouverte) { ouverte.focus(); ouverte.navigate(lien); return; }
      return self.clients.openWindow(lien);
    })
  );
});
