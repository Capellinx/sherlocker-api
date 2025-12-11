import type { IPlanRepository } from "@/domain/repositories/plan.repository.ts";
import type { ListPlansResponseDto } from "@/application/dtos/plans/list-plans.dto.ts";

export class ListPlansUsecase {
   constructor(
      private readonly planRepository: IPlanRepository
   ) { }

   async execute(): Promise<ListPlansUsecase.Response> {
      const plans = await this.planRepository.findAllActive();

      const plansData: ListPlansResponseDto = plans.map((plan) => {
         const planData = plan.toJSON();
         
         return {
            id: planData.id,
            name: planData.name,
            description: planData.description || undefined,
            amount: Number(planData.amount),
            periodicity: planData.periodicity,
            isActive: planData.isActive,
            createdAt: planData.createdAt,
            updatedAt: planData.updatedAt,
         };
      });

      return plansData;
   }
}

export namespace ListPlansUsecase {
   export type Response = ListPlansResponseDto;
}
