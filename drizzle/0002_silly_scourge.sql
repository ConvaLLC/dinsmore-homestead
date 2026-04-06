CREATE TABLE `memberships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int,
	`memberName` varchar(255) NOT NULL,
	`memberEmail` varchar(320) NOT NULL,
	`tier` enum('senior','individual','family','friends') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('active','expired','cancelled') NOT NULL DEFAULT 'active',
	`startsAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_orderId_ticket_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `ticket_orders`(`id`) ON DELETE no action ON UPDATE no action;