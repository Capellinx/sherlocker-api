import type { SearchPhoneResponseDTO, TeleResult, CarrierData, DetailedRecord } from '../search-phone-response.dto.ts';

export function mapMindPhoneResponseToDTO(mindResponse: any): SearchPhoneResponseDTO {
  const celular = mindResponse?.celular;
  const data = mindResponse?.data || {};
  
  const sourceA = data?.source_a || {};
  const sourceB = data?.source_b || {};
  const sourceC = data?.source_c || {};
  const sourceD = data?.source_d || {};
  const sourceE = data?.source_e || {};
  const sourceF = data?.source_f || {};

  // ========== SOURCE B - Dados de Telefonia (TELE2023, TELE2024) ==========
  const mapTeleResult = (teleItem: any): TeleResult => {
    const contatos = teleItem?.CONTATOS || {};
    
    const dadosPessoais = {
      cpf: contatos.CPF ? String(contatos.CPF) : undefined,
      nome: contatos.NOME,
      nomeMae: contatos.NOME_MAE,
      nomePai: contatos.NOME_PAI,
      dataNascimento: contatos.NASC,
      sexo: contatos.SEXO,
      rg: contatos.RG,
      orgaoEmissor: contatos.ORGAO_EMISSOR,
      ufEmissao: contatos.UF_EMISSAO,
      tituloEleitor: contatos.TITULO_ELEITOR,
      estadoCivil: contatos.ESTCIV,
      nacionalidade: contatos.NACIONALID,
      cbo: contatos.CBO,
      situacaoCadastral: contatos.CD_SIT_CAD ? String(contatos.CD_SIT_CAD) : undefined,
      dataSituacaoCadastral: contatos.DT_SIT_CAD,
    };

    const telefonesAssociados = {
      celular1: teleItem.CELULAR1,
      celular2: teleItem.CELULAR2,
      celular3: teleItem.CELULAR3,
      celular4: teleItem.CELULAR4,
      celular5: teleItem.CELULAR5,
      telFixo1: teleItem.TEL_FIXO1,
      telFixo2: teleItem.TEL_FIXO2,
      telFixo3: teleItem.TEL_FIXO3,
      telFixo4: teleItem.TEL_FIXO4,
      telFixo5: teleItem.TEL_FIXO5,
    };

    const informacoesFinanceiras = {
      faixaRenda: contatos.FAIXA_RENDA_ID ? String(contatos.FAIXA_RENDA_ID) : undefined,
      renda: contatos.RENDA,
      mosaic: contatos.CD_MOSAIC,
      mosaicSecundario: contatos.CD_MOSAIC_SECUNDARIO,
      mosaicNovo: contatos.CD_MOSAIC_NOVO,
      mosaicGlobal: contatos.MOSAIC_GLOBAL,
      mosaicSegment: contatos.MOSAIC_SEGMENT,
    };

    // Pegar outros campos de CONTATOS que não foram mapeados
    const camposMapeados = [
      'CPF', 'NOME', 'NOME_MAE', 'NOME_PAI', 'NASC', 'SEXO', 'RG', 'ORGAO_EMISSOR',
      'UF_EMISSAO', 'TITULO_ELEITOR', 'ESTCIV', 'NACIONALID', 'CBO', 'CD_SIT_CAD',
      'DT_SIT_CAD', 'FAIXA_RENDA_ID', 'RENDA', 'CD_MOSAIC', 'CD_MOSAIC_SECUNDARIO',
      'CD_MOSAIC_NOVO', 'MOSAIC_GLOBAL', 'MOSAIC_SEGMENT'
    ];

    const outrosContatos: Record<string, unknown> = {};
    Object.keys(contatos).forEach((key) => {
      if (!camposMapeados.includes(key)) {
        outrosContatos[key] = contatos[key];
      }
    });

    return {
      cpf: String(teleItem.CPF),
      telefonesAssociados,
      dadosPessoais,
      informacoesFinanceiras,
      outrosContatos: Object.keys(outrosContatos).length > 0 ? outrosContatos : undefined,
    };
  };

  const tele2023 = sourceB.TELE2023?.map(mapTeleResult);
  const tele2024 = sourceB.TELE2024?.map(mapTeleResult);

  const dadosTelefonia = {
    tele2023,
    tele2024,
    metadados: {
      paginaAtual: sourceB.pagina,
      totalPaginas: sourceB.num_paginas,
      totalResultados: (tele2023?.length || 0) + (tele2024?.length || 0),
    },
  };

  // ========== SOURCE C - Dados de Operadoras ==========
  const dadosOperadoras: CarrierData[] = [];
  
  if (sourceC.resultado && Array.isArray(sourceC.resultado)) {
    sourceC.resultado.forEach((item: any) => {
      const endereco = {
        tipoLogradouro: item.ID_TIPO_ENDR ? String(item.ID_TIPO_ENDR) : undefined,
        logradouro: item.ENDERECO,
        numero: item.NUMERO ? String(item.NUMERO) : undefined,
        complemento: item.COMPLEMENTO,
        bairro: item.BAIRRO,
        cidade: undefined, // Não tem cidade separada no source_c
        uf: item.ID_UF,
        cep: item.CEP,
        tipoEndereco: undefined,
        dataInclusao: undefined,
        dataAtualizacao: undefined,
      };

      dadosOperadoras.push({
        cpfCnpj: item.CPF_CNPJ,
        telefone: item.TELEFONE ? String(item.TELEFONE) : undefined,
        telefoneAnterior: item.TELEFONE_ANTERIOR,
        nomeAssinante: item.NOME_ASSINANTE,
        tipoPessoa: item.TIPO_PESSOA,
        plataforma: item.DS_PLTF,
        produto: item.DS_PRDT,
        estadoLinha: item.DS_ESTD_LNHA,
        dataInstalacao: item.DATA_INSTALACAO,
        dataPrimeiraRecarga: item.DT_PRMR_RCRG_LNHA,
        dataUltimaRecarga: item.DT_ULTM_RCRG_LNHA,
        dataVigenciaInclusao: item.DT_VGNC_INCL,
        endereco,
        flagDivida: item.FLG_DIVIDA,
        valorFatura: item.vl_fatura,
        maiorAtraso: item.MAIOR_ATRASO,
        menorAtraso: item.MENOR_ATRASO,
        operadora: sourceC.tabela, // vivo, claro, tim, oi
      });
    });
  }

  // ========== SOURCE F - Registros Detalhados ==========
  const registrosDetalhados: DetailedRecord[] = [];

  if (sourceF.resultado && Array.isArray(sourceF.resultado)) {
    sourceF.resultado.forEach((item: any) => {
      const telefone = {
        ddd: item.DDD,
        numero: item.TELEFONE,
        tipoTelefone: item.TIPO_TELEFONE,
        classificacao: item.CLASSIFICACAO,
        dataInclusao: item.DT_INCLUSAO,
        dataInformacao: item.DT_INFORMACAO,
        sigilo: item.SIGILO,
      };

      const dadosPessoais = item.dados_pessoais?.map((pessoa: any) => ({
        cpf: pessoa.CPF,
        nome: pessoa.NOME,
        nomeMae: pessoa.NOME_MAE,
        nomePai: pessoa.NOME_PAI,
        dataNascimento: pessoa.NASC,
        sexo: pessoa.SEXO,
        rg: pessoa.RG,
        orgaoEmissor: pessoa.ORGAO_EMISSOR,
        ufEmissao: pessoa.UF_EMISSAO,
        tituloEleitor: pessoa.TITULO_ELEITOR,
        estadoCivil: pessoa.ESTCIV,
        nacionalidade: pessoa.NACIONALID,
        cbo: pessoa.CBO,
        situacaoCadastral: pessoa.CD_SIT_CAD,
        dataSituacaoCadastral: pessoa.DT_SIT_CAD,
      }));

      const enderecos = item.enderecos?.map((end: any) => ({
        tipoLogradouro: end.LOGR_TIPO,
        logradouro: end.LOGR_NOME,
        numero: end.LOGR_NUMERO,
        complemento: end.LOGR_COMPLEMENTO,
        bairro: end.BAIRRO,
        cidade: end.CIDADE,
        uf: end.UF,
        cep: end.CEP,
        tipoEndereco: end.TIPO_ENDERECO_ID,
        dataInclusao: end.DT_INCLUSAO,
        dataAtualizacao: end.DT_ATUALIZACAO,
      }));

      const emails = item.email?.map((email: any) => ({
        email: email.EMAIL,
        tipoEmail: email.TIPO_EMAIL,
        dataInclusao: email.DT_INCLUSAO,
      }));

      const parentes = item.parentes?.map((parente: any) => ({
        cpf: parente.CPF_Completo ? String(parente.CPF_Completo) : undefined,
        nome: parente.NOME,
        cpfVinculo: parente.CPF_VINCULO ? String(parente.CPF_VINCULO) : undefined,
        nomeVinculo: parente.NOME_VINCULO,
        vinculo: parente.VINCULO,
      }));

      registrosDetalhados.push({
        telefone,
        dadosPessoais,
        enderecos,
        emails,
        parentes,
      });
    });
  }

  // ========== SOURCE A, D, E - Geralmente vazios ==========
  const sourceAData = {
    resultados: sourceA.resultado,
    metadados: {
      paginaAtual: sourceA.pagina,
      totalPaginas: sourceA.num_paginas,
      totalResultados: sourceA.resultado?.length || 0,
    },
  };

  const sourceDData = {
    resultados: sourceD.resultado,
    metadados: {
      paginaAtual: sourceD.pagina,
      totalPaginas: sourceD.num_paginas,
      totalResultados: sourceD.resultado?.length || 0,
    },
  };

  const sourceEData = {
    resultados: sourceE.resultado,
    metadados: {
      paginaAtual: sourceE.pagina,
      totalPaginas: sourceE.num_paginas,
      totalResultados: sourceE.resultado?.length || 0,
    },
  };

  // Dados extras não mapeados
  const outros: Record<string, unknown> = {};
  const sourcesMapeadas = ['source_a', 'source_b', 'source_c', 'source_d', 'source_e', 'source_f'];
  
  Object.keys(data).forEach((key) => {
    if (!sourcesMapeadas.includes(key)) {
      outros[key] = data[key];
    }
  });

  return {
    telefonePesquisado: celular,
    dadosTelefonia: (tele2023?.length || tele2024?.length) ? dadosTelefonia : undefined,
    dadosOperadoras: dadosOperadoras.length > 0 ? dadosOperadoras : undefined,
    registrosDetalhados: registrosDetalhados.length > 0 ? registrosDetalhados : undefined,
    sourceA: (sourceA.resultado?.length > 0) ? sourceAData : undefined,
    sourceD: (sourceD.resultado?.length > 0) ? sourceDData : undefined,
    sourceE: (sourceE.resultado?.length > 0) ? sourceEData : undefined,
    outros: Object.keys(outros).length > 0 ? outros : undefined,
  };
}
