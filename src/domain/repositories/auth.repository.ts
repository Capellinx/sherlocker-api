import type { Auth, AuthWithAccounts } from "../entities/auth.ts";

export interface IAuthRepository {
   create(payload: Auth): Promise<Auth>;
   findById(id: string): Promise<Auth | null>;
   findByIdWithAccounts(id: string): Promise<AuthWithAccounts | null>;
   findByEmail(email: string): Promise<Auth | null>;
   findByIndividualAccountId(individualAccountId: string): Promise<Auth | null>;
   findByCorporateAccountId(corporateAccountId: string): Promise<Auth | null>;
   findAll(): Promise<Auth[]>;
   update(id: string, payload: Partial<Auth>): Promise<Auth | null>;
   delete(id: string): Promise<boolean>;
   softDelete(id: string): Promise<boolean>;
}