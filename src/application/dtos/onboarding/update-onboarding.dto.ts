import { z } from "zod";

export const updateOnboardingSchema = z.object({
   email: z.string().email("Invalid email").optional(),
   phone: z.string().min(10, "Phone must have at least 10 digits").max(15, "Phone must have at most 15 digits").optional(),
   cep: z.string().min(8, "CEP must have 8 digits").max(10, "CEP is too long").optional(),
   state: z.string().length(2, "State must have 2 characters").optional(),
   address: z.string().min(1, "Address is required").optional(),
   neighborhood: z.string().min(1, "Neighborhood is required").optional(),
   city: z.string().min(1, "City is required").optional(),
   number: z.string().min(1, "Number is required").optional()
});

export type UpdateOnboardingDto = z.infer<typeof updateOnboardingSchema>;
