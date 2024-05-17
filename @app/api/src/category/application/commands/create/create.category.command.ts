import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCategoryDTO } from './types/dto'
import { CreateCategoryResponse } from './types/reponse'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { CategoryRepository } from '../../repositories/category.repository'
import { ImageRepository } from 'src/image/application/repositories/image.repository'
import { imageNotFoundError } from '../../errors/image.not.found'
import { categoryNameExistError } from '../../errors/category.name.exist'
import { Category } from '../../models/category'

export class CreateCategoryCommand
    implements ApplicationService<CreateCategoryDTO, CreateCategoryResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private categoryRepository: CategoryRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: CreateCategoryDTO,
    ): Promise<Result<CreateCategoryResponse>> {
        const image = await this.imageRepository.getById(data.icon)
        if (!image) return Result.error(imageNotFoundError())
        const possible = await this.categoryRepository.findByName(data.name)
        if (possible) return Result.error(categoryNameExistError())
        const category = {
            id: this.idGenerator.generate(),
            ...data,
        } satisfies Category
        const saveResult = await this.categoryRepository.save(category)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id: category.id,
        })
    }
}
