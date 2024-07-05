import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCourseDTO } from '../types/dto'
import { CreateCourseResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CategoryRepository } from 'src/course/application/repositories/category.repository'
import { categoryNotExistError } from 'src/course/application/errors/category.not.exist'
import { CategoryID } from 'src/course/domain/value-objects/category.id'

export class CategoryExistDecorator
    implements ApplicationService<CreateCourseDTO, CreateCourseResponse>
{
    constructor(
        private service: ApplicationService<
            CreateCourseDTO,
            CreateCourseResponse
        >,
        private categoryRepository: CategoryRepository,
    ) {}
    async execute(
        data: CreateCourseDTO,
    ): Promise<Result<CreateCourseResponse>> {
        const categoryExist = await this.categoryRepository.existById(
            new CategoryID(data.category),
        )
        if (!categoryExist) return Result.error(categoryNotExistError())
        return this.service.execute(data)
    }
}
