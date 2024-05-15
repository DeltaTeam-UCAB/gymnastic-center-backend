import { ApplicationService } from 'src/core/application/service/application.service'
import { GetImageByIdDTO } from './types/dto'
import { GetImageByIdResponse } from './types/response'
import { ImageRepository } from '../../repositories/image.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { imageNotFoundError } from '../../error/image.not.found'

export class GetImageByIdQuery
    implements ApplicationService<GetImageByIdDTO, GetImageByIdResponse>
{
    constructor(private imageRepository: ImageRepository) {}

    async execute(
        data: GetImageByIdDTO,
    ): Promise<Result<GetImageByIdResponse>> {
        const image = await this.imageRepository.getById(data.id)
        if (!isNotNull(image)) return Result.error(imageNotFoundError())
        return Result.success(image)
    }
}
