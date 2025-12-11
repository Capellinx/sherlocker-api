import type { SearchEmailResponseDTO, EmailResult } from '../search-email-response.dto.ts';

export function mapMindEmailResponseToDTO(mindResponse: any): SearchEmailResponseDTO {
  const data = mindResponse?.data || {};
  const resultado = data?.resultado || [];

  // Transformar cada resultado individual
  const resultados: EmailResult[] = resultado.map((item: any) => {
    // Dados Pessoais
    const dadosPessoais = {
      cpf: item.CPF ? String(item.CPF) : undefined,
      nome: item.NOME,
      nomeMae: item.NOME_MAE,
      dataNascimento: item.NASC,
    };

    // Contato
    const contato = {
      email: item.EMAIL,
      emailPrincipal: item.EMAIL_PRINCIPAL,
      emailPessoal: item.EMAIL_PESSOAL,
      emailDuplicado: item.EMAIL_DUPLICADO,
      dominio: item.DOMINIO,
    };

    // Verificações
    const verificacoes = {
      emailScore: item.EMAIL_SCORE,
      estruturaEmail: item.ESTRUTURA,
      statusVt: item.STATUS_VT,
      blacklist: item.BLACKLIST,
      emailProcon: item.EMAIL_PROCON,
    };

    // Informações Financeiras
    const informacoesFinanceiras = {
      faixaRenda: item.FAIXA_RENDA,
      renda: item.RENDA,
      comunicadoInadimplencia: item.COMUNICADO_INADIMPLENCIA,
      comunicadoPositivo: item.COMUNICADO_POSITIVO,
    };

    // Informações Adicionais
    const informacoesAdicionais = {
      cnpjInformante: item.CNPJ_INFORMANTE,
      contatosId: item.CONTATOS_ID,
      idEmail: item.ID_EMAIL,
      cadastroId: item.CADASTRO_ID,
      cbo: item.CBO,
      prioridade: item.PRIORIDADE,
      peso: item.PESO,
      mapas: item.MAPAS,
      eid: item.EID,
      idFinalidade: item.ID_FINALIDADE,
      finalidadeFornecedor: item.de_FINALIDADE_FORNECEDOR,
      meioCaptacaoFornecedor: item.de_MEIO_CAPTACAO_FORNECEDOR,
      dataFinalidadeFornecedor: item.dt_FINALIDADE_FORNECEDOR,
      dataInclusao: item.DT_INCLUSAO,
    };

    return {
      dadosPessoais,
      contato,
      verificacoes,
      informacoesFinanceiras,
      informacoesAdicionais,
    };
  });

  // Metadados de paginação
  const paginacao = {
    paginaAtual: data.pagina,
    totalPaginas: data.num_paginas,
    totalResultados: resultado.length,
  };

  // Dados extras não mapeados
  const outros: Record<string, unknown> = {};
  
  // Adicionar campos não mapeados do data
  const camposMapeados = ['resultado', 'pagina', 'num_paginas'];
  
  Object.keys(data).forEach((key) => {
    if (!camposMapeados.includes(key)) {
      outros[key] = data[key];
    }
  });

  return {
    resultados,
    paginacao,
    outros: Object.keys(outros).length > 0 ? outros : undefined,
  };
}
