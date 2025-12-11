import { CorporateAccountEntity } from "@/domain/entities/corporate-account.ts";
import type { ICorporateAccountRepository } from "@/domain/repositories/corporate-account.repository.ts";
import type { CorporateAccount } from "@/domain/entities/corporate-account.ts";
import { prisma } from "@/main.ts";

export class CorporateAccountPrismaRepository implements ICorporateAccountRepository {
   async create(payload: CorporateAccount): Promise<CorporateAccount> {
      const data = CorporateAccountEntity.toPrisma(payload);

      const created = await prisma.corporateAccount.create({
         data,
      });

      return CorporateAccountEntity.fromPrisma(created);
   }

   async findById(id: string): Promise<CorporateAccount | null> {
      const account = await prisma.corporateAccount.findUnique({
         where: { id },
      });

      if (!account) return null;

      return CorporateAccountEntity.fromPrisma(account);
   }

   async findByEmail(email: string): Promise<CorporateAccount | null> {
      const account = await prisma.corporateAccount.findUnique({
         where: { email },
      });

      if (!account) return null;

      return CorporateAccountEntity.fromPrisma(account);
   }

   async findByCnpj(cnpj: string): Promise<CorporateAccount | null> {
      const account = await prisma.corporateAccount.findUnique({
         where: { cnpj },
      });

      if (!account) return null;

      return CorporateAccountEntity.fromPrisma(account);
   }

   async findAll(): Promise<CorporateAccount[]> {
      const accounts = await prisma.corporateAccount.findMany({
         where: { deletedAt: null },
         orderBy: { createdAt: 'desc' },
      });

      return accounts.map((account) => CorporateAccountEntity.fromPrisma(account));
   }

   async update(id: string, payload: Partial<CorporateAccount>): Promise<CorporateAccount | null> {
      const updateData: any = {
         updatedAt: new Date(),
      };

      if (payload.ownerName !== undefined) updateData.ownerName = payload.ownerName || null;
      if (payload.socialReason !== undefined) updateData.socialReason = payload.socialReason || null;
      if (payload.email !== undefined) updateData.email = payload.email || null;
      if (payload.cnpj !== undefined) updateData.cnpj = payload.cnpj || null;
      if (payload.deletedAt !== undefined) updateData.deletedAt = payload.deletedAt || null;

      try {
         const updated = await prisma.corporateAccount.update({
            where: { id },
            data: updateData,
         });

         return CorporateAccountEntity.fromPrisma(updated);
      } catch (error) {
         return null;
      }
   }

   async delete(id: string): Promise<boolean> {
      try {
         await prisma.corporateAccount.delete({
            where: { id },
         });
         return true;
      } catch (error) {
         return false;
      }
   }

   async softDelete(id: string): Promise<boolean> {
      try {
         await prisma.corporateAccount.update({
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