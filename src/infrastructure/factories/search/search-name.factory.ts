import { FindByNameService } from "@/infrastructure/services/mind/findByName/findByName.ts";
import { SearchNameUsecase } from "@/application/use-cases/search/search-name.usecase.ts";
import { SearchNameController } from "@/infrastructure/http/controllers/search/search-name.controller.ts";

const findByNameService = new FindByNameService();
const searchNameUsecase = new SearchNameUsecase(findByNameService);
const searchNameController = new SearchNameController(searchNameUsecase);

export { searchNameController };
