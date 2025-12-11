import express, { json } from "express";
import type { Express } from "express";
import cookieParser from "cookie-parser";
import { PrismaClient } from "./generated/prisma/client.ts";
import { CorsMiddleware } from "./infrastructure/middlewares/cors.middleware.ts";
import { HandleErrorsMiddleware } from "./infrastructure/middlewares/handle-errors.middleware.ts";
import { authRouter } from "./infrastructure/http/routes/auth.routes.ts";
import { loginRouter } from "./infrastructure/http/routes/login.routes.ts";
import { onboardingIndividualRouter } from "./infrastructure/http/routes/onboarding-individual.routes.ts";
import { onboardingCorporateRouter } from "./infrastructure/http/routes/onboarding-corporate.routes.ts";
import { onboardingRouter } from "./infrastructure/http/routes/onboarding.routes.ts";
import { searchRouter } from "./infrastructure/http/routes/search.routes.ts";
import { searchHistoryRoutes } from "./infrastructure/http/routes/search-history.routes.ts";
import { paymentRoutes } from "./infrastructure/http/routes/payment.routes.ts";
import { tokenTransactionsRoutes } from "./infrastructure/http/routes/token-transactions.routes.ts";
import { validateCpfRouter } from "./infrastructure/http/routes/validate-cpf.routes.ts";
import { validateCnpjRouter } from "./infrastructure/http/routes/validate-cnpj.routes.ts";
import { plansRouter } from "./infrastructure/http/routes/plans.routes.ts";
import { startRecurringChargesJob } from "./infrastructure/jobs/recurring-charges.job.ts";
import { startExpiredPaymentsCron } from "./infrastructure/cron/expired-payments-cron.ts";

export const prisma = new PrismaClient();

const app: Express = express();

app.use(CorsMiddleware.execute);
app.use(json());
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
   res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      env: {
         nodeEnv: process.env.NODE_ENV,
         allowedOrigins: process.env.ALLOWED_ORIGINS
      }
   });
});

app.use(authRouter);
app.use("/login", loginRouter);
app.use("/onboarding/individual", onboardingIndividualRouter);
app.use("/onboarding/corporate", onboardingCorporateRouter);
app.use("/onboarding", onboardingRouter);
app.use("/search", searchRouter);
app.use("/search", searchHistoryRoutes);
app.use("/payments", paymentRoutes);
app.use("/tokens", tokenTransactionsRoutes);
app.use("/validate-cpf", validateCpfRouter);
app.use("/validate-cnpj", validateCnpjRouter);
app.use("/plans", plansRouter);

app.use(HandleErrorsMiddleware.execute);

startRecurringChargesJob();
startExpiredPaymentsCron();

export { app };
