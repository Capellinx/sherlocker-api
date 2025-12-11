import type {
	IZyonPayService,
	CreatePixPaymentRequest,
	CreatePixPaymentResponse,
} from "./zyonpay.repository.ts";
import { env } from "@/infrastructure/config/env.ts";

export class ZyonPayService implements IZyonPayService {
	private readonly baseURL: string;
	private readonly publicKey: string;
	private readonly secretKey: string;

	constructor() {
		this.baseURL = env.ZYONPAY_BASE_URL;
		this.publicKey = env.ZYONPAY_PUBLIC_KEY;
		this.secretKey = env.ZYONPAY_SECRET_KEY;
	}

	async createPixPayment(
		data: CreatePixPaymentRequest
	): Promise<CreatePixPaymentResponse> {
		try {
			const response = await fetch(`${this.baseURL}/gateway/pix/receive`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-public-key": this.publicKey,
					"x-secret-key": this.secretKey,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = (await response.json().catch(() => ({}))) as { message?: string };
				const message = errorData.message || response.statusText;
				throw new Error(`ZyonPay API error: ${message}`);
			}

			const result = (await response.json()) as CreatePixPaymentResponse;
			
			if (!result.transactionId || !result.pix) {
				throw new Error("Invalid response from ZyonPay API");
			}

			return result;
		} catch (error) {
			if (error instanceof Error) {
				throw error;
			}
			throw new Error("Unknown error occurred while creating Pix payment");
		}
	}
}
