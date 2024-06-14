import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { ImageRepository } from '../../repositories/image.repository'
import { GetAllImagesResponse } from './types/response'

export class GetAllImagesQuery
implements ApplicationService<undefined, GetAllImagesResponse>
{
    constructor(private imageRepository: ImageRepository) {}
    async execute(): Promise<Result<GetAllImagesResponse>> {
        const images = await this.imageRepository.getAll()
        return Result.success(images)
    }
}
