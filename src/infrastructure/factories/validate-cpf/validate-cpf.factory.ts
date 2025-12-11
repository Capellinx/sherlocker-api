import { FindByCpfService } from "@/infrastructure/services/mind/findByCpf/findByCpf.ts";
import { ValidateCpfUsecase } from "@/application/use-cases/validate-document/validate-cpf.usecase.ts";
import { ValidateCpfController } from "@/infrastructure/http/controllers/validate-cpf/validate-cpf.controller.ts";

const findByCpfService = new FindByCpfService();
const validateCpfUsecase = new ValidateCpfUsecase(findByCpfService);
const validateCpfController = new ValidateCpfController(validateCpfUsecase);

export { validateCpfController };
