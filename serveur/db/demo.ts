/* Copie les documents et notifications de démonstration dans le compte d'une personne. */

import { and, eq } from 'drizzle-orm';
import { DOCUMENTS_DEMO, NOTIFICATIONS_DEMO } from '@/lib/demo';
import type { ModeleDocument } from '@/lib/data';
import { db } from './index';
import { documents, notifications } from './schema';

function ligneDocument(utilisateurId: string, modele: ModeleDocument) {
  const { teinte, ...reste } = modele;
  return {
    ...reste,
    utilisateurId,
    teinteFond: teinte.fond,
    teinteTexte: teinte.texte,
    etapesFaites: modele.etapes.map(() => false)
  };
}

export async function creerContenuDemo(utilisateurId: string) {
  await db.insert(documents).values(DOCUMENTS_DEMO.map((m) => ligneDocument(utilisateurId, m)));
  await db.insert(notifications).values(NOTIFICATIONS_DEMO.map((n) => ({
    utilisateurId,
    titre: n.titre,
    texte: n.texte,
    ton: n.ton,
    lien: n.lien,
    action: n.action,
    creeLe: new Date(Date.now() - n.joursAvant * 86400000)
  })));
}

/** Ajoute un document d'exemple s'il n'est pas déjà dans le compte (analyse simulée). */
export async function ajouterDocumentDemo(utilisateurId: string, slug: string) {
  const modele = DOCUMENTS_DEMO.find((m) => m.slug === slug);
  if (!modele) return;
  const existant = await db.query.documents.findFirst({
    where: and(eq(documents.utilisateurId, utilisateurId), eq(documents.slug, slug)),
    columns: { id: true }
  });
  if (!existant) await db.insert(documents).values(ligneDocument(utilisateurId, modele));
}
