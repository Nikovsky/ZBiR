/*
  Warnings:

  - The values [OTHER] on the enum `PersonalData_gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [MODERATOR,GUEST] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `personaldata` MODIFY `gender` ENUM('MALE', 'FEMALE') NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ROOT', 'SYSTEM', 'ADMIN', 'SKARBNIK', 'SKARBNIK_REGION', 'USER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Camp` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `region` ENUM('DOLNOSLASKI', 'GORNOSLASKI', 'KUJAWSKO_POMORSKI', 'LUBELSKI', 'LODZKI', 'MALOPOLSKI', 'MAZOWIECKI', 'PODKARPACKI', 'POMORSKI', 'POLNOCNO_ZACHODNI', 'STAROPOLSKI', 'WIELKOPOLSKI') NOT NULL,
    `isClosed` BOOLEAN NOT NULL DEFAULT false,
    `approvedAt` DATETIME(3) NULL,
    `incomeSum` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `expenseSum` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `balanceFinal` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Camp_year_idx`(`year`),
    INDEX `Camp_region_idx`(`region`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FicoEntry` (
    `id` VARCHAR(191) NOT NULL,
    `ficoDate` DATETIME(3) NOT NULL,
    `ficoDescription` VARCHAR(191) NOT NULL,
    `bankDeposit` DECIMAL(15, 2) NULL,
    `bankWithdrawal` DECIMAL(15, 2) NULL,
    `grantHq` DECIMAL(15, 2) NULL,
    `grantEdu` DECIMAL(15, 2) NULL,
    `grantMuni` DECIMAL(15, 2) NULL,
    `incomeActions` DECIMAL(15, 2) NULL,
    `incomeParticipantFee` DECIMAL(15, 2) NULL,
    `donationPrivate` DECIMAL(15, 2) NULL,
    `donationOrg` DECIMAL(15, 2) NULL,
    `incomeOnePercent` DECIMAL(15, 2) NULL,
    `incomeOther` DECIMAL(15, 2) NULL,
    `expEquipment` DECIMAL(15, 2) NULL,
    `expMaterials` DECIMAL(15, 2) NULL,
    `expCleaning` DECIMAL(15, 2) NULL,
    `expOtherMaterials` DECIMAL(15, 2) NULL,
    `expEnergy` DECIMAL(15, 2) NULL,
    `expPhone` DECIMAL(15, 2) NULL,
    `expRent` DECIMAL(15, 2) NULL,
    `expPost` DECIMAL(15, 2) NULL,
    `expBank` DECIMAL(15, 2) NULL,
    `expCourier` DECIMAL(15, 2) NULL,
    `expServices` DECIMAL(15, 2) NULL,
    `expSalary` DECIMAL(15, 2) NULL,
    `expInsuranceOC` DECIMAL(15, 2) NULL,
    `expInsuranceNNW` DECIMAL(15, 2) NULL,
    `expTravel` DECIMAL(15, 2) NULL,
    `expFood` DECIMAL(15, 2) NULL,
    `expRewards` DECIMAL(15, 2) NULL,
    `expTickets` DECIMAL(15, 2) NULL,
    `expAccommodation` DECIMAL(15, 2) NULL,
    `expTransport` DECIMAL(15, 2) NULL,
    `expOther` DECIMAL(15, 2) NULL,
    `campId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FicoEntry_campId_ficoDate_idx`(`campId`, `ficoDate`),
    INDEX `FicoEntry_campId_idx`(`campId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserToCamp` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `campId` VARCHAR(191) NOT NULL,
    `accepted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserToCamp_userId_idx`(`userId`),
    INDEX `UserToCamp_campId_idx`(`campId`),
    UNIQUE INDEX `UserToCamp_userId_campId_key`(`userId`, `campId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRegionAccess` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `region` ENUM('DOLNOSLASKI', 'GORNOSLASKI', 'KUJAWSKO_POMORSKI', 'LUBELSKI', 'LODZKI', 'MALOPOLSKI', 'MAZOWIECKI', 'PODKARPACKI', 'POMORSKI', 'POLNOCNO_ZACHODNI', 'STAROPOLSKI', 'WIELKOPOLSKI') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserRegionAccess_userId_idx`(`userId`),
    INDEX `UserRegionAccess_region_idx`(`region`),
    UNIQUE INDEX `UserRegionAccess_userId_region_key`(`userId`, `region`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `userToCampId` VARCHAR(191) NULL,
    `type` ENUM('INFO', 'SYSTEM', 'INVITATION') NOT NULL,
    `topic` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_userId_isRead_idx`(`userId`, `isRead`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Camp` ADD CONSTRAINT `Camp_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoEntry` ADD CONSTRAINT `FicoEntry_campId_fkey` FOREIGN KEY (`campId`) REFERENCES `Camp`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoEntry` ADD CONSTRAINT `FicoEntry_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoEntry` ADD CONSTRAINT `FicoEntry_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToCamp` ADD CONSTRAINT `UserToCamp_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToCamp` ADD CONSTRAINT `UserToCamp_campId_fkey` FOREIGN KEY (`campId`) REFERENCES `Camp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserRegionAccess` ADD CONSTRAINT `UserRegionAccess_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userToCampId_fkey` FOREIGN KEY (`userToCampId`) REFERENCES `UserToCamp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
