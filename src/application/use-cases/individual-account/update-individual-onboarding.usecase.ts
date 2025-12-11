import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { NotFoundError, BadRequestError } from "@/infrastructure/config/errors.ts";

export class UpdateIndividualOnboardingUsecase {
	constructor(
		private readonly individualAccountRepository: IIndividualAccountRepository,
		private readonly authRepository: IAuthRepository
	) {}

	async execute(
		request: UpdateIndividualOnboardingUsecase.Request
	): Promise<UpdateIndividualOnboardingUsecase.Response> {
		// Verificar se o usuário existe e tem conta individual
		const auth = await this.authRepository.findById(request.authId);
		
		if (!auth) {
			throw new NotFoundError("User not found");
		}

		if (!auth.individualAccountId) {
			throw new BadRequestError("User does not have an individual account");
		}

		// Buscar a conta individual
		const individualAccount = await this.individualAccountRepository.findById(
			auth.individualAccountId
		);

		if (!individualAccount) {
			throw new NotFoundError("Individual account not found");
		}

		// Atualizar apenas os campos fornecidos
		const updateData: Partial<typeof individualAccount> = {};

		if (request.email !== undefined) {
			// Verificar se o email já está em uso por outra conta
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

		// Atualizar a conta individual
		const updatedAccount = await this.individualAccountRepository.update(
			individualAccount.id,
			updateData
		);

		if (!updatedAccount) {
			throw new Error("Failed to update individual account");
		}

		return {
			success: true,
			message: "Onboarding data updated successfully",
			account: {
				id: updatedAccount.id,
				...(updatedAccount.name && { name: updatedAccount.name }),
				email: updatedAccount.email,
				...(updatedAccount.phone && { phone: updatedAccount.phone }),
				...(updatedAccount.cpf && { cpf: updatedAccount.cpf }),
				...(updatedAccount.cep && { cep: updatedAccount.cep }),
				...(updatedAccount.state && { state: updatedAccount.state }),
				...(updatedAccount.address && { address: updatedAccount.address }),
				...(updatedAccount.neighborhood && { neighborhood: updatedAccount.neighborhood }),
				...(updatedAccount.city && { city: updatedAccount.city }),
				...(updatedAccount.number && { number: updatedAccount.number }),
			}
		};
	}
}

export namespace UpdateIndividualOnboardingUsecase {
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
		success: boolean;
		message: string;
		account: {
			id: string;
			name?: string;
			email: string;
			phone?: string;
			cpf?: string;
			cep?: string;
			state?: string;
			address?: string;
			neighborhood?: string;
			city?: string;
			number?: string;
		};
	};
}
