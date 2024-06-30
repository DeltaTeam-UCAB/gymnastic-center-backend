import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from '../types/dto'
import { CreateBlogResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'

import { categoryNotFoundError } from 'src/blog/application/errors/category.not.found'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { CategoryRepository } from 'src/blog/application/repositories/category.repository'

export class CategoryExistDecorator
    implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private service: ApplicationService<CreateBlogDTO, CreateBlogResponse>,
        private categoryRepository: CategoryRepository,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const categoryExist = await this.categoryRepository.existById(
            new CategoryId(data.category),
        )
        if (!categoryExist) return Result.error(categoryNotFoundError())
        return this.service.execute(data)
    }
}
