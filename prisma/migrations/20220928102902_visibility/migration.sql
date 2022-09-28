-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT E'PUBLIC';
