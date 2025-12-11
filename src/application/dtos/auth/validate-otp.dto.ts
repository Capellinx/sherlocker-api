import z from "zod";

export const validateOtpSchema = z.object({
   otp: z.string().length(6, "OTP deve ter 6 dígitos"),
});

export type ValidateOtpDto = z.infer<typeof validateOtpSchema>;