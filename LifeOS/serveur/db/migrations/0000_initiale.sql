CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`utilisateur_id` text NOT NULL,
	`slug` text NOT NULL,
	`organisme` text NOT NULL,
	`initiales` text NOT NULL,
	`categorie` text NOT NULL,
	`objet` text NOT NULL,
	`demarche` text NOT NULL,
	`recu_le` text NOT NULL,
	`echeance` text,
	`statut` text NOT NULL,
	`teinte_fond` text NOT NULL,
	`teinte_texte` text NOT NULL,
	`en_clair` text NOT NULL,
	`en_clair_facile` text NOT NULL,
	`extrait` text NOT NULL,
	`extrait_explique` text NOT NULL,
	`etapes` text NOT NULL,
	`etapes_faites` text NOT NULL,
	`questions` text NOT NULL,
	`rappels` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_utilisateur_slug_idx` ON `documents` (`utilisateur_id`,`slug`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`utilisateur_id` text NOT NULL,
	`titre` text NOT NULL,
	`texte` text NOT NULL,
	`ton` text NOT NULL,
	`lien` text NOT NULL,
	`action` text NOT NULL,
	`lue` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `notifications_utilisateur_idx` ON `notifications` (`utilisateur_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`utilisateur_id` text NOT NULL,
	`expire_le` integer NOT NULL,
	FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_utilisateur_idx` ON `sessions` (`utilisateur_id`);--> statement-breakpoint
CREATE TABLE `utilisateurs` (
	`id` text PRIMARY KEY NOT NULL,
	`prenom` text NOT NULL,
	`email` text NOT NULL,
	`mot_de_passe` text NOT NULL,
	`onboarding_vu` integer DEFAULT false NOT NULL,
	`langue` text DEFAULT 'fr' NOT NULL,
	`lecture_facile` integer DEFAULT false NOT NULL,
	`taille_texte` real DEFAULT 1 NOT NULL,
	`reglage_rappels` integer DEFAULT true NOT NULL,
	`reglage_analyses` integer DEFAULT true NOT NULL,
	`reglage_resume` integer DEFAULT false NOT NULL,
	`install_masque` integer DEFAULT false NOT NULL,
	`cree_le` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `utilisateurs_email_unique` ON `utilisateurs` (`email`);