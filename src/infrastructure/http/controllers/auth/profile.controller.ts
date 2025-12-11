import type { Request, Response } from "express";
import type { ProfileUsecase } from "@/application/use-cases/auth/profile/profile.usecase.ts";

export class ProfileController {
   constructor(
      private readonly profileUsecase: ProfileUsecase
   ) { }

   async handle(req: Request, res: Response) {
      const authId = req.user?.id;
      
      const result = await this.profileUsecase.execute(authId);

      return res.status(200).json(result);
   }
}
