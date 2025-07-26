CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`content` text NOT NULL,
	`parent_id` text,
	`likes` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
