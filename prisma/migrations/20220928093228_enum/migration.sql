/*
  Warnings:

  - The `privatePosts` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PrivatePosts" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "privatePosts",
ADD COLUMN     "privatePosts" "PrivatePosts" NOT NULL DEFAULT E'PUBLIC';
