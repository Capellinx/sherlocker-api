import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { NotFoundError, BadRequestError } from "@/infrastructure/config/errors.ts";

export class UpdateOnboardingUsecase {
	constructor(
		private readonly individualAccountRepository: IIndividualAccountRepository,
		private readonly corporateAccountRepository: ICorporateAccountRepository,
		private readonly authRepository: IAuthRepository
	) {}

	async execute(
		request: UpdateOnboardingUsecase.Request
	): Promise<UpdateOnboardingUsecase.Response> {
		// Verificar se o usuário existe
		const auth = await this.authRepository.findById(request.authId);
		
		if (!auth) {
			throw new NotFoundError("User not found");
		}

		// Detectar tipo de conta
		const isIndividual = !!auth.individualAccountId;
		const isCorporate = !!auth.corporateAccountId;

		if (!isIndividual && !isCorporate) {
			throw new BadRequestError("User does not have an account");
		}

		// Atualizar conta individual
		if (isIndividual) {
			const individualAccount = await this.individualAccountRepository.findById(
				auth.individualAccountId!
			);

			if (!individualAccount) {
				throw new NotFoundError("Individual account not found");
			}

			// Preparar dados de atualização
			const updateData: Partial<typeof individualAccount> = {};

			if (request.email !== undefined) {
				if (request.email !== individualAccount.email) {
					const existingAccount = await this.individualAccountRepository.findByEmail(request.email);
					if (existingAccount && existingAccount.id !== individualAccount.id) {
						throw new BadRequestError("Email already in use");
					}
				}
				updateData.email = request.email;
			}

			if (request.phone !== undefined) updateData.phone = request.phone;
			if (request.cep !== undefined) updateData.cep = request.cep;
			if (request.state !== undefined) updateData.state = request.state;
			if (request.address !== undefined) updateData.address = request.address;
			if (request.neighborhood !== undefined) updateData.neighborhood = request.neighborhood;
			if (request.city !== undefined) updateData.city = request.city;
			if (request.number !== undefined) updateData.number = request.number;

			const updatedAccount = await this.individualAccountRepository.update(
				individualAccount.id,
				updateData
			);

			if (!updatedAccount) {
				throw new Error("Failed to update individual account");
			}

			return {
				message: "Dados atualizados com sucesso"
			};
		}

		// Atualizar conta corporativa
		if (isCorporate) {
			const corporateAccount = await this.corporateAccountRepository.findById(
				auth.corporateAccountId!
			);

			if (!corporateAccount) {
				throw new NotFoundError("Corporate account not found");
			}

			// Preparar dados de atualização
			const updateData: Partial<typeof corporateAccount> = {};

			if (request.email !== undefined) {
				if (request.email !== corporateAccount.email) {
					const existingAccount = await this.corporateAccountRepository.findByEmail(request.email);
					if (existingAccount && existingAccount.id !== corporateAccount.id) {
						throw new BadRequestError("Email already in use");
					}
				}
				updateData.email = request.email;
			}

			if (request.phone !== undefined) updateData.phone = request.phone;
			if (request.cep !== undefined) updateData.cep = request.cep;
			if (request.state !== undefined) updateData.state = request.state;
			if (request.address !== undefined) updateData.address = request.address;
			if (request.neighborhood !== undefined) updateData.neighborhood = request.neighborhood;
			if (request.city !== undefined) updateData.city = request.city;
			if (request.number !== undefined) updateData.number = request.number;

			const updatedAccount = await this.corporateAccountRepository.update(
				corporateAccount.id,
				updateData
			);

			if (!updatedAccount) {
				throw new Error("Failed to update corporate account");
			}

			return {
				message: "Dados atualizados com sucesso"
			};
		}

		throw new Error("Unexpected error");
	}
}

export namespace UpdateOnboardingUsecase {
	export type Request = {
		authId: string;
		email?: string | undefined;
		phone?: string | undefined;
		cep?: string | undefined;
		state?: string | undefined;
		address?: string | undefined;
		neighborhood?: string | undefined;
		city?: string | undefined;
		number?: string | undefined;
	};

	export type Response = {
		message: string;
	};
}
