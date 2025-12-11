import { AuthEntity } from "@/domain/entities/auth.ts";
import { IndividualAccountEntity } from "@/domain/entities/individual-account.ts";
import { CorporateAccountEntity } from "@/domain/entities/corporate-account.ts";
import type { IAuthRepository } from "@/domain/repositories/auth.repository.ts";
import type { Auth, AuthWithAccounts } from "@/domain/entities/auth.ts";
import { prisma } from "@/main.ts";

export class AuthPrismaRepository implements IAuthRepository {
   async create(payload: Auth): Promise<Auth> {
      const data = AuthEntity.toPrisma(payload);

      const created = await prisma.auth.create({
         data,
      });

      return AuthEntity.fromPrisma(created);
   }

   async findById(id: string): Promise<Auth | null> {
      const auth = await prisma.auth.findUnique({
         where: { id },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
      });

      if (!auth) return null;

      return AuthEntity.fromPrisma(auth);
   }

   async findByIdWithAccounts(id: string): Promise<AuthWithAccounts | null> {
      const auth = await prisma.auth.findUnique({
         where: { id },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
      });

      if (!auth) return null;

      const authData = AuthEntity.fromPrisma(auth);
      
      return {
         ...authData,
         individualAccount: auth.individualAccount 
            ? IndividualAccountEntity.fromPrisma(auth.individualAccount) 
            : undefined,
         corporateAccount: auth.corporateAccount 
            ? CorporateAccountEntity.fromPrisma(auth.corporateAccount) 
            : undefined,
      };
   }

   async findByEmail(email: string): Promise<Auth | null> {
      const auth = await prisma.auth.findUnique({
         where: { email },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
      });

      if (!auth) return null;

      return AuthEntity.fromPrisma(auth);
   }

   async findByIndividualAccountId(individualAccountId: string): Promise<Auth | null> {
      const auth = await prisma.auth.findFirst({
         where: { individualAccountId },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
      });

      if (!auth) return null;

      return AuthEntity.fromPrisma(auth);
   }

   async findByCorporateAccountId(corporateAccountId: string): Promise<Auth | null> {
      const auth = await prisma.auth.findFirst({
         where: { corporateAccountId },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
      });

      if (!auth) return null;

      return AuthEntity.fromPrisma(auth);
   }

   async findAll(): Promise<Auth[]> {
      const auths = await prisma.auth.findMany({
         where: { deletedAt: null },
         include: {
            individualAccount: true,
            corporateAccount: true,
         },
         orderBy: { createdAt: 'desc' },
      });

      return auths.map(auth => AuthEntity.fromPrisma(auth));
   }

   async update(id: string, payload: Partial<Auth>): Promise<Auth | null> {
      const updateData: any = {
         updatedAt: new Date(),
      };

      if (payload.name !== undefined) updateData.name = payload.name || null;
      if (payload.surname !== undefined) updateData.surname = payload.surname || null;
      if (payload.email !== undefined) updateData.email = payload.email || null;
      if (payload.isMissingOnboarding !== undefined) updateData.isMissingOnboarding = payload.isMissingOnboarding;
      if (payload.tokenCount !== undefined) updateData.tokenCount = payload.tokenCount;
      if (payload.individualAccountId !== undefined) updateData.individualAccountId = payload.individualAccountId || null;
      if (payload.corporateAccountId !== undefined) updateData.corporateAccountId = payload.corporateAccountId || null;
      if (payload.deletedAt !== undefined) updateData.deletedAt = payload.deletedAt || null;

      try {
         const updated = await prisma.auth.update({
            where: { id },
            data: updateData,
            include: {
               individualAccount: true,
               corporateAccount: true,
            },
         });

         return AuthEntity.fromPrisma(updated);
      } catch (error) {
         return null;
      }
   }

   async delete(id: string): Promise<boolean> {
      try {
         await prisma.auth.delete({
            where: { id },
         });
         return true;
      } catch (error) {
         return false;
      }
   }

   async softDelete(id: string): Promise<boolean> {
      try {
         await prisma.auth.update({
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