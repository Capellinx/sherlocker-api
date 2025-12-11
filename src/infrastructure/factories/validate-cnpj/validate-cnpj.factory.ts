import { CnpjaPublicService } from "@/infrastructure/services/cnpja/cnpja-public.ts";
import { FindByCnpjService } from "@/infrastructure/services/mind/findByCnpj/findByCnpj.ts";
import { ValidateCnpjUsecase } from "@/application/use-cases/validate-cnpj/validate-cnpj.usecase.ts";
import { ValidateCnpjController } from "@/infrastructure/http/controllers/validate-cnpj/validate-cnpj.controller.ts";

const cnpjaPublicService = new CnpjaPublicService();
const findByCnpjService = new FindByCnpjService();
const validateCnpjUsecase = new ValidateCnpjUsecase(cnpjaPublicService, findByCnpjService);
const validateCnpjController = new ValidateCnpjController(validateCnpjUsecase);

export { validateCnpjController };
