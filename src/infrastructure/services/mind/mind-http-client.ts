import { env } from "@/infrastructure/config/env.ts";

export interface MindApiResponse<T = any> {
   success: boolean;
   data: T | null;
   message?: string;
   remainingTokens?: number;
}

export class MindHttpClient {
   private readonly baseUrl = "http://158.220.108.217:8000";
   private readonly bearerToken = env.MIND_TOKEN;

   private async makeRequest<T>(endpoint: string): Promise<MindApiResponse<T>> {
      try {
         const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: {
               'Authorization': `Bearer ${this.bearerToken}`,
               'Content-Type': 'application/json',
               'Accept': 'application/json'
            }
         });

         if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         const data = await response.json() as T;

         return {
            success: true,
            data
         };
      } catch (error) {
         return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error'
         };
      }
   }

   protected async get<T>(endpoint: string): Promise<MindApiResponse<T>> {
      return this.makeRequest<T>(endpoint) as Promise<MindApiResponse<T>>;
   }
}