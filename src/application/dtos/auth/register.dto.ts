import z from "zod";

export const registerSchema = z.object({
   name: z.string().min(1, "Name is required"),
   surname: z.string().min(1, "Surname is required"),
   email: z.string().min(1, "Email is required").email("Invalid email"),
});

export type RegisterDto = z.infer<typeof registerSchema>;