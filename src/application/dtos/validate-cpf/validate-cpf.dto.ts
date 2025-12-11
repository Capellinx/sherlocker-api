import { z } from 'zod';

export const validateCpfSchema = z.object({
   document: z
      .string()
      .min(11, 'Document must have at least 11 digits')
      .max(18, 'Document must have at most 18 characters (including formatting)')
      .refine(
         (doc) => /^\d+$/.test(doc.replace(/\D/g, '')),
         'Document must contain only numbers'
      )
});

export type ValidateCpfDTO = z.infer<typeof validateCpfSchema>;
