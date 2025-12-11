import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { IndividualAccountPrismaRepository } from "@/infrastructure/database/repositories/individual-account-prisma.repository.ts";
import { UpdateIndividualOnboardingUsecase } from "@/application/use-cases/individual-account/update-individual-onboarding.usecase.ts";
import { UpdateIndividualOnboardingController } from "@/infrastructure/http/controllers/individual/update-individual-onboarding.controller.ts";

const authRepository = new AuthPrismaRepository();
const individualAccountRepository = new IndividualAccountPrismaRepository();

const updateIndividualOnboardingUsecase = new UpdateIndividualOnboardingUsecase(
	individualAccountRepository,
	authRepository
);
const updateIndividualOnboardingController = new UpdateIndividualOnboardingController(updateIndividualOnboardingUsecase);

export { updateIndividualOnboardingController };
