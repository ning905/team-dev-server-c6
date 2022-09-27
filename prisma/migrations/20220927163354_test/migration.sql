/*
  Warnings:

  - You are about to drop the column `privacyPref` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "privacyPref",
ADD COLUMN     "privatePosts" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "PrivacyPref";
