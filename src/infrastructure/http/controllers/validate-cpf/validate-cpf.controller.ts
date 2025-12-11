import type { Request, Response } from "express";
import type { ValidateCpfUsecase } from "@/application/use-cases/validate-document/validate-cpf.usecase.ts";

export class ValidateCpfController {
   constructor(private readonly validateCpfUsecase: ValidateCpfUsecase) {}

   async handle(req: Request, res: Response) {
      const { cpf } = req.params;

      if (!cpf) {
         return res.status(400).json({
            success: false,
            message: "CPF is required",
         });
      }

      const result = await this.validateCpfUsecase.execute(cpf);

      return res.status(200).json({
         success: true,
         data: result,
      });
   }
}
