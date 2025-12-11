export interface CreatePixPaymentRequest {
	identifier: string;
	amount: number;
	shippingFee?: number;
	extraFee?: number;
	discount?: number;
	client: {
		name: string;
		email: string;
		phone: string;
		document: string;
	};
	products?: Array<{
		id: string;
		name: string;
		price: number;
	}>;
	dueDate?: string;
	metadata?: Record<string, string>;
	callbackUrl: string;
}

export interface CreatePixPaymentResponse {
	transactionId: string;
	status: "OK" | "FAILED" | "PENDING" | "REJECTED" | "CANCELED";
	fee: number;
	order: {
		identifier: string;
		amount: number;
		shippingFee: number;
		extraFee: number;
		discount: number;
		total: number;
	};
	pix: {
		code: string;      // Pix Copia e Cola
		base64: string;    // QR Code em base64
		image: string;     // URL da imagem do QR Code
		expiresAt: string;
	};
	details?: string;
	errorDescription?: string;
}

export interface IZyonPayService {
	createPixPayment(
		data: CreatePixPaymentRequest
	): Promise<CreatePixPaymentResponse>;
}
