-- OfferMatrix Database Schema
-- Generated for MariaDB 10.4.x

SET FOREIGN_KEY_CHECKS=0;

-- Enum-like tables are handled via VARCHAR/ENUM in MariaDB

CREATE TABLE IF NOT EXISTS `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('USER','ADMIN','MERCHANT') NOT NULL DEFAULT 'USER',
  `accountStatus` ENUM('ACTIVE','WARNING','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  `complainCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Deal` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `merchant` VARCHAR(191) NOT NULL,
  `sector` ENUM('FOOD','RIDE','SKINCARE') NOT NULL,
  `originalPrice` DOUBLE NOT NULL,
  `discountedPrice` DOUBLE NOT NULL,
  `discountPercent` DOUBLE NOT NULL,
  `couponCode` VARCHAR(191) NULL,
  `affiliateUrl` VARCHAR(191) NULL,
  `status` ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `validUntil` DATETIME(3) NULL,
  `submittedById` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Deal_submittedById_fkey` (`submittedById`),
  CONSTRAINT `Deal_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ScraperLog` (
  `id` VARCHAR(191) NOT NULL,
  `botName` VARCHAR(191) NOT NULL,
  `targetUrl` VARCHAR(191) NOT NULL,
  `status` ENUM('ONLINE','FAILING','THROTTLED','OFFLINE') NOT NULL,
  `responseLatencyMs` INT NOT NULL,
  `itemsScrapedCount` INT NOT NULL DEFAULT 0,
  `lastError` TEXT NULL,
  `lastRunAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AffiliateLink` (
  `id` VARCHAR(191) NOT NULL,
  `partnerName` VARCHAR(191) NOT NULL,
  `originalDomain` VARCHAR(191) NOT NULL,
  `commissionRate` DOUBLE NOT NULL,
  `trackingUrl` VARCHAR(191) NOT NULL,
  `clicksCount` INT NOT NULL DEFAULT 0,
  `conversionsCount` INT NOT NULL DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `FraudReport` (
  `id` VARCHAR(191) NOT NULL,
  `incidentId` VARCHAR(191) NOT NULL,
  `targetIp` VARCHAR(191) NOT NULL,
  `partnerName` VARCHAR(191) NOT NULL,
  `reason` VARCHAR(191) NOT NULL,
  `riskScore` DOUBLE NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
  `dispatchedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `FraudReport_incidentId_key` (`incidentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `Complaint` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `sector` ENUM('FOOD','RIDE','SKINCARE') NOT NULL,
  `serviceProvider` VARCHAR(191) NOT NULL,
  `orderOrRideId` VARCHAR(191) NULL,
  `subject` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `status` ENUM('OPEN','UNDER_REVIEW','RESOLVED','DISMISSED') NOT NULL DEFAULT 'OPEN',
  `adminResponse` LONGTEXT NULL,
  `resolvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Complaint_userId_fkey` (`userId`),
  CONSTRAINT `Complaint_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `OfferMatrixSetting` (
  `id` VARCHAR(191) NOT NULL,
  `sector` ENUM('FOOD','RIDE','SKINCARE') NOT NULL,
  `providerName` VARCHAR(191) NOT NULL,
  `discountPercentage` DOUBLE NOT NULL,
  `validityDays` INT NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `updatedById` VARCHAR(191) NULL,
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `OfferMatrixSetting_updatedById_fkey` (`updatedById`),
  CONSTRAINT `OfferMatrixSetting_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prisma migrations table (required for Prisma to recognize the DB as migrated)
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` VARCHAR(36) NOT NULL,
  `checksum` VARCHAR(64) NOT NULL,
  `finished_at` DATETIME(3) NULL,
  `migration_name` VARCHAR(255) NOT NULL,
  `logs` TEXT NULL,
  `rolled_back_at` DATETIME(3) NULL,
  `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`,`checksum`,`migration_name`,`started_at`,`finished_at`,`applied_steps_count`)
VALUES (UUID(), 'manual_init_bypass', '20260908_init', NOW(3), NOW(3), 1)
ON DUPLICATE KEY UPDATE id=id;

SET FOREIGN_KEY_CHECKS=1;
