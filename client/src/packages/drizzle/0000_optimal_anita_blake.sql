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
	`purchase_date` integer NOT NULL
);
