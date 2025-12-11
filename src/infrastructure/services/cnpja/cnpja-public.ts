export interface CnpjaCompanyResponse {
   updated: string;
   taxId: string;
   alias: string | null;
   founded: string;
   head: boolean;
   company: {
      members: any[];
      id: number;
      name: string;
      equity: number;
      nature: {
         id: number;
         text: string;
      };
      size: {
         id: number;
         acronym: string;
         text: string;
      };
      simples: {
         optant: boolean;
         since: string;
      };
      simei: {
         optant: boolean;
         since: string;
      };
   };
   statusDate: string;
   status: {
      id: number;
      text: string;
   };
   address: {
      municipality: number;
      street: string;
      number: string;
      district: string;
      city: string;
      state: string;
      details: string;
      zip: string;
      country: {
         id: number;
         name: string;
      };
   };
   mainActivity: {
      id: number;
      text: string;
   };
   phones: Array<{
      type: string;
      area: string;
      number: string;
   }>;
   emails: Array<{
      ownership: string;
      address: string;
      domain: string;
   }>;
   sideActivities: Array<{
      id: number;
      text: string;
   }>;
   suframa: any[];
}

export interface CnpjaApiResponse {
   success: boolean;
   data: CnpjaCompanyResponse | null;
   message?: string;
}

export class CnpjaPublicService {
   private readonly baseUrl = "https://open.cnpja.com/office";

   async findByCnpj(cnpj: string): Promise<CnpjaApiResponse> {
      try {
         const cleanedCnpj = cnpj.replace(/\D/g, '');
         
         const response = await fetch(`${this.baseUrl}/${cleanedCnpj}`, {
            method: 'GET',
            headers: {
               'Accept': 'application/json'
            }
         });

         if (!response.ok) {
            if (response.status === 404) {
               return {
                  success: false,
                  data: null,
                  message: 'CNPJ not found'
               };
            }
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
         }

         const data = await response.json();
         
         return {
            success: true,
            data: data as CnpjaCompanyResponse,
         };
      } catch (error) {
         return {
            success: false,
            data: null,
            message: error instanceof Error ? error.message : 'Unknown error'
         };
      }
   }
}
