/* Empreinte des mots de passe avec scrypt (inclus dans Node.js, aucune dépendance). */

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt) as (motDePasse: string, sel: Buffer, longueur: number) => Promise<Buffer>;
const LONGUEUR = 64;

/** Renvoie « scrypt$sel$empreinte », à stocker en base. */
export async function hacherMotDePasse(motDePasse: string): Promise<string> {
  const sel = randomBytes(16);
  const empreinte = await scryptAsync(motDePasse, sel, LONGUEUR);
  return `scrypt$${sel.toString('base64url')}$${empreinte.toString('base64url')}`;
}

export async function verifierMotDePasse(motDePasse: string, stocke: string): Promise<boolean> {
  const [algo, sel, empreinte] = stocke.split('$');
  if (algo !== 'scrypt' || !sel || !empreinte) return false;
  const attendu = Buffer.from(empreinte, 'base64url');
  const calcule = await scryptAsync(motDePasse, Buffer.from(sel, 'base64url'), attendu.length);
  return timingSafeEqual(attendu, calcule);
}
