import { ApplicationService } from 'src/core/application/service/application.service'
import { GetCategoriesManyDTO } from './types/dto'
import { GetCategoriesManyResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CategoryRepository } from '../../repositories/category.repository'
import { ImageRepository } from '../../repositories/image.repository'

export class GetCategoriesManyQuery
    implements
        ApplicationService<GetCategoriesManyDTO, GetCategoriesManyResponse>
{
    constructor(
        private categoryRepository: CategoryRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(
        data: GetCategoriesManyDTO,
    ): Promise<Result<GetCategoriesManyResponse>> {
        const categories = await this.categoryRepository.getMany(data)
        return Result.success(
            await categories.asyncMap(async (e) => ({
                ...e,
                icon: (await this.imageRepository.getById(e.icon))!.src,
            })),
        )
    }
}
