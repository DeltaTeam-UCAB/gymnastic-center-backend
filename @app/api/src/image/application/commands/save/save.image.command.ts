import { ApplicationService } from 'src/core/application/service/application.service'
import { SaveImageDTO } from './types/dto'
import { SaveImageResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { ImageRepository } from '../../repositories/image.repository'
import { ImageStorage } from 'src/core/application/storage/images/image.storage'
import { Image } from '../../models/image'

export class SaveImageCommand
    implements ApplicationService<SaveImageDTO, SaveImageResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private imageRepository: ImageRepository,
        private imageStorage: ImageStorage,
    ) {}
    async execute(data: SaveImageDTO): Promise<Result<SaveImageResponse>> {
        const storageResult = await this.imageStorage.save(data)
        if (storageResult.isError()) return storageResult.convertToOther()
        const imageSource = storageResult.unwrap()
        const imageId = this.idGenerator.generate()
        const image = {
            id: imageId,
            src: imageSource.url,
        } satisfies Image
        const saveResult = await this.imageRepository.save(image)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id: imageId,
        })
    }
}
