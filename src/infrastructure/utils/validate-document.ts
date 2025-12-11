function cleanDocument(document: string): string {
   return document.replace(/\D/g, '');
}

export function isValidCPF(cpf: string): boolean {
   const cleanedCpf = cleanDocument(cpf);

   if (cleanedCpf.length !== 11) {
      return false;
   }

   if (/^(\d)\1{10}$/.test(cleanedCpf)) {
      return false;
   }

   let sum = 0;
   for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (10 - i);
   }
   let checkDigit = 11 - (sum % 11);
   if (checkDigit >= 10) checkDigit = 0;
   if (checkDigit !== parseInt(cleanedCpf.charAt(9))) {
      return false;
   }

   sum = 0;
   for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedCpf.charAt(i)) * (11 - i);
   }
   checkDigit = 11 - (sum % 11);
   if (checkDigit >= 10) checkDigit = 0;
   if (checkDigit !== parseInt(cleanedCpf.charAt(10))) {
      return false;
   }

   return true;
}

export function isValidCNPJ(cnpj: string): boolean {
   const cleanedCnpj = cleanDocument(cnpj);

   if (cleanedCnpj.length !== 14) {
      return false;
   }

   if (/^(\d)\1{13}$/.test(cleanedCnpj)) {
      return false;
   }

   let sum = 0;
   let weight = 5;
   for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedCnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
   }
   let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
   if (checkDigit !== parseInt(cleanedCnpj.charAt(12))) {
      return false;
   }

   sum = 0;
   weight = 6;
   for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanedCnpj.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
   }
   checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
   if (checkDigit !== parseInt(cleanedCnpj.charAt(13))) {
      return false;
   }

   return true;
}

export function validateDocument(document: string): { 
   isValid: boolean; 
   type: 'CPF' | 'CNPJ' | 'UNKNOWN' 
} {
   const cleaned = cleanDocument(document);

   if (cleaned.length === 11) {
      return {
         isValid: isValidCPF(cleaned),
         type: 'CPF'
      };
   } else if (cleaned.length === 14) {
      return {
         isValid: isValidCNPJ(cleaned),
         type: 'CNPJ'
      };
   }

   return {
      isValid: false,
      type: 'UNKNOWN'
   };
}

export function getCleanDocument(document: string): string {
   return cleanDocument(document);
}
