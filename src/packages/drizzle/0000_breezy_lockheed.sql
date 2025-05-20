CREATE TABLE `book` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`target_url` text NOT NULL,
	`image_url` text,
	`added_at` integer NOT NULL
);
