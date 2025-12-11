import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { CorporateAccountPrismaRepository } from "@/infrastructure/database/repositories/corporate-account-prisma.repository.ts";
import { OnboardingCorporateUsecase } from "@/application/use-cases/corporate-account/onboarding-corporate.usecase.ts";
import { OnboardingCorporateController } from "@/infrastructure/http/controllers/corporate/onboarding-corporate.controller.ts";

const authRepository = new AuthPrismaRepository();
const corporateAccountRepository = new CorporateAccountPrismaRepository();

const onboardingCorporateUsecase = new OnboardingCorporateUsecase(
	authRepository,
	corporateAccountRepository
);
const onboardingCorporateController = new OnboardingCorporateController(onboardingCorporateUsecase);

export { onboardingCorporateController };