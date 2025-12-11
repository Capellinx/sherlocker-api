import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { CorporateAccountPrismaRepository } from "@/infrastructure/database/repositories/corporate-account-prisma.repository.ts";
import { UpdateCorporateOnboardingUsecase } from "@/application/use-cases/corporate-account/update-corporate-onboarding.usecase.ts";
import { UpdateCorporateOnboardingController } from "@/infrastructure/http/controllers/corporate/update-corporate-onboarding.controller.ts";

const authRepository = new AuthPrismaRepository();
const corporateAccountRepository = new CorporateAccountPrismaRepository();

const updateCorporateOnboardingUsecase = new UpdateCorporateOnboardingUsecase(
	corporateAccountRepository,
	authRepository
);
const updateCorporateOnboardingController = new UpdateCorporateOnboardingController(updateCorporateOnboardingUsecase);

export { updateCorporateOnboardingController };
