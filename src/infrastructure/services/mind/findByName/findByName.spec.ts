import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByNameService } from './findByName.ts';

describe('FindByNameService', () => {
   let service: FindByNameService;

   beforeEach(() => {
      service = new FindByNameService();
   });

   describe('execute', () => {
      it('should call Mind API with valid name and page', async () => {
         const name = 'João Silva';
         const page = 1;
         const mockResponse = {
            success: true,
            data: { 
               name: 'João Silva',
               results: []
            },
            message: 'Name search completed'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(name, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/nome_abreviado/${name}/${page}`);
      });

      it('should handle short names', async () => {
         const name = 'Jo';
         const page = 1;
         const mockResponse = {
            success: true,
            data: { results: [] },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(name, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/nome_abreviado/Jo/1');
      });

      it('should handle names with multiple words', async () => {
         const name = 'Maria da Silva Santos';
         const page = 2;
         const mockResponse = {
            success: true,
            data: { results: [] },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(name, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/nome_abreviado/Maria da Silva Santos/2');
      });

      it('should return error when API fails', async () => {
         const name = 'João';
         const page = 1;
         const mockError = {
            success: false,
            data: null,
            message: 'API Error'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockError);

         const result = await service.execute(name, page);

         expect(result.success).toBe(false);
         expect(result.message).toBe('API Error');
      });

      it('should handle different page numbers', async () => {
         const name = 'Pedro';
         const page = 10;
         const mockResponse = {
            success: true,
            data: { page: 10 },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(name, page);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/nome_abreviado/Pedro/10');
      });
   });
});
