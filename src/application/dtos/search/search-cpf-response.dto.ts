import { z } from "zod";

export const PersonalInfoSchema = z.object({
	cpf: z.string(),
	nome: z.string().optional().nullable(),
	nomeMae: z.string().optional().nullable(),
	nomePai: z.string().optional().nullable(),
	dataNascimento: z.string().optional().nullable(),
	idade: z.number().optional().nullable(),
	sexo: z.string().optional().nullable(),
	situacaoCadastral: z.string().optional().nullable(),
}).passthrough();

export const AddressSchema = z.object({
	logradouro: z.string().optional().nullable(),
	numero: z.string().optional().nullable(),
	complemento: z.string().optional().nullable(),
	bairro: z.string().optional().nullable(),
	cidade: z.string().optional().nullable(),
	uf: z.string().optional().nullable(),
	cep: z.string().optional().nullable(),
}).passthrough();

export const ContactsSchema = z.object({
	emails: z.array(z.object({
		email: z.string(),
		tipo: z.string().optional().nullable(),
		score: z.string().optional().nullable(),
		dataInclusao: z.string().optional().nullable(),
	}).passthrough()).optional().default([]),
	telefones: z.array(z.object({
		numero: z.string(),
		tipo: z.string().optional().nullable(),
		operadora: z.string().optional().nullable(),
		dataInclusao: z.string().optional().nullable(),
	}).passthrough()).optional().default([]),
}).passthrough();

export const FinancialInfoSchema = z.object({
	renda: z.object({
		valor: z.number().optional().nullable(),
		faixa: z.string().optional().nullable(),
		fonte: z.string().optional().nullable(),
	}).optional().nullable(),
	classeSocial: z.string().optional().nullable(),
	poderAquisitivo: z.object({
		nivel: z.string().optional().nullable(),
		faixa: z.string().optional().nullable(),
	}).optional().nullable(),
	riscoCredito: z.object({
		nivel: z.string().optional().nullable(),
		faixa: z.string().optional().nullable(),
	}).optional().nullable(),
}).passthrough();

export const ProfessionalInfoSchema = z.object({
	situacao: z.string().optional().nullable(),
	dataAdmissao: z.string().optional().nullable(),
	dataDesligamento: z.string().optional().nullable(),
	cnpjEmpresa: z.string().optional().nullable(),
	razaoSocial: z.string().optional().nullable(),
	faixaRenda: z.string().optional().nullable(),
}).passthrough();

export const SocialBenefitsSchema = z.object({
	auxilioBrasil: z.boolean().optional().default(false),
	auxilioEmergencial: z.boolean().optional().default(false),
	bolsaFamilia: z.boolean().optional().default(false),
}).passthrough();

export const ConsumerProfileSchema = z.object({
	perfilCartaoCredito: z.string().optional().nullable(),
	perfilCompraInternet: z.string().optional().nullable(),
	perfilBancaDigital: z.string().optional().nullable(),
	perfilInvestidor: z.string().optional().nullable(),
	interesseViagens: z.string().optional().nullable(),
	interesseVeiculos: z.string().optional().nullable(),
}).passthrough();

export const SearchCpfResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	remainingTokens: z.number().optional(),
	data: z.object({
		dadosPessoais: PersonalInfoSchema,
		endereco: AddressSchema.optional().nullable(),
		contatos: ContactsSchema,
		informacoesFinanceiras: FinancialInfoSchema,
		informacoesProfissionais: ProfessionalInfoSchema.optional().nullable(),
		beneficiosSociais: SocialBenefitsSchema,
		perfilConsumo: ConsumerProfileSchema.optional().nullable(),
		
		outros: z.record(z.string(), z.any()).optional(),
	}).passthrough(),
}).passthrough();

export type SearchCpfResponseDTO = z.infer<typeof SearchCpfResponseSchema>;
