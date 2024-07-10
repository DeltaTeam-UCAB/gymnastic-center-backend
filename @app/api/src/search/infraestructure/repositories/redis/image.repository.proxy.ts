import { Optional } from '@mono/types-utils'
import { Image } from 'src/search/application/models/image'
import { ImageRepository } from 'src/search/application/repositories/image.repository'
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
}
