import { Optional } from '@mono/types-utils'
import { Image } from '../../../../../../src/image/application/models/image'
import { ImageRepository } from '../../../../../../src/image/application/repositories/image.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class ImageRepositoryMock implements ImageRepository {
    constructor(private images: Image[] = []) {}
    async save(image: Image): Promise<Result<Image>> {
        this.images = this.images.filter((e) => e.id !== image.id)
        this.images.push(image)
        return Result.success(image)
    }

    async getById(id: string): Promise<Optional<Image>> {
        return this.images.find((e) => e.id === id)
    }

    async getAll(): Promise<Image[]> {
        return structuredClone(this.images)
    }
}
