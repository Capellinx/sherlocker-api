import { z } from 'zod';

const PersonalDataSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  nomeMae: z.string().optional(),
  dataNascimento: z.string().optional(),
}).passthrough();

const ContactInfoSchema = z.object({
  email: z.string().optional(),
  emailPrincipal: z.string().nullable().optional(),
  emailPessoal: z.string().optional(),
  emailDuplicado: z.string().optional(),
  dominio: z.string().optional(),
}).passthrough();

const VerificationsSchema = z.object({
  emailScore: z.string().optional(),
  estruturaEmail: z.string().optional(),
  statusVt: z.string().optional(),
  blacklist: z.string().optional(),
  emailProcon: z.string().nullable().optional(),
}).passthrough();

const FinancialDataSchema = z.object({
  faixaRenda: z.string().nullable().optional(),
  renda: z.string().nullable().optional(),
  comunicadoInadimplencia: z.string().optional(),
  comunicadoPositivo: z.string().nullable().optional(),
}).passthrough();

const AdditionalInfoSchema = z.object({
  cnpjInformante: z.number().optional(),
  contatosId: z.number().optional(),
  idEmail: z.number().optional(),
  cadastroId: z.number().optional(),
  cbo: z.string().nullable().optional(),
  prioridade: z.number().optional(),
  peso: z.number().optional(),
  mapas: z.number().optional(),
  eid: z.string().nullable().optional(),
  idFinalidade: z.number().optional(),
  finalidadeFornecedor: z.string().optional(),
  meioCaptacaoFornecedor: z.string().optional(),
  dataFinalidadeFornecedor: z.string().optional(),
  dataInclusao: z.string().optional(),
}).passthrough();

const EmailResultSchema = z.object({
  dadosPessoais: PersonalDataSchema.optional(),
  contato: ContactInfoSchema.optional(),
  verificacoes: VerificationsSchema.optional(),
  informacoesFinanceiras: FinancialDataSchema.optional(),
  informacoesAdicionais: AdditionalInfoSchema.optional(),
}).passthrough();

const PaginationMetaSchema = z.object({
  paginaAtual: z.number().optional(),
  totalPaginas: z.number().optional(),
  totalResultados: z.number().optional(),
}).passthrough();

export const SearchEmailResponseSchema = z.object({
  resultados: z.array(EmailResultSchema).optional(),
  paginacao: PaginationMetaSchema.optional(),
  outros: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export type SearchEmailResponseDTO = z.infer<typeof SearchEmailResponseSchema>;
export type EmailResult = z.infer<typeof EmailResultSchema>;
export type PersonalData = z.infer<typeof PersonalDataSchema>;
export type ContactInfo = z.infer<typeof ContactInfoSchema>;
export type Verifications = z.infer<typeof VerificationsSchema>;
export type FinancialData = z.infer<typeof FinancialDataSchema>;
export type AdditionalInfo = z.infer<typeof AdditionalInfoSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
