import type { IndividualAccount } from "./individual-account.ts";
import type { CorporateAccount } from "./corporate-account.ts";

export interface Auth {
   id: string;
   name?: string | undefined;
   surname?: string | undefined;
   email?: string | undefined;
   isMissingOnboarding: boolean;
   tokenCount: number;
   individualAccountId?: string | undefined;
   corporateAccountId?: string | undefined;
   createdAt?: Date | undefined;
   updatedAt?: Date | undefined;
   deletedAt?: Date | undefined;
}

export interface AuthWithAccounts extends Auth {
   individualAccount?: IndividualAccount | undefined;
   corporateAccount?: CorporateAccount | undefined;
}

export class AuthEntity implements Auth {
   constructor(
      private _id: string,
      private _isMissingOnboarding: boolean = true,
      private _tokenCount: number = 0,
      private _name?: string,
      private _surname?: string,
      private _email?: string,
      private _individualAccountId?: string,
      private _corporateAccountId?: string,
      private _createdAt: Date = new Date(),
      private _updatedAt: Date = new Date(),
      private _deletedAt?: Date
   ) {}

   get id(): string {
      return this._id;
   }

   get name(): string | undefined {
      return this._name;
   }

   set name(value: string | undefined) {
      this._name = value;
      this._updatedAt = new Date();
   }

   get surname(): string | undefined {
      return this._surname;
   }

   set surname(value: string | undefined) {
      this._surname = value;
      this._updatedAt = new Date();
   }

   get email(): string | undefined {
      return this._email;
   }

   set email(value: string | undefined) {
      this._email = value;
      this._updatedAt = new Date();
   }

   get isMissingOnboarding(): boolean {
      return this._isMissingOnboarding;
   }

   set isMissingOnboarding(value: boolean) {
      this._isMissingOnboarding = value;
      this._updatedAt = new Date();
   }

   get tokenCount(): number {
      return this._tokenCount;
   }

   set tokenCount(value: number) {
      this._tokenCount = value;
      this._updatedAt = new Date();
   }

   get individualAccountId(): string | undefined {
      return this._individualAccountId;
   }

   set individualAccountId(value: string | undefined) {
      this._individualAccountId = value;
      this._updatedAt = new Date();
   }

   get corporateAccountId(): string | undefined {
      return this._corporateAccountId;
   }

   set corporateAccountId(value: string | undefined) {
      this._corporateAccountId = value;
      this._updatedAt = new Date();
   }

   get createdAt(): Date | undefined {
      return this._createdAt;
   }

   get updatedAt(): Date | undefined {
      return this._updatedAt;
   }

   get deletedAt(): Date | undefined {
      return this._deletedAt;
   }

   set deletedAt(value: Date | undefined) {
      this._deletedAt = value;
      this._updatedAt = new Date();
   }

   // Domain methods for token management
   hasEnoughTokens(requiredAmount: number): boolean {
      return this._tokenCount >= requiredAmount;
   }

   deductTokens(amount: number): void {
      if (amount < 0) {
         throw new Error('Token amount must be positive');
      }
      if (this._tokenCount < amount) {
         throw new Error('Insufficient tokens');
      }
      this._tokenCount -= amount;
      this._updatedAt = new Date();
   }

   resetTokens(newAmount: number): void {
      if (newAmount < 0) {
         throw new Error('Token amount must be positive');
      }
      this._tokenCount = newAmount;
      this._updatedAt = new Date();
   }

   addTokens(amount: number): void {
      if (amount < 0) {
         throw new Error('Token amount must be positive');
      }
      this._tokenCount += amount;
      this._updatedAt = new Date();
   }

   toJSON(): Auth {
      return {
         id: this._id,
         name: this._name,
         surname: this._surname,
         email: this._email,
         isMissingOnboarding: this._isMissingOnboarding,
         tokenCount: this._tokenCount,
         individualAccountId: this._individualAccountId,
         corporateAccountId: this._corporateAccountId,
         createdAt: this._createdAt,
         updatedAt: this._updatedAt,
         deletedAt: this._deletedAt,
      };
   }

   static create(data: Omit<Auth, 'id' | 'createdAt' | 'updatedAt'>): AuthEntity {
      const now = new Date();
      return new AuthEntity(
         crypto.randomUUID(),
         data.isMissingOnboarding,
         data.tokenCount,
         data.name,
         data.surname,
         data.email,
         data.individualAccountId,
         data.corporateAccountId,
         now,
         now,
         data.deletedAt
      );
   }

   static from(data: Auth): AuthEntity {
      return new AuthEntity(
         data.id,
         data.isMissingOnboarding,
         data.tokenCount,
         data.name,
         data.surname,
         data.email,
         data.individualAccountId,
         data.corporateAccountId,
         data.createdAt,
         data.updatedAt,
         data.deletedAt
      );
   }

   static toDomain(entity: AuthEntity): Auth {
      return {
         id: entity.id,
         name: entity.name,
         surname: entity.surname,
         email: entity.email,
         isMissingOnboarding: entity.isMissingOnboarding,
         tokenCount: entity.tokenCount,
         individualAccountId: entity.individualAccountId,
         corporateAccountId: entity.corporateAccountId,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         deletedAt: entity.deletedAt,
      };
   }

   static toEntity(entity: AuthEntity): Auth {
      return {
         id: entity.id,
         name: entity.name,
         surname: entity.surname,
         email: entity.email,
         isMissingOnboarding: entity.isMissingOnboarding,
         tokenCount: entity.tokenCount,
         individualAccountId: entity.individualAccountId,
         corporateAccountId: entity.corporateAccountId,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         deletedAt: entity.deletedAt,
      };
   }

   static fromPrisma(prismaAuth: any): Auth {
      return {
         id: prismaAuth.id,
         name: prismaAuth.name || undefined,
         surname: prismaAuth.surname || undefined,
         email: prismaAuth.email || undefined,
         isMissingOnboarding: prismaAuth.isMissingOnboarding,
         tokenCount: prismaAuth.tokenCount || 0,
         individualAccountId: prismaAuth.individualAccountId || undefined,
         corporateAccountId: prismaAuth.corporateAccountId || undefined,
         createdAt: prismaAuth.createdAt || undefined,
         updatedAt: prismaAuth.updatedAt || undefined,
         deletedAt: prismaAuth.deletedAt || undefined,
      };
   }

   static toPrisma(auth: Auth): any {
      return {
         id: auth.id,
         name: auth.name || null,
         surname: auth.surname || null,
         email: auth.email || null,
         isMissingOnboarding: auth.isMissingOnboarding,
         tokenCount: auth.tokenCount,
         individualAccountId: auth.individualAccountId || null,
         corporateAccountId: auth.corporateAccountId || null,
         createdAt: auth.createdAt || new Date(),
         updatedAt: auth.updatedAt || new Date(),
         deletedAt: auth.deletedAt || null,
      };
   }
}