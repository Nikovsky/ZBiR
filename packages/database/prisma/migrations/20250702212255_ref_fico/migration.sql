/*
  Warnings:

  - You are about to drop the column `bankDeposit` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `bankWithdrawal` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `campId` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `donationOrg` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `donationPrivate` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expAccommodation` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expBank` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expCleaning` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expCourier` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expEnergy` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expEquipment` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expFood` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expInsuranceNNW` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expInsuranceOC` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expMaterials` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expOther` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expOtherMaterials` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expPhone` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expPost` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expRent` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expRewards` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expSalary` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expServices` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expTickets` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expTransport` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `expTravel` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `ficoDate` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `ficoDescription` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `grantEdu` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `grantHq` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `grantMuni` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `incomeActions` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `incomeOnePercent` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `incomeOther` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `incomeParticipantFee` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `ficoentry` table. All the data in the column will be lost.
  - You are about to drop the column `userToCampId` on the `notification` table. All the data in the column will be lost.
  - You are about to drop the `camp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usertocamp` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `FicoCategoryId` to the `FicoEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FicoPageId` to the `FicoEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `camp` DROP FOREIGN KEY `Camp_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `ficoentry` DROP FOREIGN KEY `FicoEntry_campId_fkey`;

-- DropForeignKey
ALTER TABLE `ficoentry` DROP FOREIGN KEY `FicoEntry_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `ficoentry` DROP FOREIGN KEY `FicoEntry_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userToCampId_fkey`;

-- DropForeignKey
ALTER TABLE `usertocamp` DROP FOREIGN KEY `UserToCamp_campId_fkey`;

-- DropForeignKey
ALTER TABLE `usertocamp` DROP FOREIGN KEY `UserToCamp_userId_fkey`;

-- DropIndex
DROP INDEX `FicoEntry_campId_ficoDate_idx` ON `ficoentry`;

-- DropIndex
DROP INDEX `FicoEntry_campId_idx` ON `ficoentry`;

-- DropIndex
DROP INDEX `FicoEntry_createdById_fkey` ON `ficoentry`;

-- DropIndex
DROP INDEX `FicoEntry_updatedById_fkey` ON `ficoentry`;

-- DropIndex
DROP INDEX `Notification_userToCampId_fkey` ON `notification`;

-- AlterTable
ALTER TABLE `ficoentry` DROP COLUMN `bankDeposit`,
    DROP COLUMN `bankWithdrawal`,
    DROP COLUMN `campId`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `createdById`,
    DROP COLUMN `donationOrg`,
    DROP COLUMN `donationPrivate`,
    DROP COLUMN `expAccommodation`,
    DROP COLUMN `expBank`,
    DROP COLUMN `expCleaning`,
    DROP COLUMN `expCourier`,
    DROP COLUMN `expEnergy`,
    DROP COLUMN `expEquipment`,
    DROP COLUMN `expFood`,
    DROP COLUMN `expInsuranceNNW`,
    DROP COLUMN `expInsuranceOC`,
    DROP COLUMN `expMaterials`,
    DROP COLUMN `expOther`,
    DROP COLUMN `expOtherMaterials`,
    DROP COLUMN `expPhone`,
    DROP COLUMN `expPost`,
    DROP COLUMN `expRent`,
    DROP COLUMN `expRewards`,
    DROP COLUMN `expSalary`,
    DROP COLUMN `expServices`,
    DROP COLUMN `expTickets`,
    DROP COLUMN `expTransport`,
    DROP COLUMN `expTravel`,
    DROP COLUMN `ficoDate`,
    DROP COLUMN `ficoDescription`,
    DROP COLUMN `grantEdu`,
    DROP COLUMN `grantHq`,
    DROP COLUMN `grantMuni`,
    DROP COLUMN `incomeActions`,
    DROP COLUMN `incomeOnePercent`,
    DROP COLUMN `incomeOther`,
    DROP COLUMN `incomeParticipantFee`,
    DROP COLUMN `updatedAt`,
    DROP COLUMN `updatedById`,
    ADD COLUMN `FicoCategoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `FicoPageId` VARCHAR(191) NOT NULL,
    ADD COLUMN `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `notification` DROP COLUMN `userToCampId`,
    ADD COLUMN `userToBookId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `camp`;

-- DropTable
DROP TABLE `usertocamp`;

-- CreateTable
CREATE TABLE `FicoBook` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `region` ENUM('ALL', 'DOLNOSLASKI', 'GORNOSLASKI', 'KUJAWSKO_POMORSKI', 'LUBELSKI', 'LODZKI', 'MALOPOLSKI', 'MAZOWIECKI', 'PODKARPACKI', 'POMORSKI', 'POLNOCNO_ZACHODNI', 'STAROPOLSKI', 'WIELKOPOLSKI', 'NONE') NOT NULL,
    `openedAt` DATETIME(3) NOT NULL,
    `closedAt` DATETIME(3) NULL,
    `approvedAt` DATETIME(3) NULL,
    `isClosed` BOOLEAN NOT NULL DEFAULT false,
    `incomeSum` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `expenseSum` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `balanceSum` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `ownerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `FicoBook_openedAt_closedAt_idx`(`openedAt`, `closedAt`),
    INDEX `FicoBook_region_idx`(`region`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FicoPage` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NOT NULL,
    `invoiceNumber` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `value` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `ficoBookId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FicoCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('INCOME', 'EXPENSE') NOT NULL,
    `isCustom` BOOLEAN NOT NULL DEFAULT true,
    `ficoBookId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserToBook` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `FicoBookId` VARCHAR(191) NOT NULL,
    `accepted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UserToBook_userId_idx`(`userId`),
    INDEX `UserToBook_FicoBookId_idx`(`FicoBookId`),
    UNIQUE INDEX `UserToBook_userId_FicoBookId_key`(`userId`, `FicoBookId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FicoBook` ADD CONSTRAINT `FicoBook_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoPage` ADD CONSTRAINT `FicoPage_ficoBookId_fkey` FOREIGN KEY (`ficoBookId`) REFERENCES `FicoBook`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoEntry` ADD CONSTRAINT `FicoEntry_FicoPageId_fkey` FOREIGN KEY (`FicoPageId`) REFERENCES `FicoPage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoEntry` ADD CONSTRAINT `FicoEntry_FicoCategoryId_fkey` FOREIGN KEY (`FicoCategoryId`) REFERENCES `FicoCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FicoCategory` ADD CONSTRAINT `FicoCategory_ficoBookId_fkey` FOREIGN KEY (`ficoBookId`) REFERENCES `FicoBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToBook` ADD CONSTRAINT `UserToBook_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserToBook` ADD CONSTRAINT `UserToBook_FicoBookId_fkey` FOREIGN KEY (`FicoBookId`) REFERENCES `FicoBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userToBookId_fkey` FOREIGN KEY (`userToBookId`) REFERENCES `UserToBook`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
