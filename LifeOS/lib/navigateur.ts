'use client';

/* Ce qui touche directement au navigateur : annonces aux lecteurs d'écran,
   notifications et invitation d'installation (PWA). */

import { useSyncExternalStore } from 'react';

/** Annonce un message aux lecteurs d'écran. */
export function annoncer(message: string) {
  const zone = document.getElementById('annonces');
  if (zone) zone.textContent = message;
}

/* ------------------------------------------------------------------ */
/* Notifications locales                                               */
/* ------------------------------------------------------------------ */

export function demanderNotifications() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') Notification.requestPermission();
}

export function notifierLocalement(titre: string, corps: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(titre, { body: corps, icon: '/icons/icon-192.png', lang: 'fr' });
  } catch { /* certains navigateurs exigent le service worker */ }
}

/* ------------------------------------------------------------------ */
/* Installation (PWA)                                                  */
/* ------------------------------------------------------------------ */

interface InvitationInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<unknown>;
}

let invitation: InvitationInstallation | null = null;
const abonnesInstall = new Set<() => void>();

function prevenirInstall() {
  abonnesInstall.forEach((fn) => fn());
}

/** À appeler une fois au démarrage (voir components/Demarrage.tsx). */
export function ecouterInstallation() {
  const avant = (ev: Event) => {
    ev.preventDefault();
    invitation = ev as InvitationInstallation;
    prevenirInstall();
  };
  const apres = () => {
    invitation = null;
    annoncer('LifeOS est installée sur votre appareil.');
    prevenirInstall();
  };
  window.addEventListener('beforeinstallprompt', avant);
  window.addEventListener('appinstalled', apres);
  return () => {
    window.removeEventListener('beforeinstallprompt', avant);
    window.removeEventListener('appinstalled', apres);
  };
}

/** Vrai quand le navigateur propose l'installation de LifeOS. */
export function useInstallable(): boolean {
  return useSyncExternalStore(
    (fn) => { abonnesInstall.add(fn); return () => abonnesInstall.delete(fn); },
    () => invitation !== null,
    () => false
  );
}

/**
 * Lance l'invitation d'installation si le navigateur en a fourni une.
 * Renvoie `false` sinon, pour que l'écran appelant affiche la marche à suivre.
 */
export async function lancerInstallation(): Promise<boolean> {
  if (!invitation) return false;
  const courante = invitation;
  courante.prompt();
  await courante.userChoice;
  invitation = null;
  prevenirInstall();
  return true;
}

export function dejaInstallee(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

