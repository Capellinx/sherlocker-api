import { z } from "zod";

export const onboardingCorporateSchema = z.object({
   ownerName: z.string().min(1, "Owner name is required"),
   email: z.string().email("Invalid email"),
   phone: z.string().min(10, "Phone must have at least 10 digits").max(15, "Phone must have at most 15 digits"),
   cnpj: z.string().min(14, "CNPJ must have 14 digits").max(14, "CNPJ must have 14 digits"),
   cep: z.string().min(8, "CEP must have 8 digits").max(10, "CEP is too long"),
   state: z.string().length(2, "State must have 2 characters"),
   address: z.string().min(1, "Address is required"),
   neighborhood: z.string().min(1, "Neighborhood is required"),
   city: z.string().min(1, "City is required"),
   number: z.string().min(1, "Number is required")
});

export type OnboardingCorporateDto = z.infer<typeof onboardingCorporateSchema>;