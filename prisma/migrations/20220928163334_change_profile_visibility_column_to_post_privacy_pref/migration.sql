/*
  Warnings:

  - You are about to drop the column `visibility` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "visibility",
ADD COLUMN     "postPrivacyPref" "Visibility" NOT NULL DEFAULT E'PUBLIC';
