/**
 * Exemplo de uso do sistema de tokens
 * 
 * Este arquivo demonstra como o sistema de tokens funciona
 * em diferentes cenários.
 */

import { CheckTokenAvailabilityUsecase } from './src/application/use-cases/tokens/check-token-availability.usecase.ts';
import { DeductTokensUsecase } from './src/application/use-cases/tokens/deduct-tokens.usecase.ts';
import { ResetUserTokensUsecase } from './src/application/use-cases/tokens/reset-user-tokens.usecase.ts';
import { GetTokenBalanceUsecase } from './src/application/use-cases/tokens/get-token-balance.usecase.ts';
import { TOKEN_COSTS } from './src/application/dtos/tokens/token-costs.dto.ts';
import { InsufficientTokensError } from './src/infrastructure/config/errors.ts';

/**
 * Simula o fluxo completo de uso de tokens
 */
async function demonstrateTokenSystem() {
	console.log('=== DEMONSTRAÇÃO DO SISTEMA DE TOKENS ===\n');

	// Simulação de IDs (em produção, estes viriam do banco)
	const userId = 'user-123-uuid';
	const planTokens = 100; // Tokens que o plano fornece

	console.log('1️⃣  CENÁRIO: Usuário adquire plano');
	console.log(`   Plano fornece: ${planTokens} tokens`);
	console.log('   → Webhook de pagamento confirmado');
	console.log('   → ResetUserTokensUsecase atribui tokens ao usuário\n');

	console.log('2️⃣  CENÁRIO: Verificar saldo inicial');
	console.log(`   Saldo atual: ${planTokens} tokens\n`);

	console.log('3️⃣  CENÁRIO: Realizar busca por CPF');
	console.log(`   Custo: ${TOKEN_COSTS.CPF} token`);
	console.log('   → CheckTokenAvailabilityUsecase verifica disponibilidade');
	console.log('   ✅ Tokens suficientes');
	console.log('   → Busca executada');
	console.log('   → DeductTokensUsecase deduz token');
	console.log(`   Saldo após busca: ${planTokens - TOKEN_COSTS.CPF} tokens\n`);

	console.log('4️⃣  CENÁRIO: Realizar busca por CNPJ');
	console.log(`   Custo: ${TOKEN_COSTS.CNPJ} tokens`);
	console.log('   → CheckTokenAvailabilityUsecase verifica disponibilidade');
	console.log('   ✅ Tokens suficientes');
	console.log('   → Busca executada');
	console.log('   → DeductTokensUsecase deduz tokens');
	console.log(`   Saldo após busca: ${planTokens - TOKEN_COSTS.CPF - TOKEN_COSTS.CNPJ} tokens\n`);

	console.log('5️⃣  CENÁRIO: Tentar busca sem tokens');
	const currentBalance = 0; // Simulando que zerou os tokens
	console.log(`   Saldo atual: ${currentBalance} tokens`);
	console.log(`   Tentando buscar CPF (custo: ${TOKEN_COSTS.CPF} token)`);
	console.log('   → CheckTokenAvailabilityUsecase verifica disponibilidade');
	console.log('   ❌ Tokens insuficientes');
	console.log('   → InsufficientTokensError lançado (HTTP 402)');
	console.log('   Mensagem: "Insufficient tokens. Required: 1, Available: 0"\n');

	console.log('6️⃣  CENÁRIO: Renovação de subscription');
	console.log('   → Webhook de pagamento confirmado');
	console.log('   → ResetUserTokensUsecase reseta tokens');
	console.log(`   Saldo após renovação: ${planTokens} tokens\n`);

	console.log('7️⃣  HISTÓRICO DE TRANSAÇÕES');
	console.log('   Todas as operações são registradas:');
	console.log('   ┌─────────────────────────────────────────────────────────┐');
	console.log('   │ Type      │ Amount │ Search │ Before │ After  │ Date   │');
	console.log('   ├─────────────────────────────────────────────────────────┤');
	console.log('   │ RESET     │ +100   │ -      │ 0      │ 100    │ Day 1  │');
	console.log('   │ DEDUCTION │ -1     │ CPF    │ 100    │ 99     │ Day 1  │');
	console.log('   │ DEDUCTION │ -2     │ CNPJ   │ 99     │ 97     │ Day 2  │');
	console.log('   │ DEDUCTION │ -1     │ EMAIL  │ 97     │ 96     │ Day 3  │');
	console.log('   │ ...       │ ...    │ ...    │ ...    │ ...    │ ...    │');
	console.log('   │ RESET     │ +100   │ -      │ 0      │ 100    │ Day 30 │');
	console.log('   └─────────────────────────────────────────────────────────┘\n');

	console.log('=== FIM DA DEMONSTRAÇÃO ===\n');

	console.log('📊 CUSTOS DE BUSCA:');
	console.log(`   • CPF:   ${TOKEN_COSTS.CPF} token`);
	console.log(`   • Email: ${TOKEN_COSTS.EMAIL} token`);
	console.log(`   • Phone: ${TOKEN_COSTS.PHONE} token`);
	console.log(`   • CNPJ:  ${TOKEN_COSTS.CNPJ} tokens\n`);

	console.log('💡 BENEFÍCIOS:');
	console.log('   ✓ Controle preciso de consumo');
	console.log('   ✓ Histórico completo de transações');
	console.log('   ✓ Renovação automática com subscription');
	console.log('   ✓ Diferentes custos por tipo de busca');
	console.log('   ✓ Auditoria e rastreabilidade');
	console.log('   ✓ Prevenção de abuso do sistema\n');
}

// Executar demonstração
demonstrateTokenSystem().catch(console.error);
