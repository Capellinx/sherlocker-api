import { z } from 'zod';

const PersonalDataSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  nomeMae: z.string().optional(),
  nomePai: z.string().nullable().optional(),
  dataNascimento: z.string().optional(),
  sexo: z.string().optional(),
  rg: z.string().nullable().optional(),
  orgaoEmissor: z.string().nullable().optional(),
  ufEmissao: z.string().nullable().optional(),
  tituloEleitor: z.string().nullable().optional(),
  estadoCivil: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  cbo: z.string().nullable().optional(),
  situacaoCadastral: z.string().optional(),
  dataSituacaoCadastral: z.string().optional(),
}).passthrough();

const AddressSchema = z.object({
  tipoLogradouro: z.string().nullable().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().nullable().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  cep: z.string().optional(),
  tipoEndereco: z.string().optional(),
  dataInclusao: z.string().optional(),
  dataAtualizacao: z.string().optional(),
}).passthrough();

const FinancialInfoSchema = z.object({
  faixaRenda: z.string().optional(),
  renda: z.number().optional(),
  mosaic: z.string().optional(),
  mosaicSecundario: z.string().optional(),
  mosaicNovo: z.string().optional(),
  mosaicGlobal: z.string().optional(),
  mosaicSegment: z.string().optional(),
}).passthrough();

const AssociatedPhonesSchema = z.object({
  celular1: z.string().nullable().optional(),
  celular2: z.string().nullable().optional(),
  celular3: z.string().nullable().optional(),
  celular4: z.string().nullable().optional(),
  celular5: z.string().nullable().optional(),
  telFixo1: z.string().nullable().optional(),
  telFixo2: z.string().nullable().optional(),
  telFixo3: z.string().nullable().optional(),
  telFixo4: z.string().nullable().optional(),
  telFixo5: z.string().nullable().optional(),
}).passthrough();

const TeleResultSchema = z.object({
  cpf: z.string().optional(),
  telefonesAssociados: AssociatedPhonesSchema.optional(),
  dadosPessoais: PersonalDataSchema.optional(),
  informacoesFinanceiras: FinancialInfoSchema.optional(),
  endereco: AddressSchema.optional(),
  outrosContatos: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

const CarrierDataSchema = z.object({
  cpfCnpj: z.string().optional(),
  telefone: z.string().optional(),
  telefoneAnterior: z.string().nullable().optional(),
  nomeAssinante: z.string().optional(),
  tipoPessoa: z.string().optional(),
  plataforma: z.string().optional(),
  produto: z.string().optional(),
  estadoLinha: z.string().optional(),
  dataInstalacao: z.string().optional(),
  dataPrimeiraRecarga: z.string().optional(),
  dataUltimaRecarga: z.string().optional(),
  dataVigenciaInclusao: z.string().optional(),
  endereco: AddressSchema.optional(),
  flagDivida: z.string().nullable().optional(),
  valorFatura: z.number().nullable().optional(),
  maiorAtraso: z.number().nullable().optional(),
  menorAtraso: z.number().nullable().optional(),
  operadora: z.string().optional(), // vivo, claro, tim, oi
}).passthrough();

const RelativeSchema = z.object({
  cpf: z.string().optional(),
  nome: z.string().optional(),
  cpfVinculo: z.string().nullable().optional(),
  nomeVinculo: z.string().optional(),
  vinculo: z.string().optional(), // MAE, PAI, CONJUGE, etc
}).passthrough();

const AssociatedEmailSchema = z.object({
  email: z.string().optional(),
  tipoEmail: z.string().optional(),
  dataInclusao: z.string().optional(),
}).passthrough();

const DetailedRecordSchema = z.object({
  telefone: z.object({
    ddd: z.string().optional(),
    numero: z.string().optional(),
    tipoTelefone: z.string().optional(),
    classificacao: z.string().optional(),
    dataInclusao: z.string().optional(),
    dataInformacao: z.string().optional(),
    sigilo: z.string().optional(),
  }).passthrough().optional(),
  dadosPessoais: z.array(PersonalDataSchema).optional(),
  enderecos: z.array(AddressSchema).optional(),
  emails: z.array(AssociatedEmailSchema).optional(),
  parentes: z.array(RelativeSchema).optional(),
}).passthrough();

const SourceMetadataSchema = z.object({
  paginaAtual: z.number().optional(),
  totalPaginas: z.number().optional(),
  totalResultados: z.number().optional(),
}).passthrough();

export const SearchPhoneResponseSchema = z.object({
  telefonePesquisado: z.string().optional(),
  
  // Source B - Dados de telefonia (TELE2023, TELE2024)
  dadosTelefonia: z.object({
    tele2023: z.array(TeleResultSchema).optional(),
    tele2024: z.array(TeleResultSchema).optional(),
    metadados: SourceMetadataSchema.optional(),
  }).passthrough().optional(),
  
  // Source C - Dados de operadoras (Vivo, Claro, Tim, Oi)
  dadosOperadoras: z.array(CarrierDataSchema).optional(),
  
  // Source F - Registros detalhados
  registrosDetalhados: z.array(DetailedRecordSchema).optional(),
  
  // Source A - Geralmente vazio, mas incluído para completude
  sourceA: z.object({
    resultados: z.array(z.unknown()).optional(),
    metadados: SourceMetadataSchema.optional(),
  }).passthrough().optional(),
  
  // Source D - Geralmente vazio
  sourceD: z.object({
    resultados: z.array(z.unknown()).optional(),
    metadados: SourceMetadataSchema.optional(),
  }).passthrough().optional(),
  
  // Source E - Geralmente vazio
  sourceE: z.object({
    resultados: z.array(z.unknown()).optional(),
    metadados: SourceMetadataSchema.optional(),
  }).passthrough().optional(),
  
  // Dados extras não mapeados
  outros: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

export type SearchPhoneResponseDTO = z.infer<typeof SearchPhoneResponseSchema>;
export type PersonalData = z.infer<typeof PersonalDataSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type FinancialInfo = z.infer<typeof FinancialInfoSchema>;
export type AssociatedPhones = z.infer<typeof AssociatedPhonesSchema>;
export type TeleResult = z.infer<typeof TeleResultSchema>;
export type CarrierData = z.infer<typeof CarrierDataSchema>;
export type Relative = z.infer<typeof RelativeSchema>;
export type AssociatedEmail = z.infer<typeof AssociatedEmailSchema>;
export type DetailedRecord = z.infer<typeof DetailedRecordSchema>;
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
