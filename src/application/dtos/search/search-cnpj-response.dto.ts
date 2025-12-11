import { z } from 'zod';

const CompanyInfoSchema = z.object({
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  tipo: z.string().optional(),
  porte: z.string().optional(),
  naturezaJuridica: z.string().optional(),
  capitalSocial: z.string().optional(),
  dataInicio: z.string().optional(),
  situacao: z.object({
    nome: z.string().optional(),
    data: z.string().optional(),
    motivo: z.string().optional(),
  }).passthrough().optional(),
}).passthrough();

const CompanyAddressSchema = z.object({
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  municipio: z.string().optional(),
  uf: z.string().optional(),
  cep: z.string().optional(),
  tipoLogradouro: z.string().optional(),
}).passthrough();

const CompanyContactsSchema = z.object({
  email: z.string().optional(),
  telefone1: z.string().optional(),
  telefone2: z.string().optional(),
}).passthrough();

const EconomicActivitySchema = z.object({
  codigo: z.string().optional(),
  descricao: z.string().optional(),
}).passthrough();

const EconomicActivitiesSchema = z.object({
  atividadePrincipal: EconomicActivitySchema.optional(),
  atividadesSecundarias: z.array(EconomicActivitySchema).optional(),
}).passthrough();

const PartnerInfoSchema = z.object({
  nome: z.string().optional(),
  cpf: z.string().optional(),
  dataNascimento: z.string().optional(),
  nomeMae: z.string().optional(),
  endereco: z.object({
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    cep: z.string().optional(),
  }).passthrough().optional(),
}).passthrough();

const PartnerSchema = z.object({
  nome: z.string().optional(),
  cpfCnpj: z.string().optional(),
  qualificacao: z.string().optional(),
  dataEntrada: z.string().optional(),
  informacoesAdicionais: PartnerInfoSchema.optional(),
}).passthrough();

const PartnersSchema = z.object({
  socios: z.array(PartnerSchema).optional(),
}).passthrough();

const LegalInfoSchema = z.object({
  mei: z.object({
    optanteMei: z.string().optional(),
    dataOpcao: z.string().nullable().optional(),
    dataExclusao: z.string().nullable().optional(),
  }).passthrough().optional(),
  simplesNacional: z.object({
    optanteSimples: z.string().optional(),
    dataOpcao: z.string().nullable().optional(),
    dataExclusao: z.string().nullable().optional(),
  }).passthrough().optional(),
}).passthrough();

const EmployeeSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  dataAdmissao: z.string().optional(),
  dataDesligamento: z.string().nullable().optional(),
  faixaRenda: z.string().optional(),
  situacao: z.string().optional(),
}).passthrough();

const EmployeesInfoSchema = z.object({
  ano: z.string().optional(),
  totalFuncionarios: z.number().optional(),
  funcionarios: z.array(EmployeeSchema).optional(),
}).passthrough();

export const SearchCnpjResponseSchema = z.object({
  dadosEmpresariais: CompanyInfoSchema.optional(),
  endereco: CompanyAddressSchema.optional(),
  contatos: CompanyContactsSchema.optional(),
  atividadesEconomicas: EconomicActivitiesSchema.optional(),
  quadroSocietario: PartnersSchema.optional(),
  informacoesLegais: LegalInfoSchema.optional(),
  funcionarios: EmployeesInfoSchema.optional(),
  outros: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export type SearchCnpjResponseDTO = z.infer<typeof SearchCnpjResponseSchema>;
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type CompanyAddress = z.infer<typeof CompanyAddressSchema>;
export type CompanyContacts = z.infer<typeof CompanyContactsSchema>;
export type EconomicActivities = z.infer<typeof EconomicActivitiesSchema>;
export type EconomicActivity = z.infer<typeof EconomicActivitySchema>;
export type Partner = z.infer<typeof PartnerSchema>;
export type PartnerInfo = z.infer<typeof PartnerInfoSchema>;
export type Partners = z.infer<typeof PartnersSchema>;
export type LegalInfo = z.infer<typeof LegalInfoSchema>;
export type EmployeesInfo = z.infer<typeof EmployeesInfoSchema>;
export type Employee = z.infer<typeof EmployeeSchema>;
