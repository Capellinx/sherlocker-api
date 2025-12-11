import { isValidCPF } from "@/infrastructure/utils/validate-document.ts";
import { FindByCpfService } from "@/infrastructure/services/mind/findByCpf/findByCpf.ts";

interface ValidateCpfResponse {
   isValid: boolean;
   birthDate: string | null;
}

export class ValidateCpfUsecase {
   constructor(
      private readonly findByCpfService: FindByCpfService
   ) {}

   async execute(cpf: string): Promise<ValidateCpfResponse> {
      const isValid = isValidCPF(cpf);

      if (!isValid) {
         return {
            isValid: false,
            birthDate: null
         };
      }

      const response = await this.findByCpfService.execute(cpf);

      if (!response.success || !response.data) {
         return {
            isValid: true,
            birthDate: null
         };
      }

      let birthDate: string | null = null;

      if (response.data.data?.source_a?.juventude?.[0]?.dtnascimento) {
         birthDate = response.data.data.source_a.juventude[0].dtnascimento;
      }
      else if (response.data.data?.source_a?.receita_federal?.[0]?.dataNascimento) {
         const dateNum = response.data.data.source_a.receita_federal[0].dataNascimento;
         const dateStr = String(dateNum);
         if (dateStr.length === 8) {
            birthDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
         }
      }
      else if (response.data.data?.source_b?.dados_serasa?.[0]?.NASC) {
         birthDate = response.data.data.source_b.dados_serasa[0].NASC;
      }
      else if (response.data.data?.source_c?.dados_pessoais?.[0]?.NASC) {
         const nascValue = response.data.data.source_c.dados_pessoais[0].NASC;
         if (nascValue.includes(' ')) {
            birthDate = nascValue.split(' ')[0];
         } else {
            birthDate = nascValue;
         }
      }

      return {
         isValid: true,
         birthDate
      };
   }
}