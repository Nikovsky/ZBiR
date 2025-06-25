/*
  Warnings:

  - You are about to drop the `userregionaccess` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userregionaccess` DROP FOREIGN KEY `UserRegionAccess_userId_fkey`;

-- AlterTable
ALTER TABLE `camp` MODIFY `region` ENUM('ALL', 'DOLNOSLASKI', 'GORNOSLASKI', 'KUJAWSKO_POMORSKI', 'LUBELSKI', 'LODZKI', 'MALOPOLSKI', 'MAZOWIECKI', 'PODKARPACKI', 'POMORSKI', 'POLNOCNO_ZACHODNI', 'STAROPOLSKI', 'WIELKOPOLSKI', 'NONE') NOT NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `createdById` VARCHAR(191) NULL,
    ADD COLUMN `importance` ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',
    MODIFY `type` ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'SYSTEM', 'INVITATION') NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE `personaldata` MODIFY `gender` ENUM('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY') NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `regionAccess` ENUM('ALL', 'DOLNOSLASKI', 'GORNOSLASKI', 'KUJAWSKO_POMORSKI', 'LUBELSKI', 'LODZKI', 'MALOPOLSKI', 'MAZOWIECKI', 'PODKARPACKI', 'POMORSKI', 'POLNOCNO_ZACHODNI', 'STAROPOLSKI', 'WIELKOPOLSKI', 'NONE') NULL DEFAULT 'NONE';

-- DropTable
DROP TABLE `userregionaccess`;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
