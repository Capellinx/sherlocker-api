import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ISubscriptionRepository } from "@/domain/repositories/subscription.repository.ts";
import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import { UnauthorizedError, NotFoundError } from "@/infrastructure/config/errors.ts";
import type { ProfileResponseDto } from "@/application/dtos/auth/profile.dto.ts";

export class ProfileUsecase {
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly subscriptionRepository: ISubscriptionRepository,
      private readonly planRepository: IPlanRepository
   ) { }

   async execute(authId: string): Promise<ProfileUsecase.Response> {
      if (!authId) {
         throw new UnauthorizedError("User not authenticated");
      }

      const auth = await this.authRepository.findByIdWithAccounts(authId);
      
      if (!auth) {
         throw new NotFoundError("User not found");
      }

      // Buscar apenas a subscription ativa
      const activeSubscription = await this.subscriptionRepository.findActiveByAuthId(authId);

      let activeSubscriptionData = undefined;

      if (activeSubscription) {
         const subData = activeSubscription.toJSON();
         const plan = await this.planRepository.findById(subData.planId);
         
         if (plan) {
            const planData = plan.toJSON();
            
            activeSubscriptionData = {
               id: subData.id,
               status: subData.status,
               startDate: subData.startDate || undefined,
               endDate: subData.endDate || undefined,
               nextPaymentDate: subData.nextPaymentDate || undefined,
               plan: {
                  id: planData.id,
                  name: planData.name,
                  description: planData.description || undefined,
                  amount: Number(planData.amount),
                  periodicity: planData.periodicity,
                  isActive: planData.isActive,
               },
               createdAt: subData.createdAt,
               updatedAt: subData.updatedAt,
            };
         }
      }

      const profile: ProfileResponseDto = {
         id: auth.id,
         name: auth.name,
         surname: auth.surname,
         email: auth.email,
         isMissingOnboarding: auth.isMissingOnboarding,
         individualAccount: auth.individualAccount ? {
            id: auth.individualAccount.id,
            name: auth.individualAccount.name || undefined,
            email: auth.individualAccount.email,
            phone: auth.individualAccount.phone || undefined,
            cpf: auth.individualAccount.cpf || undefined,
            birthday: auth.individualAccount.birthday || undefined,
            cep: auth.individualAccount.cep || undefined,
            state: auth.individualAccount.state || undefined,
            address: auth.individualAccount.address || undefined,
            neighborhood: auth.individualAccount.neighborhood || undefined,
            city: auth.individualAccount.city || undefined,
            number: auth.individualAccount.number || undefined,
            createdAt: auth.individualAccount.createdAt || undefined,
            updatedAt: auth.individualAccount.updatedAt || undefined,
         } : undefined,
         corporateAccount: auth.corporateAccount ? {
            id: auth.corporateAccount.id,
            ownerName: auth.corporateAccount.ownerName || undefined,
            socialReason: auth.corporateAccount.socialReason || undefined,
            email: auth.corporateAccount.email || undefined,
            phone: auth.corporateAccount.phone || undefined,
            cnpj: auth.corporateAccount.cnpj || undefined,
            cep: auth.corporateAccount.cep || undefined,
            state: auth.corporateAccount.state || undefined,
            address: auth.corporateAccount.address || undefined,
            neighborhood: auth.corporateAccount.neighborhood || undefined,
            city: auth.corporateAccount.city || undefined,
            number: auth.corporateAccount.number || undefined,
            createdAt: auth.corporateAccount.createdAt || undefined,
            updatedAt: auth.corporateAccount.updatedAt || undefined,
         } : undefined,
         activeSubscription: activeSubscriptionData,
         createdAt: auth.createdAt,
         updatedAt: auth.updatedAt,
      };

      return profile;
   }
}

export namespace ProfileUsecase {
   export type Response = ProfileResponseDto;
}
