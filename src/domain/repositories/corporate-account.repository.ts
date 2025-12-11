import type { CorporateAccount } from "../entities/corporate-account.ts";

export interface ICorporateAccountRepository {
   create(payload: CorporateAccount): Promise<CorporateAccount>;
   findById(id: string): Promise<CorporateAccount | null>;
   findByEmail(email: string): Promise<CorporateAccount | null>;
   findByCnpj(cnpj: string): Promise<CorporateAccount | null>;
   findAll(): Promise<CorporateAccount[]>;
   update(id: string, payload: Partial<CorporateAccount>): Promise<CorporateAccount | null>;
   delete(id: string): Promise<boolean>;
   softDelete(id: string): Promise<boolean>;
}