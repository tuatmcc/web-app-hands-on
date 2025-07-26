CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`content` text,
	`parent_id` text,
	`likes` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action
);
