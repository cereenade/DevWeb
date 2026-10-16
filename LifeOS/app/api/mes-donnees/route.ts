/* Export des données de la personne connectée (Paramètres → Gérer mes données). */

import { lireSession } from '@/serveur/session';
import { exportDeMesDonnees } from '@/serveur/donnees';

export async function GET() {
  if (!(await lireSession())) {
    return Response.json({ erreur: 'Non connecté' }, { status: 401 });
  }
  return new Response(JSON.stringify(await exportDeMesDonnees(), null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="mes-donnees-lifeos.json"'
    }
  });
}
