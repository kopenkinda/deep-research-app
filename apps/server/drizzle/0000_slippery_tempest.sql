CREATE TABLE `research_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`topic` text NOT NULL,
	`breadth` integer DEFAULT 4 NOT NULL,
	`width` integer DEFAULT 2 NOT NULL
);
