import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.ts';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  await prisma.subscription.deleteMany({});
  console.log('✨ Subscriptions antigas removidas');

  await prisma.plan.deleteMany({});
  console.log('✨ Planos antigos removidos');

  // Cria plano FREE - Não renova automaticamente, usuário precisa fazer upgrade
  const freePlan = await prisma.plan.create({
    data: {
      name: 'PLANO FREE',
      description: 'Plano gratuito para começar suas investigações. 50 tokens únicos, sem renovação.',
      amount: 0, // R$ 0,00 - Gratuito
      periodicity: 'MONTHLY', // Define periodicidade mas não gera cobranças (amount = 0)
      tokenCost: 50, // 50 tokens únicos - não renovam
      isActive: true,
    },
  });
  console.log('✅ Plano Free criado:', freePlan.id);

  // Cria plano STARTER
  const starterPlan = await prisma.plan.create({
    data: {
      name: 'PLANO STARTER',
      description: 'Investigações completas com análises detalhadas e alta eficiência.',
      amount: 19500, // R$ 195,00 em centavos
      periodicity: 'MONTHLY',
      tokenCost: 150, // 150 tokens inclusos
      isActive: true,
    },
  });
  console.log('✅ Plano Starter criado:', starterPlan.id);

  // Cria plano PREMIUM
  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'PLANO PREMIUM',
      description: 'Desempenho máximo dados exclusivos e investigações avançadas.',
      amount: 42500, // R$ 425,00 em centavos
      periodicity: 'MONTHLY',
      tokenCost: 600, // 600 tokens inclusos (anteriormente 500)
      isActive: true,
    },
  });
  console.log('✅ Plano Premium criado:', premiumPlan.id);

  // Cria plano BUSINESS
  const businessPlan = await prisma.plan.create({
    data: {
      name: 'PLANO BUSINESS',
      description: 'Solução completa para negócios com recursos avançados.',
      amount: 100, // R$ 1,00 em centavos (para testes)
      periodicity: 'DAYS',
      tokenCost: 1500, // 1.500 tokens inclusos
      isActive: true,
    },
  });
  console.log('✅ Plano Business criado:', businessPlan.id);

  console.log('\n📊 Resumo dos planos criados:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Plano: ${freePlan.name}`);
  console.log(`   ID: ${freePlan.id}`);
  console.log(`   Valor: R$ ${Number(freePlan.amount) / 100}`);
  console.log(`   Tokens: ${freePlan.tokenCost}`);
  console.log(`   Periodicidade: ${freePlan.periodicity}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Plano: ${starterPlan.name}`);
  console.log(`   ID: ${starterPlan.id}`);
  console.log(`   Valor: R$ ${Number(starterPlan.amount) / 100}`);
  console.log(`   Tokens: ${starterPlan.tokenCost}`);
  console.log(`   Periodicidade: ${starterPlan.periodicity}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Plano: ${premiumPlan.name}`);
  console.log(`   ID: ${premiumPlan.id}`);
  console.log(`   Valor: R$ ${Number(premiumPlan.amount) / 100}`);
  console.log(`   Tokens: ${premiumPlan.tokenCost}`);
  console.log(`   Periodicidade: ${premiumPlan.periodicity}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Plano: ${businessPlan.name}`);
  console.log(`   ID: ${businessPlan.id}`);
  console.log(`   Valor: R$ ${Number(businessPlan.amount) / 100}`);
  console.log(`   Tokens: ${businessPlan.tokenCost}`);
  console.log(`   Periodicidade: ${businessPlan.periodicity}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('\n✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
