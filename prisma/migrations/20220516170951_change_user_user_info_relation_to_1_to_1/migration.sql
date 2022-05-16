/*
  Warnings:

  - A unique constraint covering the columns `[memberId]` on the table `RaceResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `RaceResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `RaceResult` ADD COLUMN `memberId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `RaceResult_memberId_key` ON `RaceResult`(`memberId`);

-- AddForeignKey
ALTER TABLE `RaceResult` ADD CONSTRAINT `RaceResult_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `RaceMember`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
