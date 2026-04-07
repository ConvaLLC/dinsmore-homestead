ALTER TABLE `ticket_orders` ADD `cancelledAt` timestamp;--> statement-breakpoint
ALTER TABLE `ticket_orders` ADD `cancelledBy` varchar(255);--> statement-breakpoint
ALTER TABLE `ticket_orders` ADD `cancelReason` text;--> statement-breakpoint
ALTER TABLE `ticket_orders` ADD `refundAmount` decimal(10,2);