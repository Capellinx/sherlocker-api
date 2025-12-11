import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import { CorporateAccountEntity } from "@/domain/entities/corporate-account.ts";
import { BadRequestError } from "@/infrastructure/config/errors.ts";

export class OnboardingCorporateUsecase { 
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly corporateRepository: ICorporateAccountRepository
   ) { }

   async execute(payload: OnboardingCorporateUsecase.Request): Promise<OnboardingCorporateUsecase.Response> {
      const auth = await this.authRepository.findById(payload.authId);

      if (!auth) {
         throw new BadRequestError("User not found.");
      }

      if (!auth.isMissingOnboarding || auth.corporateAccountId || auth.individualAccountId) {
         throw new BadRequestError("User already has completed onboarding or associated account.");
      }      const corporateAccount = CorporateAccountEntity.create({
         ownerName: payload.ownerName,
         email: payload.email,
         phone: payload.phone,
         cnpj: payload.cnpj,
         cep: payload.cep,
         state: payload.state,
         address: payload.address,
         neighborhood: payload.neighborhood,
         city: payload.city,
         number: payload.number
      });

      const createdCorporateAccount = await this.corporateRepository.create(corporateAccount);

      await this.authRepository.update(payload.authId, {
         corporateAccountId: createdCorporateAccount.id,
         isMissingOnboarding: false
      });

      return {
         corporateAccountId: createdCorporateAccount.id
      };
   }

}

export namespace OnboardingCorporateUsecase {
   export type Request = {
      authId: string;
      ownerName: string;
      email: string;
      phone: string;
      cnpj: string;
      cep: string;
      state: string;
      address: string;
      neighborhood: string;
      city: string;
      number: string;
   };
   export type Response = {
      corporateAccountId: string;
   };
}