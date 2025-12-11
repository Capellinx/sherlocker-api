import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.ts";

const CORS_MAX_AGE_SECONDS = 24 * 60 * 60; // 24 horas

export class CorsMiddleware {
   static execute(req: Request, res: Response, next: NextFunction) {
      try {
         const origin = req.headers.origin;
         const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());

         console.log(`[CORS] Request from origin: ${origin || 'no-origin'}`);
         console.log(`[CORS] Allowed origins: ${allowedOrigins.join(', ')}`);
         console.log(`[CORS] Method: ${req.method}`);
         console.log(`[CORS] Path: ${req.path}`);

         // Se ALLOWED_ORIGINS for '*', permite qualquer origem
         if (allowedOrigins.includes('*')) {
            res.header("Access-Control-Allow-Origin", "*");
            console.log('[CORS] Allowing all origins (*)');
         } else if (origin && allowedOrigins.includes(origin)) {
            // Se a origem estiver na lista de permitidas
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Credentials", "true");
            console.log(`[CORS] Origin ${origin} allowed`);
         } else if (!origin) {
            // Requisições sem origin (ex: Postman, curl)
            res.header("Access-Control-Allow-Origin", "*");
            console.log('[CORS] No origin header, allowing *');
         } else {
            // Origem não permitida
            console.log(`[CORS] Origin ${origin} NOT allowed`);
            if (req.method === "OPTIONS") {
               console.log('[CORS] Rejecting OPTIONS preflight with 403');
               return res.sendStatus(403);
            }
         }

         res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
         res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
         res.header("Access-Control-Max-Age", String(CORS_MAX_AGE_SECONDS));

         if (req.method === "OPTIONS") {
            console.log('[CORS] OPTIONS preflight - sending 200');
            return res.sendStatus(200);
         }

         next();
      } catch (error) {
         console.error('[CORS] Error in CORS middleware:', error);
         // Em caso de erro no CORS, permite a requisição para não quebrar a API
         res.header("Access-Control-Allow-Origin", "*");
         res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
         res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

         if (req.method === "OPTIONS") {
            return res.sendStatus(200);
         }

         next();
      }
   }
}
