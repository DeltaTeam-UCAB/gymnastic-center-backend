import { Optional } from '@mono/types-utils'
import { ImageRepository } from '../../../../../../src/blog/application/repositories/image.repository'
import { Image } from '../../../../../../src/blog/application/models/image'

export class ImageRepositoryMock implements ImageRepository {
    constructor(private trainers: Image[] = []) {}

    async existById(id: string): Promise<boolean> {
        return this.trainers.some((c) => c.id === id)
    }
    async getById(id: string): Promise<Optional<Image>> {
        return this.trainers.find((c) => c.id === id)
    }
}
