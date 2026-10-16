/* Applique les migrations en attente : `pnpm db:migrate`. */

import { migrerBase } from '../serveur/db/migrer';

migrerBase()
  .then(() => console.log('Base de données à jour.'))
  .catch((erreur) => {
    console.error(erreur);
    process.exit(1);
  });
