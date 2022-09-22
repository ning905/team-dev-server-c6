-- DropForeignKey
ALTER TABLE "DeliveryLogLine" DROP CONSTRAINT "DeliveryLogLine_logId_fkey";

-- AddForeignKey
ALTER TABLE "DeliveryLogLine" ADD CONSTRAINT "DeliveryLogLine_logId_fkey" FOREIGN KEY ("logId") REFERENCES "DeliveryLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
