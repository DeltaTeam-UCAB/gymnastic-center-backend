import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CategoryRepository } from '../../repositories/category.repository'
import { GetAllCategoryResponse } from './types/response'

export class FindAllCategoryQuery
    implements ApplicationService<undefined, GetAllCategoryResponse>
{
    constructor(private categoryRepository: CategoryRepository) {}
    async execute(): Promise<Result<GetAllCategoryResponse>> {
        const category = await this.categoryRepository.findAll()
        return Result.success(category)
    }
}
