import z from "zod";

export const listPlansResponseSchema = z.array(z.object({
   id: z.string(),
   name: z.string(),
   description: z.string().optional(),
   amount: z.number(),
   periodicity: z.enum(['DAYS', 'MONTHLY', 'ANNUAL']),
   isActive: z.boolean(),
   createdAt: z.date(),
   updatedAt: z.date(),
}));

export type ListPlansResponseDto = z.infer<typeof listPlansResponseSchema>;
