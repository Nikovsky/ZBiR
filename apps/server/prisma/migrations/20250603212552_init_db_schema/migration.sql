-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `password` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isBlocked` BOOLEAN NOT NULL DEFAULT false,
    `isEmailConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false,
    `failedLoginAttempts` INTEGER NOT NULL DEFAULT 0,
    `lastLoginAt` DATETIME(3) NULL,
    `role` ENUM('ADMIN', 'SKARBNIK', 'SKARBNIK_REGION', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_username_idx`(`username`),
    INDEX `User_isActive_role_idx`(`isActive`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,
    `refresh_token_expires_in` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,
    `ip` VARCHAR(191) NULL,
    `deviceInfo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    INDEX `Session_ip_idx`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Authenticator` (
    `credentialID` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `credentialPublicKey` VARCHAR(191) NOT NULL,
    `counter` INTEGER NOT NULL,
    `credentialDeviceType` VARCHAR(191) NOT NULL,
    `credentialBackedUp` BOOLEAN NOT NULL,
    `transports` VARCHAR(191) NULL,

    UNIQUE INDEX `Authenticator_credentialID_key`(`credentialID`),
    PRIMARY KEY (`userId`, `credentialID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Authenticator` ADD CONSTRAINT `Authenticator_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
