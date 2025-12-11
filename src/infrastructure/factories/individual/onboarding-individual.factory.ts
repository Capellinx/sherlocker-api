import { AuthPrismaRepository } from "@/infrastructure/database/repositories/auth-prisma.repository.ts";
import { IndividualAccountPrismaRepository } from "@/infrastructure/database/repositories/individual-account-prisma.repository.ts";
import { OnboardingIndividualUsecase } from "@/application/use-cases/individual-account/onboarding-individual.usecase.ts";
import { OnboardingIndividualController } from "@/infrastructure/http/controllers/individual/onboarding-individual.controller.ts";

const authRepository = new AuthPrismaRepository();
const individualAccountRepository = new IndividualAccountPrismaRepository();

const onboardingIndividualUsecase = new OnboardingIndividualUsecase(
	authRepository,
	individualAccountRepository
);
const onboardingIndividualController = new OnboardingIndividualController(onboardingIndividualUsecase);

export { onboardingIndividualController };