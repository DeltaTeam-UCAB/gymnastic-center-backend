import { Optional } from '@mono/types-utils'
import { Image } from '../../../../../../src/trainer/application/models/image'
import { ImageRepository } from '../../../../../../src/trainer/application/repositories/image.repository'
import { TrainerImage } from '../../../../../../src/trainer/domain/value-objects/trainer.image'

export class ImageRepositoryMock implements ImageRepository {
    constructor(private images: Image[] = []) {}
    async getById(id: TrainerImage): Promise<Optional<Image>> {
        return this.images.find((e) => e.id === id.image)
    }

    async existById(id: TrainerImage): Promise<boolean> {
        return this.images.some((e) => e.id === id.image)
    }
}
