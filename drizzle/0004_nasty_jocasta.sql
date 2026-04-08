ALTER TABLE `memberships` ADD `isGift` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `memberships` ADD `giftFromName` varchar(255);--> statement-breakpoint
ALTER TABLE `memberships` ADD `giftFromEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `memberships` ADD `giftMessage` text;