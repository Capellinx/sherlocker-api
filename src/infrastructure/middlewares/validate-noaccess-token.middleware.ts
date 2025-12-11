import type { NextFunction, Request, Response } from "express";
import { jwtService } from "@/infrastructure/services/jwt/index.ts";
import { UnauthorizedError } from "../config/errors.ts";

declare global {
   namespace Express {
      interface Request {
         user?: any;
      }
   }
}

export class ValidateNoAccessTokenMiddleware {
   static async execute(req: Request, res: Response, next: NextFunction) {
      try {
         const authHeader = req.headers.authorization;
         const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : req.cookies?.token;

         if (!token) {
            throw new UnauthorizedError("Token is required");
         }

         const tokenVerification = await jwtService.verify(token, true);
         
         if (!tokenVerification.isValid || !tokenVerification.payload) {
            throw new UnauthorizedError("Invalid or expired token");
         }

         req.user = tokenVerification.payload;
         
         next();
      } catch (error) {
         if (error instanceof UnauthorizedError) {
            throw error;
         }
         throw new UnauthorizedError("Token validation failed");
      }
   }
}
