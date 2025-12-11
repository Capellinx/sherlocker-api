import { z } from "zod";

export const checkPaymentStatusSchema = z.object({
	pixCopyPaste: z.string().min(1, "PIX copia e cola is required"),
});

export type CheckPaymentStatusDTO = z.infer<typeof checkPaymentStatusSchema>;

export interface CheckPaymentStatusResponseDTO {
	isPaid: boolean;
	token?: string; // Novo token JWT se o pagamento estiver pago
	message: string;
}
