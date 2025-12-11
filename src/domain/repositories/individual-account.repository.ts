import type { IndividualAccount } from "../entities/individual-account.ts";

export interface IIndividualAccountRepository {
   create(payload: IndividualAccount): Promise<IndividualAccount>;
   findById(id: string): Promise<IndividualAccount | null>;
   findByEmail(email: string): Promise<IndividualAccount | null>;
   findByCpf(cpf: string): Promise<IndividualAccount | null>;
   findAll(): Promise<IndividualAccount[]>;
   update(id: string, payload: Partial<IndividualAccount>): Promise<IndividualAccount | null>;
   delete(id: string): Promise<boolean>;
   softDelete(id: string): Promise<boolean>;
}