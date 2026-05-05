ALTER TABLE `promoCodes` ADD `currentUses` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `promoCodes` ADD `maxUses` int;--> statement-breakpoint
ALTER TABLE `promoCodes` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;