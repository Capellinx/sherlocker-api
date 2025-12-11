import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByCnpjService } from './findByCnpj.ts';

describe('FindByCnpjService', () => {
   let service: FindByCnpjService;

   beforeEach(() => {
      service = new FindByCnpjService();
   });

   describe('execute', () => {
      it('should call Mind API with valid CNPJ', async () => {
         const cnpj = '12345678000195';
         const mockResponse = {
            success: true,
            data: { 
               cnpj: '12345678000195',
               razaoSocial: 'Empresa Teste LTDA'
            },
            message: 'CNPJ found'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(cnpj);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/cnpj/${cnpj}`);
      });

      it('should return error when API fails', async () => {
         const cnpj = '12345678000195';
         const mockError = {
            success: false,
            data: null,
            message: 'API Error'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockError);

         const result = await service.execute(cnpj);

         expect(result.success).toBe(false);
         expect(result.message).toBe('API Error');
      });

      it('should handle CNPJ with only numbers', async () => {
         const cnpj = '00000000000000';
         const mockResponse = {
            success: true,
            data: { cnpj: '00000000000000' },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(cnpj);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/cnpj/00000000000000');
      });
   });
});
