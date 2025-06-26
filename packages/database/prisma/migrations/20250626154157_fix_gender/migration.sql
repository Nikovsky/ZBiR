/*
  Warnings:

  - You are about to alter the column `gender` on the `personaldata` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(4))` to `Enum(EnumId(2))`.

*/
-- DropIndex
DROP INDEX `Session_sessionToken_key` ON `session`;

-- AlterTable
ALTER TABLE `personaldata` MODIFY `gender` ENUM('MALE', 'FEMALE', 'PREFER_NOT_TO_SAY') NULL DEFAULT 'PREFER_NOT_TO_SAY';

-- AlterTable
ALTER TABLE `session` MODIFY `sessionToken` TEXT NOT NULL;
