CREATE TABLE `series` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`description` text,
	`thumbnail` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `series_title_unique` ON `series` (`title`);--> statement-breakpoint
CREATE TABLE `shops` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`name` text NOT NULL,
	`display_name` text NOT NULL,
	`base_url` text,
	`logo_url` text,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shops_name_unique` ON `shops` (`name`);--> statement-breakpoint
ALTER TABLE `books` ADD `series_id` text NOT NULL REFERENCES series(id);--> statement-breakpoint
ALTER TABLE `books` ADD `shop_id` text NOT NULL REFERENCES shops(id);