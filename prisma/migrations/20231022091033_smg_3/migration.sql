/*
  Warnings:

  - You are about to drop the column `firstName` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `profiles` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`;
