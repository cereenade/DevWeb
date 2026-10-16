/* Schéma de la base de données LifeOS (SQLite).
   Après une modification : `pnpm db:generate` crée la migration, appliquée au prochain démarrage. */

import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import type { CleStatut, Question } from '@/lib/data';

const maintenant = sql`(unixepoch())`;

export const utilisateurs = sqliteTable('utilisateurs', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  prenom: text('prenom').notNull(),
  email: text('email').notNull().unique(),
  motDePasse: text('mot_de_passe').notNull(),             // empreinte scrypt, jamais le mot de passe lui-même
  onboardingVu: integer('onboarding_vu', { mode: 'boolean' }).notNull().default(false),
  langue: text('langue').notNull().default('fr'),
  lectureFacile: integer('lecture_facile', { mode: 'boolean' }).notNull().default(false),
  tailleTexte: real('taille_texte').notNull().default(1),
  reglageRappels: integer('reglage_rappels', { mode: 'boolean' }).notNull().default(true),
  reglageAnalyses: integer('reglage_analyses', { mode: 'boolean' }).notNull().default(true),
  reglageResume: integer('reglage_resume', { mode: 'boolean' }).notNull().default(false),
  installMasque: integer('install_masque', { mode: 'boolean' }).notNull().default(false),
  creeLe: integer('cree_le', { mode: 'timestamp' }).notNull().default(maintenant)
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),                              // empreinte SHA-256 du jeton du cookie
  utilisateurId: text('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  expireLe: integer('expire_le', { mode: 'timestamp' }).notNull()
}, (t) => [index('sessions_utilisateur_idx').on(t.utilisateurId)]);

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  utilisateurId: text('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  slug: text('slug').notNull(),                             // identifiant lisible, utilisé dans les adresses
  organisme: text('organisme').notNull(),
  initiales: text('initiales').notNull(),
  categorie: text('categorie').notNull(),
  objet: text('objet').notNull(),
  demarche: text('demarche').notNull(),
  recuLe: text('recu_le').notNull(),                        // date ISO « 2026-09-18 »
  echeance: text('echeance'),
  statut: text('statut').$type<CleStatut>().notNull(),
  teinteFond: text('teinte_fond').notNull(),
  teinteTexte: text('teinte_texte').notNull(),
  enClair: text('en_clair', { mode: 'json' }).$type<Record<string, string>>().notNull(),
  enClairFacile: text('en_clair_facile').notNull(),
  extrait: text('extrait').notNull(),
  extraitExplique: text('extrait_explique').notNull(),
  etapes: text('etapes', { mode: 'json' }).$type<string[]>().notNull(),
  etapesFaites: text('etapes_faites', { mode: 'json' }).$type<boolean[]>().notNull(),
  questions: text('questions', { mode: 'json' }).$type<Question[]>().notNull(),
  rappels: integer('rappels', { mode: 'boolean' }).notNull().default(false),
  creeLe: integer('cree_le', { mode: 'timestamp' }).notNull().default(maintenant)
}, (t) => [uniqueIndex('documents_utilisateur_slug_idx').on(t.utilisateurId, t.slug)]);

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  utilisateurId: text('utilisateur_id').notNull().references(() => utilisateurs.id, { onDelete: 'cascade' }),
  titre: text('titre').notNull(),
  texte: text('texte').notNull(),
  ton: text('ton').$type<CleStatut>().notNull(),
  lien: text('lien').notNull(),
  action: text('action').notNull(),
  lue: integer('lue', { mode: 'boolean' }).notNull().default(false),
  creeLe: integer('cree_le', { mode: 'timestamp' }).notNull().default(maintenant)
}, (t) => [index('notifications_utilisateur_idx').on(t.utilisateurId)]);
