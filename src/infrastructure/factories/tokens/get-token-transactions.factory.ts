import { PrismaTokenTransactionRepository } from "@/infrastructure/database/repositories/token-transaction-prisma.repository.ts";
import { GetTokenTransactionsUsecase } from "@/application/use-cases/tokens/get-token-transactions.usecase.ts";
import { GetTokenTransactionsController } from "@/infrastructure/http/controllers/tokens/get-token-transactions.controller.ts";

const tokenTransactionRepository = new PrismaTokenTransactionRepository();
const getTokenTransactionsUsecase = new GetTokenTransactionsUsecase(tokenTransactionRepository);
const getTokenTransactionsController = new GetTokenTransactionsController(getTokenTransactionsUsecase);

export { getTokenTransactionsController };
