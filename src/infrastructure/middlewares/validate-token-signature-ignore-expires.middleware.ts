import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../config/errors.ts";
import { env } from "../config/env.ts";

declare global {
   namespace Express {
      interface Request {
         user?: any;
      }
   }
}

export class ValidateTokenSignatureMiddleware {
   static execute(req: Request, res: Response, next: NextFunction) {
      try {
         const authHeader = req.headers.authorization;
         const token = authHeader?.startsWith('Bearer ') 
            ? authHeader.substring(7) 
            : req.cookies?.token;

         if (!token) {
            throw new UnauthorizedError("Token is required");
         }

         const decoded = jwt.verify(token, env.JWT_SECRET, { ignoreExpiration: true });
         req.user = decoded;
         
         next();
      } catch (error) {
         throw new UnauthorizedError("Invalid token");
      }
   }
}