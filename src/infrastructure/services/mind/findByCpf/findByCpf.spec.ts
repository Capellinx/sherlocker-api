import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByCpfService } from './findByCpf.ts';

describe('FindByCpfService', () => {
   let service: FindByCpfService;

   beforeEach(() => {
      service = new FindByCpfService();
   });

   describe('execute', () => {
      it('should call Mind API with valid CPF', async () => {
         const cpf = '12345678901';
         const mockResponse = {
            success: true,
            data: { 
               cpf: '12345678901',
               nome: 'João da Silva'
            },
            message: 'CPF found'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(cpf);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/cpf_completo/${cpf}`);
      });

      it('should return error when API fails', async () => {
         const cpf = '12345678901';
         const mockError = {
            success: false,
            data: null,
            message: 'API Error'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockError);

         const result = await service.execute(cpf);

         expect(result.success).toBe(false);
         expect(result.message).toBe('API Error');
      });

      it('should handle CPF with only numbers', async () => {
         const cpf = '00000000000';
         const mockResponse = {
            success: true,
            data: { cpf: '00000000000' },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(cpf);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/cpf_completo/00000000000');
      });
   });
});
