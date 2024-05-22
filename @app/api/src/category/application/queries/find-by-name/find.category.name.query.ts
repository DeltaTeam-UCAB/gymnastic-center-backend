import { ApplicationService } from 'src/core/application/service/application.service'
import { FindCategoryByNameDTO } from './types/dto'
import { FindCategoryByNameResponse } from './types/response'
import { CategoryRepository } from '../../repositories/category.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { categoryNotFoundError } from '../../errors/category.not.found'

export class FindCategoryByNameQuery
implements
        ApplicationService<FindCategoryByNameDTO, FindCategoryByNameResponse>
{
    constructor(private categoryRepository: CategoryRepository) {}

    async execute(
        data: FindCategoryByNameDTO,
    ): Promise<Result<FindCategoryByNameResponse>> {
        const category = await this.categoryRepository.findByName(data.name)
        if (!isNotNull(category)) return Result.error(categoryNotFoundError())
        return Result.success(category)
    }
}
