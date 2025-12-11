import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByPhoneService } from './findByPhone.ts';

describe('FindByPhoneService', () => {
   let service: FindByPhoneService;

   beforeEach(() => {
      service = new FindByPhoneService();
   });

   describe('execute', () => {
      it('should call Mind API with valid phone (11 digits)', async () => {
         const phone = '11999887766';
         const mockResponse = {
            success: true,
            data: { 
               phone: '11999887766',
               owner: 'João Silva'
            },
            message: 'Phone found'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(phone);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith(`/api/telefonia/${phone}`);
      });

      it('should call Mind API with valid phone (10 digits)', async () => {
         const phone = '1199887766';
         const mockResponse = {
            success: true,
            data: { 
               phone: '1199887766'
            },
            message: 'Phone found'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(phone);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/telefonia/1199887766');
      });

      it('should return error when API fails', async () => {
         const phone = '11999887766';
         const mockError = {
            success: false,
            data: null,
            message: 'API Error'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockError);

         const result = await service.execute(phone);

         expect(result.success).toBe(false);
         expect(result.message).toBe('API Error');
      });

      it('should handle phone with zeros', async () => {
         const phone = '00000000000';
         const mockResponse = {
            success: true,
            data: { phone: '00000000000' },
            message: 'Success'
         };

         vi.spyOn(service as any, 'get').mockResolvedValue(mockResponse);

         const result = await service.execute(phone);

         expect(result).toEqual(mockResponse);
         expect((service as any).get).toHaveBeenCalledWith('/api/telefonia/00000000000');
      });
   });
});
