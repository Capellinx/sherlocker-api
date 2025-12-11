import { IndividualAccountEntity } from "@/domain/entities/individual-account.ts";
import type { IIndividualAccountRepository } from "@/domain/repositories/individual-account.repository.ts";
import type { IndividualAccount } from "@/domain/entities/individual-account.ts";
import { prisma } from "@/main.ts";

export class IndividualAccountPrismaRepository implements IIndividualAccountRepository {
   async create(payload: IndividualAccount): Promise<IndividualAccount> {
      const data = IndividualAccountEntity.toPrisma(payload);

      const created = await prisma.individualAccount.create({
         data,
      });

      return IndividualAccountEntity.fromPrisma(created);
   }

   async findById(id: string): Promise<IndividualAccount | null> {
      const account = await prisma.individualAccount.findUnique({
         where: { id },
      });

      if (!account) return null;

      return IndividualAccountEntity.fromPrisma(account);
   }

   async findByEmail(email: string): Promise<IndividualAccount | null> {
      const account = await prisma.individualAccount.findUnique({
         where: { email },
      });

      if (!account) return null;

      return IndividualAccountEntity.fromPrisma(account);
   }

   async findByCpf(cpf: string): Promise<IndividualAccount | null> {
      const account = await prisma.individualAccount.findUnique({
         where: { cpf },
      });

      if (!account) return null;

      return IndividualAccountEntity.fromPrisma(account);
   }

   async findAll(): Promise<IndividualAccount[]> {
      const accounts = await prisma.individualAccount.findMany({
         where: { deletedAt: null },
         orderBy: { createdAt: 'desc' },
      });

      return accounts.map(account => IndividualAccountEntity.fromPrisma(account));
   }

   async update(id: string, payload: Partial<IndividualAccount>): Promise<IndividualAccount | null> {
      const updateData: any = {
         updatedAt: new Date(),
      };

      if (payload.name !== undefined) updateData.name = payload.name || null;
      if (payload.email !== undefined) updateData.email = payload.email;
      if (payload.phone !== undefined) updateData.phone = payload.phone || null;
      if (payload.cpf !== undefined) updateData.cpf = payload.cpf || null;
      if (payload.deletedAt !== undefined) updateData.deletedAt = payload.deletedAt || null;

      try {
         const updated = await prisma.individualAccount.update({
            where: { id },
            data: updateData,
         });

         return IndividualAccountEntity.fromPrisma(updated);
      } catch (error) {
         return null;
      }
   }

   async delete(id: string): Promise<boolean> {
      try {
         await prisma.individualAccount.delete({
            where: { id },
         });
         return true;
      } catch (error) {
         return false;
      }
   }

   async softDelete(id: string): Promise<boolean> {
      try {
         await prisma.individualAccount.update({
            where: { id },
            data: {
               deletedAt: new Date(),
               updatedAt: new Date(),
            },
         });
         return true;
      } catch (error) {
         return false;
      }
   }
}