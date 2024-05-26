import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CategoryRepository } from '../../repositories/category.repository'
import { FindAllCategoryResponse } from './types/response'

export class FindAllCategoriesQuery
    implements ApplicationService<undefined, FindAllCategoryResponse>
{
    constructor(private CategoryRepository: CategoryRepository) {}
    async execute(): Promise<Result<FindAllCategoryResponse>> {
        const categories = await this.CategoryRepository.findAll()
        return Result.success(categories)
    }
}
