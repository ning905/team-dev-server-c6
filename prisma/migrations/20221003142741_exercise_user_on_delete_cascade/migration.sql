-- DropForeignKey
ALTER TABLE "DeliveryLog" DROP CONSTRAINT "DeliveryLog_cohortId_fkey";

-- DropForeignKey
ALTER TABLE "DeliveryLog" DROP CONSTRAINT "DeliveryLog_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseUser" DROP CONSTRAINT "ExerciseUser_exerciseId_fkey";

-- AddForeignKey
ALTER TABLE "DeliveryLog" ADD CONSTRAINT "DeliveryLog_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryLog" ADD CONSTRAINT "DeliveryLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseUser" ADD CONSTRAINT "ExerciseUser_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
