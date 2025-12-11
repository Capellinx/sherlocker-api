import { isValidCNPJ } from "@/infrastructure/utils/validate-document.ts";
import { CnpjaPublicService } from "@/infrastructure/services/cnpja/cnpja-public.ts";
import { FindByCnpjService } from "@/infrastructure/services/mind/findByCnpj/findByCnpj.ts";

interface ValidateCnpjResponse {
   isValid: boolean;
   companyName: string | null;
   companyType: string | null;
   email: string | null;
}

export class ValidateCnpjUsecase {
   constructor(
      private readonly cnpjaPublicService: CnpjaPublicService,
      private readonly findByCnpjService: FindByCnpjService
   ) {}

   async execute(cnpj: string): Promise<ValidateCnpjResponse> {
      const isValid = isValidCNPJ(cnpj);

      if (!isValid) {
         return {
            isValid: false,
            companyName: null,
            companyType: null,
            email: null
         };
      }

      const publicApiResponse = await this.cnpjaPublicService.findByCnpj(cnpj);

      if (publicApiResponse.success && publicApiResponse.data) {
         const data = publicApiResponse.data;
         
         return {
            isValid: true,
            companyName: data.company.name || null,
            companyType: data.company.nature?.text || null,
            email: data.emails?.[0]?.address || null
         };
      }

      const mindApiResponse = await this.findByCnpjService.execute(cnpj);

      if (!mindApiResponse.success || !mindApiResponse.data) {
         return {
            isValid: true,
            companyName: null,
            companyType: null,
            email: null
         };
      }

      let companyName: string | null = null;
      let companyType: string | null = null;
      let email: string | null = null;

      if (mindApiResponse.data.data?.razao_social) {
         companyName = mindApiResponse.data.data.razao_social;
      } else if (mindApiResponse.data.razao_social) {
         companyName = mindApiResponse.data.razao_social;
      }

      if (mindApiResponse.data.data?.natureza_juridica) {
         companyType = mindApiResponse.data.data.natureza_juridica;
      } else if (mindApiResponse.data.natureza_juridica) {
         companyType = mindApiResponse.data.natureza_juridica;
      }

      if (mindApiResponse.data.data?.email) {
         email = mindApiResponse.data.data.email;
      } else if (mindApiResponse.data.email) {
         email = mindApiResponse.data.email;
      } else if (mindApiResponse.data.data?.emails && Array.isArray(mindApiResponse.data.data.emails) && mindApiResponse.data.data.emails.length > 0) {
         email = mindApiResponse.data.data.emails[0];
      }

      return {
         isValid: true,
         companyName,
         companyType,
         email
      };
   }
}
