export interface CorporateAccount {
   id: string;
   ownerName?: string | undefined;
   socialReason?: string | undefined;
   email?: string | undefined;
   phone?: string | undefined;
   cnpj?: string | undefined;
   cep?: string | undefined;
   state?: string | undefined;
   address?: string | undefined;
   neighborhood?: string | undefined;
   city?: string | undefined;
   number?: string | undefined;
   createdAt?: Date | undefined;
   updatedAt?: Date | undefined;
   deletedAt?: Date | undefined;
}

export class CorporateAccountEntity implements CorporateAccount {
   constructor(
      private _id: string,
      private _ownerName?: string,
      private _socialReason?: string,
      private _email?: string,
      private _phone?: string,
      private _cnpj?: string,
      private _cep?: string,
      private _state?: string,
      private _address?: string,
      private _neighborhood?: string,
      private _city?: string,
      private _number?: string,
      private _createdAt: Date = new Date(),
      private _updatedAt: Date = new Date(),
      private _deletedAt?: Date
   ) {}

   get id(): string {
      return this._id;
   }

   get ownerName(): string | undefined {
      return this._ownerName;
   }

   set ownerName(value: string | undefined) {
      this._ownerName = value;
      this._updatedAt = new Date();
   }

   get socialReason(): string | undefined {
      return this._socialReason;
   }

   set socialReason(value: string | undefined) {
      this._socialReason = value;
      this._updatedAt = new Date();
   }

   get email(): string | undefined {
      return this._email;
   }

   set email(value: string | undefined) {
      this._email = value;
      this._updatedAt = new Date();
   }

   get phone(): string | undefined {
      return this._phone;
   }

   set phone(value: string | undefined) {
      this._phone = value;
      this._updatedAt = new Date();
   }

   get cnpj(): string | undefined {
      return this._cnpj;
   }

   set cnpj(value: string | undefined) {
      this._cnpj = value;
      this._updatedAt = new Date();
   }

   get cep(): string | undefined {
      return this._cep;
   }

   set cep(value: string | undefined) {
      this._cep = value;
      this._updatedAt = new Date();
   }

   get state(): string | undefined {
      return this._state;
   }

   set state(value: string | undefined) {
      this._state = value;
      this._updatedAt = new Date();
   }

   get address(): string | undefined {
      return this._address;
   }

   set address(value: string | undefined) {
      this._address = value;
      this._updatedAt = new Date();
   }

   get neighborhood(): string | undefined {
      return this._neighborhood;
   }

   set neighborhood(value: string | undefined) {
      this._neighborhood = value;
      this._updatedAt = new Date();
   }

   get city(): string | undefined {
      return this._city;
   }

   set city(value: string | undefined) {
      this._city = value;
      this._updatedAt = new Date();
   }

   get number(): string | undefined {
      return this._number;
   }

   set number(value: string | undefined) {
      this._number = value;
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

   static create(data: Omit<CorporateAccount, 'id' | 'createdAt' | 'updatedAt'>): CorporateAccountEntity {
      const now = new Date();
      return new CorporateAccountEntity(
         crypto.randomUUID(),
         data.ownerName,
         data.socialReason,
         data.email,
         data.phone,
         data.cnpj,
         data.cep,
         data.state,
         data.address,
         data.neighborhood,
         data.city,
         data.number,
         now,
         now,
         data.deletedAt
      );
   }

   static toDomain(entity: CorporateAccountEntity): CorporateAccount {
      return {
         id: entity.id,
         ownerName: entity.ownerName,
         socialReason: entity.socialReason,
         email: entity.email,
         phone: entity.phone,
         cnpj: entity.cnpj,
         cep: entity.cep,
         state: entity.state,
         address: entity.address,
         neighborhood: entity.neighborhood,
         city: entity.city,
         number: entity.number,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         deletedAt: entity.deletedAt,
      };
   }

   static toEntity(entity: CorporateAccountEntity): CorporateAccount {
      return {
         id: entity.id,
         ownerName: entity.ownerName,
         socialReason: entity.socialReason,
         email: entity.email,
         phone: entity.phone,
         cnpj: entity.cnpj,
         cep: entity.cep,
         state: entity.state,
         address: entity.address,
         neighborhood: entity.neighborhood,
         city: entity.city,
         number: entity.number,
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
         deletedAt: entity.deletedAt,
      };
   }

   static fromPrisma(prismaAccount: any): CorporateAccount {
      return {
         id: prismaAccount.id,
         ownerName: prismaAccount.ownerName || undefined,
         socialReason: prismaAccount.socialReason || undefined,
         email: prismaAccount.email || undefined,
         phone: prismaAccount.phone || undefined,
         cnpj: prismaAccount.cnpj || undefined,
         cep: prismaAccount.cep || undefined,
         state: prismaAccount.state || undefined,
         address: prismaAccount.address || undefined,
         neighborhood: prismaAccount.neighborhood || undefined,
         city: prismaAccount.city || undefined,
         number: prismaAccount.number || undefined,
         createdAt: prismaAccount.createdAt || undefined,
         updatedAt: prismaAccount.updatedAt || undefined,
         deletedAt: prismaAccount.deletedAt || undefined,
      };
   }

   static toPrisma(account: CorporateAccount): any {
      return {
         id: account.id,
         ownerName: account.ownerName || null,
         socialReason: account.socialReason || null,
         email: account.email || null,
         phone: account.phone || null,
         cnpj: account.cnpj || null,
         cep: account.cep || null,
         state: account.state || null,
         address: account.address || null,
         neighborhood: account.neighborhood || null,
         city: account.city || null,
         number: account.number || null,
         createdAt: account.createdAt || new Date(),
         updatedAt: account.updatedAt || new Date(),
         deletedAt: account.deletedAt || null,
      };
   }
}