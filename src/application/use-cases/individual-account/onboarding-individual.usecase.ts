import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import { IndividualAccountEntity } from "@/domain/entities/individual-account.ts";
import { BadRequestError } from "@/infrastructure/config/errors.ts";

export class OnboardingIndividualUsecase { 
   constructor(
      private readonly authRepository: IAuthRepository,
      private readonly individualRepository: IIndividualAccountRepository
   ) { }

   async execute(payload: OnboardingIndividualUsecase.Request): Promise<OnboardingIndividualUsecase.Response> {
      const auth = await this.authRepository.findById(payload.authId);

      if (!auth) {
         throw new BadRequestError("User not found.");
      }

      if (!auth.isMissingOnboarding || auth.corporateAccountId || auth.individualAccountId) {
         throw new BadRequestError("User already has completed onboarding or associated account.");
      }

      const individualAccount = IndividualAccountEntity.create({
         name: payload.name,
         email: payload.email,
         phone: payload.phone,
         cpf: payload.cpf,
         birthday: this.parseBirthdayToDate(payload.birthday),
         cep: payload.cep,
         state: payload.state,
         address: payload.address,
         neighborhood: payload.neighborhood,
         city: payload.city,
         number: payload.number
      });

      const createdIndividualAccount = await this.individualRepository.create(individualAccount);

      await this.authRepository.update(payload.authId, {
         individualAccountId: createdIndividualAccount.id,
         isMissingOnboarding: false
      });

      return {
         individualAccountId: createdIndividualAccount.id
      };
   }

   private parseBirthdayToDate(birthday?: string): Date | undefined {
      if (!birthday) return undefined;

      if (birthday.includes('/')) {
         const [day, month, year] = birthday.split('/');
         return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
      }

      const parts = birthday.split('-');
      if (parts.length === 3) {
         const [year, month, day] = parts;
         return new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
      }

      return undefined;
   }

}

export namespace OnboardingIndividualUsecase {
   export type Request = {
      authId: string;
      name: string;
      email: string;
      phone: string;
      cpf: string;
      birthday?: string;
      cep: string;
      state: string;
      address: string;
      neighborhood: string;
      city: string;
      number: string;
   };
   export type Response = {
      individualAccountId: string;
   };
}