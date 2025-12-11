import type { Request, Response } from "express";
import type { ValidateCnpjUsecase } from "@/application/use-cases/validate-cnpj/validate-cnpj.usecase.ts";

export class ValidateCnpjController {
   constructor(private readonly validateCnpjUsecase: ValidateCnpjUsecase) {}

   async handle(req: Request, res: Response) {
      const { cnpj } = req.params;

      if (!cnpj) {
         return res.status(400).json({
            success: false,
            message: "CNPJ is required",
         });
      }

      const result = await this.validateCnpjUsecase.execute(cnpj);

      return res.status(200).json({
         success: true,
         data: result,
      });
   }
}
