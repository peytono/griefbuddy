/*
  Warnings:

  - You are about to drop the column `agee` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "agee",
ADD COLUMN     "age" TEXT;
