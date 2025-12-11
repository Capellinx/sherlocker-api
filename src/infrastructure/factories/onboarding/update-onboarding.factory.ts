import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { IndividualAccountPrismaRepository } from "@/infrastructure/database/repositories/individual-account-prisma.repository.ts";
import { CorporateAccountPrismaRepository } from "@/infrastructure/database/repositories/corporate-account-prisma.repository.ts";
import { UpdateOnboardingUsecase } from "@/application/use-cases/onboarding/update-onboarding.usecase.ts";
import { UpdateOnboardingController } from "@/infrastructure/http/controllers/onboarding/update-onboarding.controller.ts";

const authRepository = new AuthPrismaRepository();
const individualAccountRepository = new IndividualAccountPrismaRepository();
const corporateAccountRepository = new CorporateAccountPrismaRepository();

const updateOnboardingUsecase = new UpdateOnboardingUsecase(
	individualAccountRepository,
	corporateAccountRepository,
	authRepository
);
const updateOnboardingController = new UpdateOnboardingController(updateOnboardingUsecase);

export { updateOnboardingController };
