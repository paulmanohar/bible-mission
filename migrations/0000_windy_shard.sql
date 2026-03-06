CREATE TABLE `blog_posts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`excerpt` text,
	`cover_image` text,
	`author` varchar(255) NOT NULL DEFAULT 'Bible Mission',
	`category` varchar(255) NOT NULL DEFAULT 'Devotional',
	`published` boolean NOT NULL DEFAULT false,
	`tags` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`author` varchar(255) NOT NULL DEFAULT 'M.Devadas Ayyagaru',
	`language` varchar(50) NOT NULL DEFAULT 'English',
	`category` varchar(255) NOT NULL,
	`description` text,
	`cover_image` text,
	`content_url` text,
	`tags` json,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`subject` varchar(500),
	`message` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`date` varchar(50) NOT NULL,
	`time` varchar(50),
	`location` varchar(500) NOT NULL,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`pastor_name` varchar(255),
	`poster_image` text,
	`approved` boolean NOT NULL DEFAULT false,
	`tags` json,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `livestreams` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`stream_url` text,
	`scheduled_at` varchar(100),
	`is_live` boolean NOT NULL DEFAULT false,
	`pastor_name` varchar(255),
	`tags` json,
	`category` varchar(255) DEFAULT 'Livestream',
	CONSTRAINT `livestreams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriptions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscriptions_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `pastor_applications` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`location` varchar(255) NOT NULL,
	`message` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pastor_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `podcasts` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`audio_url` text,
	`duration` varchar(50),
	`episode_number` int,
	`published` boolean NOT NULL DEFAULT false,
	`tags` json,
	`category` varchar(255) DEFAULT 'Podcast',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `podcasts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `prayer_requests` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(50),
	`request` text NOT NULL,
	`is_anonymous` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `prayer_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_index` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`source_type` varchar(50) NOT NULL,
	`source_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`author` varchar(255),
	`category` varchar(255),
	`tags` json,
	`language` varchar(50),
	`image_url` text,
	`slug` varchar(500),
	`date` varchar(50),
	`metadata` text,
	CONSTRAINT `search_index_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`phone` varchar(50),
	`location` varchar(255),
	`avatar_url` text,
	`subscribed` boolean NOT NULL DEFAULT false,
	`reset_token` varchar(255),
	`reset_token_expiry` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `idx_search_source` ON `search_index` (`source_type`,`source_id`);--> statement-breakpoint
CREATE INDEX `idx_search_category` ON `search_index` (`category`);--> statement-breakpoint
CREATE INDEX `idx_search_type` ON `search_index` (`source_type`);