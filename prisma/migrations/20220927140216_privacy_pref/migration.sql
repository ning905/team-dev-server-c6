-- CreateEnum
CREATE TYPE "PrivacyPref" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "privacyPref" "PrivacyPref" NOT NULL DEFAULT E'PUBLIC';
