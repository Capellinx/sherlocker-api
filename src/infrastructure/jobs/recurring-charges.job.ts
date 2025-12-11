import cron from "node-cron";
import { makeProcessRecurringChargesUsecase } from "@/infrastructure/factories/payment/process-recurring-charges.factory.ts";
import { makeCheckExpiredPaymentsUsecase } from "@/infrastructure/factories/payment/check-expired-payments.factory.ts";

export function startRecurringChargesJob() {
  cron.schedule("0 0 * * *", async () => {
    try {
      const checkExpiredPaymentsUsecase = makeCheckExpiredPaymentsUsecase();
      await checkExpiredPaymentsUsecase.execute();

      const processRecurringChargesUsecase = makeProcessRecurringChargesUsecase();
      await processRecurringChargesUsecase.execute();
    } catch (error) {
      throw error;
    }
  }, {
    timezone: "America/Sao_Paulo"
  });
}

