/*
  Warnings:

  - Added the required column `updatedAt` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "EventType" ADD VALUE 'EXERCISE';

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
