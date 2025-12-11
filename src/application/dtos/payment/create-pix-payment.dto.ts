import { z } from "zod";

export const createPixPaymentSchema = z.object({
	planId: z.string().uuid({ message: "Plan ID must be a valid UUID" }),
});

export type CreatePixPaymentDTO = z.infer<typeof createPixPaymentSchema>;
