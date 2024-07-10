import { Optional } from '@mono/types-utils'
import { Image } from 'src/trainer/application/models/image'
import { ImageRepository } from 'src/trainer/application/repositories/image.repository'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { TrainerImage } from 'src/trainer/domain/value-objects/trainer.image'

export class ImageRedisRepositoryProxy implements ImageRepository {
    constructor(private imageRepository: ImageRepository) {}
    async getById(id: TrainerImage): Promise<Optional<Image>> {
        const possibleImage = (await redisClient.hGetAll(
            'image:' + id.image,
        )) as Optional<Image>
        if (possibleImage?.id) return possibleImage
        const image = await this.imageRepository.getById(id)
        if (image) await redisClient.hSet('image:' + id.image, image)
        return image
    }

    existById(id: TrainerImage): Promise<boolean> {
        return this.imageRepository.existById(id)
    }
}
