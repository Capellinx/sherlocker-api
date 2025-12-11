import type { NextFunction, Response, Request } from "express";
import type { ZodType } from "zod";

interface IRequestSchemas {
   params?: ZodType;
   body?: ZodType;
   query?: ZodType;
}

export class RequestValidationMiddleware {
   static execute(schemas: IRequestSchemas) {
      return async (request: Request, response: Response, next: NextFunction) => {
         try {
            if (schemas.params) {
               request.params = await schemas.params.parseAsync(request.params) as typeof request.params;
            }
            if (schemas.body) {
               request.body = await schemas.body.parseAsync(request.body);
            }
            if (schemas.query) {
               request.query = await schemas.query.parseAsync(request.query) as typeof request.query;
            }
            next();
         } catch (err) {
            next(err);
         }
      };
   }
}