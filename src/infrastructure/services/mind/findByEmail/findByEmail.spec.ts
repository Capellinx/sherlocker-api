import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByEmailService } from './findByEmail.ts';

describe('FindByEmailService', () => {
   let service: FindByEmailService;

   beforeEach(() => {
      service = new FindByEmailService();
   });

   describe('execute', () => {
      it('should call Mind API with valid email and page', async () => {
         const email = 'test@example.com';
         const page = 1;
         const mockResponse = {
            success: true,
            data: { 
               email: 'test@example.com',
               results: []
            },
            message: 'Email search completed'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(email, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/email/${encodeURIComponent(email)}/${page}`);
      });

      it('should handle email with special characters', async () => {
         const email = 'user+tag@example.com';
         const page = 2;
         const mockResponse = {
            success: true,
            data: { results: [] },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(email, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/email/${encodeURIComponent(email)}/2`);
      });

      it('should return error when API fails', async () => {
         const email = 'test@example.com';
         const page = 1;
         const mockError = {
            success: false,
            data: null,
            message: 'API Error'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockError);

         const result = await service.execute(email, page);

         expect(result.success).toBe(false);
         expect(result.message).toBe('API Error');
      });

      it('should handle different page numbers', async () => {
         const email = 'test@example.com';
         const page = 5;
         const mockResponse = {
            success: true,
            data: { page: 5 },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(email, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/email/${encodeURIComponent(email)}/5`);
      });
   });
});
