import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import { NotFoundError, BadRequestError } from "@/infrastructure/config/errors.ts";

export class UpdateCorporateOnboardingUsecase {
	constructor(
		private readonly corporateAccountRepository: ICorporateAccountRepository,
		private readonly authRepository: IAuthRepository
	) {}

	async execute(
		request: UpdateCorporateOnboardingUsecase.Request
	): Promise<UpdateCorporateOnboardingUsecase.Response> {
		// Verificar se o usuário existe e tem conta corporativa
		const auth = await this.authRepository.findById(request.authId);
		
		if (!auth) {
			throw new NotFoundError("User not found");
		}

		if (!auth.corporateAccountId) {
			throw new BadRequestError("User does not have a corporate account");
		}

		// Buscar a conta corporativa
		const corporateAccount = await this.corporateAccountRepository.findById(
			auth.corporateAccountId
		);

		if (!corporateAccount) {
			throw new NotFoundError("Corporate account not found");
		}

		// Atualizar apenas os campos fornecidos
		const updateData: Partial<typeof corporateAccount> = {};

		if (request.email !== undefined) {
			// Verificar se o email já está em uso por outra conta
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

		// Atualizar a conta corporativa
		const updatedAccount = await this.corporateAccountRepository.update(
			corporateAccount.id,
			updateData
		);

		if (!updatedAccount) {
			throw new Error("Failed to update corporate account");
		}

		return {
			success: true,
			message: "Onboarding data updated successfully",
			account: {
				id: updatedAccount.id,
				...(updatedAccount.ownerName && { ownerName: updatedAccount.ownerName }),
				...(updatedAccount.socialReason && { socialReason: updatedAccount.socialReason }),
				...(updatedAccount.email && { email: updatedAccount.email }),
				...(updatedAccount.phone && { phone: updatedAccount.phone }),
				...(updatedAccount.cnpj && { cnpj: updatedAccount.cnpj }),
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

export namespace UpdateCorporateOnboardingUsecase {
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
			ownerName?: string;
			socialReason?: string;
			email?: string;
			phone?: string;
			cnpj?: string;
			cep?: string;
			state?: string;
			address?: string;
			neighborhood?: string;
			city?: string;
			number?: string;
		};
	};
}
