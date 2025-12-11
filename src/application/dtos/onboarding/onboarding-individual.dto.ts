import { z } from "zod";

export const onboardingIndividualSchema = z.object({
   name: z.string().min(1, "Name is required"),
   email: z.string().email("Invalid email"),
   phone: z.string().min(10, "Phone must have at least 10 digits").max(15, "Phone must have at most 15 digits"),
   cpf: z.string().min(11, "CPF must have 11 digits").max(11, "CPF must have 11 digits"),
   birthday: z.string().regex(/^(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$/, "Birthday must be in format DD/MM/YYYY or YYYY-MM-DD").optional(),
   cep: z.string().min(8, "CEP must have 8 digits").max(10, "CEP is too long"),
   state: z.string().length(2, "State must have 2 characters"),
   address: z.string().min(1, "Address is required"),
   neighborhood: z.string().min(1, "Neighborhood is required"),
   city: z.string().min(1, "City is required"),
   number: z.string().min(1, "Number is required")
});

export type OnboardingIndividualDto = z.infer<typeof onboardingIndividualSchema>;