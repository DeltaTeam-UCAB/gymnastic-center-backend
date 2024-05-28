import { Optional } from '@mono/types-utils'
import { Image } from '../../../../../../src/course/application/models/image'
import { ImageRepository } from '../../../../../../src/course/application/repositories/image.repository'

export class ImageRepositoryMock implements ImageRepository {
    constructor(private images: Image[] = []) {}
    async getById(id: string): Promise<Optional<Image>> {
        return this.images.find((e) => e.id === id)
    }

    async existById(id: string): Promise<boolean> {
        return this.images.some((e) => e.id === id)
    }
}
