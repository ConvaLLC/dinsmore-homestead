CREATE TABLE `donations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`donorName` varchar(255) NOT NULL,
	`donorEmail` varchar(320) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`donationType` enum('one_time','recurring') NOT NULL DEFAULT 'one_time',
	`frequency` enum('monthly','quarterly','annually'),
	`dedicationName` varchar(255),
	`message` text,
	`paypalOrderId` varchar(100),
	`paypalCaptureId` varchar(100),
	`paypalSubscriptionId` varchar(100),
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`anonymous` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `donations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `education_access_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`organization` varchar(255),
	`role` varchar(100),
	`reason` text,
	`verificationCode` varchar(8),
	`codeExpiresAt` timestamp,
	`verified` boolean NOT NULL DEFAULT false,
	`verifiedAt` timestamp,
	`approved` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `education_access_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `education_access_requests_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `education_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`category` enum('lesson_plan','research','resource','newsletter','program') NOT NULL,
	`gradeLevel` varchar(100),
	`subject` varchar(100),
	`content` text NOT NULL,
	`fileUrl` text,
	`thumbnailUrl` text,
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `education_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `education_content_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `email_verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`code` varchar(8) NOT NULL,
	`purpose` enum('education_access','registration') NOT NULL,
	`used` boolean NOT NULL DEFAULT false,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_timeslots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`slotDate` timestamp NOT NULL,
	`startTime` varchar(8) NOT NULL,
	`endTime` varchar(8),
	`capacity` int NOT NULL,
	`ticketsSold` int NOT NULL DEFAULT 0,
	`price` decimal(10,2),
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_timeslots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`imageUrl` text,
	`eventType` enum('tour','special_event','fundraiser','program','private') NOT NULL DEFAULT 'special_event',
	`basePrice` decimal(10,2) NOT NULL DEFAULT '0.00',
	`startDate` timestamp NOT NULL,
	`endDate` timestamp,
	`usesTimeslots` boolean NOT NULL DEFAULT true,
	`defaultCapacity` int NOT NULL DEFAULT 20,
	`active` boolean NOT NULL DEFAULT true,
	`featured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `hero_slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`subtitle` text,
	`imageUrl` text NOT NULL,
	`linkUrl` varchar(500),
	`linkText` varchar(100),
	`sortOrder` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderNumber` varchar(32) NOT NULL,
	`eventId` int NOT NULL,
	`timeslotId` int,
	`buyerName` varchar(255) NOT NULL,
	`buyerEmail` varchar(320) NOT NULL,
	`buyerPhone` varchar(20),
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`paypalOrderId` varchar(100),
	`paypalCaptureId` varchar(100),
	`status` enum('pending','paid','cancelled','refunded') NOT NULL DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `ticket_orders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','educator') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `educationVerified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `educationVerifiedAt` timestamp;--> statement-breakpoint
ALTER TABLE `event_timeslots` ADD CONSTRAINT `event_timeslots_eventId_events_id_fk` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_orders` ADD CONSTRAINT `ticket_orders_eventId_events_id_fk` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `ticket_orders` ADD CONSTRAINT `ticket_orders_timeslotId_event_timeslots_id_fk` FOREIGN KEY (`timeslotId`) REFERENCES `event_timeslots`(`id`) ON DELETE no action ON UPDATE no action;