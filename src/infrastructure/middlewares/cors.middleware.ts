import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.ts";

const CORS_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 horas

export class CorsMiddleware {
   static execute(req: Request, res: Response, next: NextFunction) {
      const origin = req.headers.origin;
      const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());

      // Se ALLOWED_ORIGINS for '*', permite qualquer origem
      if (allowedOrigins.includes('*')) {
         res.header("Access-Control-Allow-Origin", "*");
      } else if (origin && allowedOrigins.includes(origin)) {
         // Se a origem estiver na lista de permitidas
         res.header("Access-Control-Allow-Origin", origin);
         res.header("Access-Control-Allow-Credentials", "true");
      } else if (!origin) {
         // Requisições sem origin (ex: Postman, curl)
         res.header("Access-Control-Allow-Origin", "*");
      } else {
         // Origem não permitida - ainda responde OPTIONS mas sem permitir a origem
         if (req.method === "OPTIONS") {
            return res.sendStatus(403);
         }
      }

      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Max-Age", String(CORS_MAX_AGE_SECONDS));

      if (req.method === "OPTIONS") {
         return res.sendStatus(200);
      }

      next();
   }
}
