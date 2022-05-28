/*
  Warnings:

  - You are about to drop the column `userId` on the `Car` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Car` DROP FOREIGN KEY `Car_userId_fkey`;

-- AlterTable
ALTER TABLE `Car` DROP COLUMN `userId`,
    ADD COLUMN `ownerId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
