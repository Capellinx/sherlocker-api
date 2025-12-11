import { AuthPrismaRepository } from '@/infrastructure/database/repositories/auth-prisma.repository.ts';
import { PrismaTokenTransactionRepository } from '@/infrastructure/database/repositories/token-transaction-prisma.repository.ts';
import { CheckTokenAvailabilityUsecase } from '@/application/use-cases/tokens/check-token-availability.usecase.ts';
import { DeductTokensUsecase } from '@/application/use-cases/tokens/deduct-tokens.usecase.ts';
import { ResetUserTokensUsecase } from '@/application/use-cases/tokens/reset-user-tokens.usecase.ts';
import { GetTokenBalanceUsecase } from '@/application/use-cases/tokens/get-token-balance.usecase.ts';

export function makeCheckTokenAvailabilityUsecase() {
  const authRepository = new AuthPrismaRepository();
  return new CheckTokenAvailabilityUsecase(authRepository);
}

export function makeDeductTokensUsecase() {
  const authRepository = new AuthPrismaRepository();
  const tokenTransactionRepository = new PrismaTokenTransactionRepository();
  return new DeductTokensUsecase(authRepository, tokenTransactionRepository);
}

export function makeResetUserTokensUsecase() {
  const authRepository = new AuthPrismaRepository();
  const tokenTransactionRepository = new PrismaTokenTransactionRepository();
  return new ResetUserTokensUsecase(authRepository, tokenTransactionRepository);
}

export function makeGetTokenBalanceUsecase() {
  const authRepository = new AuthPrismaRepository();
  return new GetTokenBalanceUsecase(authRepository);
}
