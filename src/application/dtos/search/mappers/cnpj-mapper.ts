import type { SearchCnpjResponseDTO } from '../search-cnpj-response.dto.ts';

export function mapMindCnpjResponseToDTO(mindResponse: any): SearchCnpjResponseDTO {
  const sourceMain = mindResponse?.data?.source_main || {};
  const sourceA = mindResponse?.data?.source_a || {};
  const sourceB = mindResponse?.data?.source_b || {};

  // Dados Empresariais
  const dadosEmpresariais = {
    cnpj: sourceMain.cnpj,
    razaoSocial: sourceMain.razao_social,
    nomeFantasia: sourceMain.nome_fantasia,
    tipo: sourceMain.tipo,
    porte: sourceMain.porte,
    naturezaJuridica: sourceMain.natureza_juridica,
    capitalSocial: sourceMain.capital_social,
    dataInicio: sourceMain.data_inicio,
    situacao: sourceMain.situacao ? {
      nome: sourceMain.situacao.nome,
      data: sourceMain.situacao.data,
      motivo: sourceMain.situacao.motivo,
    } : undefined,
  };

  // Endereço
  const endereco = sourceMain.endereco ? {
    tipoLogradouro: sourceMain.endereco.tipo_logradouro,
    logradouro: sourceMain.endereco.logradouro,
    numero: sourceMain.endereco.numero,
    complemento: sourceMain.endereco.complemento,
    bairro: sourceMain.endereco.bairro,
    municipio: sourceMain.endereco.municipio,
    uf: sourceMain.endereco.uf,
    cep: sourceMain.endereco.cep,
  } : undefined;

  // Contatos
  const contatos = {
    email: sourceMain.email,
    telefone1: sourceMain.telefone1,
    telefone2: sourceMain.telefone2,
  };

  // Atividades Econômicas
  const atividadesEconomicas = {
    atividadePrincipal: sourceMain.atividade_principal ? {
      codigo: sourceMain.atividade_principal.codigo,
      descricao: sourceMain.atividade_principal.descricao,
    } : undefined,
    atividadesSecundarias: sourceMain.atividades_secundarias?.map((atividade: any) => ({
      codigo: atividade.codigo,
      descricao: atividade.descricao,
    })),
  };

  // Quadro Societário
  const socios = sourceMain.socios_retorno?.map((socio: any) => {
    const socioInfo = socio.socio_info?.[0];
    
    return {
      nome: socio.nome,
      cpfCnpj: socioInfo?.nrcpf ? String(socioInfo.nrcpf) : undefined,
      qualificacao: socio.qualificacao,
      dataEntrada: socio.data_entrada,
      informacoesAdicionais: socioInfo ? {
        nome: socioInfo.nopessoafisica,
        cpf: socioInfo.nrcpf ? String(socioInfo.nrcpf) : undefined,
        dataNascimento: socioInfo.dtnascimento,
        nomeMae: socioInfo.nomae,
        endereco: {
          logradouro: socioInfo.nologradouro,
          numero: socioInfo.nrlogradouro,
          complemento: socioInfo.dscomplemento,
          bairro: socioInfo.nobairro,
          municipio: socioInfo.nomunicipio,
          uf: socioInfo.sguf,
          cep: socioInfo.nrcep ? String(socioInfo.nrcep) : undefined,
        },
      } : undefined,
    };
  });

  const quadroSocietario = {
    socios,
  };

  // Informações Legais
  const informacoesLegais = {
    mei: sourceMain.mei ? {
      optanteMei: sourceMain.mei.optante_mei,
      dataOpcao: sourceMain.mei.data_opcao,
      dataExclusao: sourceMain.mei.data_exclusao,
    } : undefined,
    simplesNacional: sourceMain.simples ? {
      optanteSimples: sourceMain.simples.optante_simples,
      dataOpcao: sourceMain.simples.data_opcao,
      dataExclusao: sourceMain.simples.data_exclusao,
    } : undefined,
  };

  // Funcionários (RAIS)
  let funcionariosInfo;
  
  if (sourceMain.rais2022 && Array.isArray(sourceMain.rais2022)) {
    const raisData = sourceMain.rais2022[0];
    
    if (Array.isArray(raisData)) {
      const funcionarios = raisData.map((func: any) => ({
        cpf: func.CPF ? String(func.CPF) : undefined,
        nome: func.Nome,
        dataAdmissao: func.DataAdmissao,
        dataDesligamento: func.DataDesligamento,
        faixaRenda: func.FaixaRenda,
        situacao: func.Situacao,
      }));

      const totalFuncionarios = typeof sourceMain.rais2022[1] === 'number' 
        ? sourceMain.rais2022[1] 
        : funcionarios.length;

      funcionariosInfo = {
        ano: '2022',
        totalFuncionarios,
        funcionarios,
      };
    }
  }

  // Dados extras não mapeados
  const outros: Record<string, unknown> = {};

  // Adicionar source_a e source_b se tiverem dados
  if (sourceA && Object.keys(sourceA).length > 0) {
    outros.source_a = sourceA;
  }
  
  if (sourceB && Object.keys(sourceB).length > 0) {
    outros.source_b = sourceB;
  }

  // Adicionar campos não mapeados do source_main
  const camposMapeados = [
    'cnpj', 'razao_social', 'nome_fantasia', 'tipo', 'porte', 
    'natureza_juridica', 'capital_social', 'data_inicio', 'situacao',
    'endereco', 'email', 'telefone1', 'telefone2',
    'atividade_principal', 'atividades_secundarias',
    'socios', 'socios_retorno',
    'mei', 'simples',
    'rais2022',
  ];

  Object.keys(sourceMain).forEach((key) => {
    if (!camposMapeados.includes(key)) {
      outros[key] = sourceMain[key];
    }
  });

  return {
    dadosEmpresariais,
    endereco,
    contatos,
    atividadesEconomicas,
    quadroSocietario,
    informacoesLegais,
    funcionarios: funcionariosInfo,
    outros: Object.keys(outros).length > 0 ? outros : undefined,
  };
}
