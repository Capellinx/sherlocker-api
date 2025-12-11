export interface IndividualAccount {
   id: string;
   name?: string | undefined;
   email: string;
   phone?: string | undefined;
   cpf?: string | undefined;
   birthday?: Date | undefined;
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

export class IndividualAccountEntity implements IndividualAccount {
   constructor(
      private _id: string,
      private _email: string,
      private _name?: string,
      private _phone?: string,
      private _cpf?: string,
      private _birthday?: Date,
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

   get email(): string {
      return this._email;
   }

   set email(value: string) {
      this._email = value;
      this._updatedAt = new Date();
   }

   get name(): string | undefined {
      return this._name;
   }

   set name(value: string | undefined) {
      this._name = value;
      this._updatedAt = new Date();
   }

   get phone(): string | undefined {
      return this._phone;
   }

   set phone(value: string | undefined) {
      this._phone = value;
      this._updatedAt = new Date();
   }

   get cpf(): string | undefined {
      return this._cpf;
   }

   set cpf(value: string | undefined) {
      this._cpf = value;
      this._updatedAt = new Date();
   }

   get birthday(): Date | undefined {
      return this._birthday;
   }

   set birthday(value: Date | undefined) {
      this._birthday = value;
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

   static create(data: Omit<IndividualAccount, 'id' | 'createdAt' | 'updatedAt'>): IndividualAccountEntity {
      const now = new Date();
      return new IndividualAccountEntity(
         crypto.randomUUID(),
         data.email,
         data.name,
         data.phone,
         data.cpf,
         data.birthday,
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

   static toDomain(entity: IndividualAccountEntity): IndividualAccount {
      return {
         id: entity.id,
         email: entity.email,
         name: entity.name,
         phone: entity.phone,
         cpf: entity.cpf,
         birthday: entity.birthday,
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

   static toEntity(entity: IndividualAccountEntity): IndividualAccount {
      return {
         id: entity.id,
         name: entity.name,
         email: entity.email,
         phone: entity.phone,
         cpf: entity.cpf,
         birthday: entity.birthday,
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

   static fromPrisma(prismaAccount: any): IndividualAccount {
      return {
         id: prismaAccount.id,
         name: prismaAccount.name || undefined,
         email: prismaAccount.email,
         phone: prismaAccount.phone || undefined,
         cpf: prismaAccount.cpf || undefined,
         birthday: prismaAccount.birthday || undefined,
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

   static toPrisma(account: IndividualAccount): any {
      return {
         id: account.id,
         name: account.name || null,
         email: account.email,
         phone: account.phone || null,
         cpf: account.cpf || null,
         birthday: account.birthday || null,
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