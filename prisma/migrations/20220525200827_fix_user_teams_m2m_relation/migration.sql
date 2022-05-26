/*
  Warnings:

  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_TeamToUser` DROP FOREIGN KEY `_TeamToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TeamToUser` DROP FOREIGN KEY `_TeamToUser_B_fkey`;

-- DropTable
DROP TABLE `_TeamToUser`;
