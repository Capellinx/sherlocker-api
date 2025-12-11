import type { Request, Response } from "express";
import type { ListPlansUsecase } from "@/application/use-cases/plans/list-plans.usecase.ts";

export class ListPlansController {
   constructor(
      private readonly listPlansUsecase: ListPlansUsecase
   ) { }

   async handle(_req: Request, res: Response) {
      const result = await this.listPlansUsecase.execute();

      return res.status(200).json(result);
   }
}
