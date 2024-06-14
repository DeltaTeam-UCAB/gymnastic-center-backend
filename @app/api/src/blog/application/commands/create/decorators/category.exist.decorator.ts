import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from '../types/dto'
import { CreateBlogResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CategoryRepository } from 'src/course/application/repositories/category.repository'
import { categoryNotFoundError } from 'src/blog/application/errors/category.not.found'

export class CategoryExistDecorator
    implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private service: ApplicationService<CreateBlogDTO, CreateBlogResponse>,
        private categoryRepository: CategoryRepository,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const categoryExist = await this.categoryRepository.existById(
            data.category,
        )
        if (!categoryExist) return Result.error(categoryNotFoundError())
        return this.service.execute(data)
    }
}
