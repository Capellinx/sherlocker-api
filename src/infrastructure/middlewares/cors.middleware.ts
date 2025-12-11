import type { Request, Response, NextFunction } from "express";

const CORS_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 horas

export class CorsMiddleware {
   static execute(req: Request, res: Response, next: NextFunction) {
      const origin = req.headers.origin;

      // Permite todas as origens
      res.header("Access-Control-Allow-Origin", origin || "*");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Max-Age", String(CORS_MAX_AGE_SECONDS));

      if (req.method === "OPTIONS") {
         return res.sendStatus(200);
      }

      next();
   }
}
