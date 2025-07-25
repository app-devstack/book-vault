CREATE TABLE `books` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`title` text NOT NULL,
	`volume` integer,
	`image_url` text,
	`target_url` text NOT NULL,
	`description` text,
	`isbn` text,
	`author` text,
	`google_books_id` text,
	`purchase_date` integer NOT NULL,
	`series_id` text NOT NULL,
	`shop_id` text NOT NULL,
	FOREIGN KEY (`series_id`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`title` text NOT NULL,
	`author` text,
	`description` text,
	`thumbnail` text,
	`google_books_series_id` text
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
CREATE UNIQUE INDEX `shops_name_unique` ON `shops` (`name`);