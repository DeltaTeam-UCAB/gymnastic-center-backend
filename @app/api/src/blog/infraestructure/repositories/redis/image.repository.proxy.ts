import { Optional } from '@mono/types-utils'
import { Image } from 'src/blog/application/models/image'
import { ImageRepository } from 'src/blog/application/repositories/image.repository'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

export class ImageRedisRepositoryProxy implements ImageRepository {
    constructor(private imageRepository: ImageRepository) {}
    async getById(id: string): Promise<Optional<Image>> {
        const possibleImage = (await redisClient.hGetAll(
            'image:' + id,
        )) as Optional<Image>
        if (possibleImage?.id) return possibleImage
        const image = await this.imageRepository.getById(id)
        if (image) await redisClient.hSet('image:' + id, image)
        return image
    }

    existById(id: string): Promise<boolean> {
        return this.imageRepository.existById(id)
    }
}
