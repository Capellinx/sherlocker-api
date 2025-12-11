import type { SearchCpfResponseDTO } from "../search-cpf-response.dto.ts";


export function mapMindResponseToDTO(mindResponse: any): SearchCpfResponseDTO {
	const sourceA = mindResponse?.data?.source_a || {};
	const sourceB = mindResponse?.data?.source_b || {};
	const sourceC = mindResponse?.data?.source_c || {};

	// Extrai dados da Receita Federal (source_a)
	const receitaFederal = sourceA.receita_federal?.[0] || {};
	const juventude = sourceA.juventude?.[0] || {};
	
	// Extrai dados do Serasa (source_b)
	const dadosSerasa = sourceB.dados_serasa?.[0] || {};
	const contatos = sourceB.contatos || {};
	const renda = sourceB.renda || {};
	const riscoCredito = sourceB.risco_credito?.[0] || {};
	const creditAnalytics = sourceB.credit_analytics?.[0] || {};
	const beneficios = sourceB.beneficios_sociais || {};
	const profissao = sourceB.profissao || {};
	
	// Extrai dados pessoais (source_c)
	const dadosPessoaisC = sourceC.dados_pessoais?.[0] || {};

	// Calcula idade se tiver data de nascimento
	const calcularIdade = (dataNasc: string): number | null => {
		if (!dataNasc) return null;
		const nascimento = new Date(dataNasc);
		const hoje = new Date();
		let idade = hoje.getFullYear() - nascimento.getFullYear();
		const mesAtual = hoje.getMonth();
		const mesNascimento = nascimento.getMonth();
		if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
			idade--;
		}
		return idade;
	};

	const dataNascimento = receitaFederal.dataNascimento?.toString() || dadosSerasa.NASC || dadosPessoaisC.NASC;
	const dataNascFormatted = dataNascimento ? 
		(dataNascimento.length === 8 ? 
			`${dataNascimento.substring(0, 4)}-${dataNascimento.substring(4, 6)}-${dataNascimento.substring(6, 8)}` 
			: dataNascimento) 
		: null;

	return {
		success: true,
		data: {
			// ========== DADOS PESSOAIS ==========
			dadosPessoais: {
				cpf: mindResponse?.cpf || sourceB.documento,
				nome: receitaFederal.nome || dadosSerasa.NOME || dadosPessoaisC.NOME,
				nomeMae: receitaFederal.nomeMae || dadosSerasa.NOME_MAE || juventude.nomae,
				nomePai: dadosSerasa.NOME_PAI,
				dataNascimento: dataNascFormatted,
				idade: dataNascFormatted ? calcularIdade(dataNascFormatted) : null,
				sexo: receitaFederal.sexo || dadosSerasa.SEXO || dadosPessoaisC.SEXO,
				situacaoCadastral: receitaFederal.situacaoCadastral || 
					(dadosSerasa.CD_SIT_CAD === 2 ? "REGULAR" : "IRREGULAR"),
			},

			// ========== ENDEREÇO ==========
			endereco: receitaFederal.logradouro ? {
				logradouro: `${receitaFederal.tipoLogradouro || ''} ${receitaFederal.logradouro || ''}`.trim(),
				numero: receitaFederal.numeroLogradouro?.toString(),
				complemento: receitaFederal.complemento || juventude.dscomplemento,
				bairro: receitaFederal.bairro || juventude.nobairro,
				cidade: receitaFederal.municipio || juventude.nomunicipio,
				uf: receitaFederal.UF || juventude.sguf,
				cep: receitaFederal.cep?.toString() || juventude.nrcep?.toString(),
			} : null,

			// ========== CONTATOS ==========
			contatos: {
				emails: (contatos.email || []).map((email: any) => ({
					email: email.EMAIL,
					tipo: email.DOMINIO,
					score: email.EMAIL_SCORE,
					dataInclusao: email.DT_INCLUSAO,
					...email, // Mantém dados extras
				})),
				telefones: [
					...(contatos.telefones || []),
					...(contatos.telefones_ecs || []),
				].map((tel: any) => ({
					numero: tel.TELEFONE || tel.telefone,
					tipo: tel.TIPO || tel.tipo,
					operadora: tel.OPERADORA || tel.operadora,
					dataInclusao: tel.DT_INCLUSAO || tel.dt_inclusao,
					...tel, // Mantém dados extras
				})),
			},

			// ========== INFORMAÇÕES FINANCEIRAS ==========
			informacoesFinanceiras: {
				renda: renda.credito ? {
					valor: renda.credito.RENDA,
					faixa: renda.credito.FX_RENDA_ID === 1 ? "Até R$ 1.000" : 
						renda.credito.FX_RENDA_ID === 2 ? "R$ 1.000 - R$ 3.000" : "Acima de R$ 3.000",
					fonte: "Estimativa Serasa",
				} : null,
				classeSocial: renda.classe_social?.CLASSE_SOCIAL,
				poderAquisitivo: renda.poder_aquisitivo ? {
					nivel: renda.poder_aquisitivo.PODER_AQUISITIVO,
					faixa: renda.poder_aquisitivo.FX_PODER_AQUISITIVO,
				} : null,
				riscoCredito: riscoCredito ? {
					nivel: riscoCredito.RISCO_PF_FAIXA,
					faixa: riscoCredito.RISCO_PF_VIVO_FAIXA,
				} : null,
			},

			// ========== INFORMAÇÕES PROFISSIONAIS ==========
			informacoesProfissionais: profissao.rais?.[0] ? {
				situacao: profissao.rais[0].SITUACAO_TRATADO || profissao.rais[0].SITUACAO,
				dataAdmissao: profissao.rais[0].DT_ADMISSAO,
				dataDesligamento: profissao.rais[0].DT_DESLIGAMENTO,
				cnpjEmpresa: profissao.rais[0].CNPJ,
				razaoSocial: null, // Pode ser enriquecido depois
				faixaRenda: sourceA.rais2022?.[0]?.FaixaRenda,
			} : null,

			// ========== BENEFÍCIOS SOCIAIS ==========
			beneficiosSociais: {
				auxilioBrasil: !!beneficios.auxilio_brasil,
				auxilioEmergencial: !!beneficios.auxilio_emergencial,
				bolsaFamilia: !!beneficios.bolsa_familia,
			},

			// ========== PERFIL DE CONSUMO ==========
			perfilConsumo: creditAnalytics ? {
				perfilCartaoCredito: creditAnalytics.Decil_CARTAO_CREDITO_HIGH_USER 
					? `Decil ${creditAnalytics.Decil_CARTAO_CREDITO_HIGH_USER}/10` : null,
				perfilCompraInternet: creditAnalytics.Decil_MOD_PERFIL_COMPRA_INTERNET 
					? `Decil ${creditAnalytics.Decil_MOD_PERFIL_COMPRA_INTERNET}/10` : null,
				perfilBancaDigital: creditAnalytics.DECIL_BANCO_DIGITAL 
					? `Decil ${creditAnalytics.DECIL_BANCO_DIGITAL}/10` : null,
				perfilInvestidor: creditAnalytics.Decil_MOD_PERFIL_INVESTIDOR 
					? `Decil ${creditAnalytics.Decil_MOD_PERFIL_INVESTIDOR}/10` : null,
				interesseViagens: creditAnalytics.DECIL_VIAGEM_TURISMO 
					? `Decil ${creditAnalytics.DECIL_VIAGEM_TURISMO}/10` : null,
				interesseVeiculos: creditAnalytics.Decil_MOD_AQUISICAO_VEICULO 
					? `Decil ${creditAnalytics.Decil_MOD_AQUISICAO_VEICULO}/10` : null,
				// Mantém todos os dados originais
				...creditAnalytics,
			} : null,

			// ========== OUTROS DADOS ==========
			// Captura dados extras não mapeados das sources
			outros: {
				bancos: sourceA.bancos || null,
				celularOperadoras: sourceA.celular_operadoras || null,
				detranSP: sourceA.detran_sp || null,
				iptu: {
					iptu2019: sourceA.iptu2019_retorno || null,
					iptu2022: sourceA.iptu2022_retorno || null,
				},
				vinculos: sourceA.viculos_sp || null,
				parentes: sourceB.parentes || sourceC.parentes || null,
				documentos: sourceB.documentos || null,
				mosaic: sourceB.mosaic || null,
				tse: sourceC.tse || null,
				// Qualquer outro campo que aparecer será capturado aqui também
			},
		},
	};
}
