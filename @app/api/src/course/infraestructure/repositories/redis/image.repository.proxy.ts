import { Optional } from '@mono/types-utils'
import { Image } from 'src/course/application/models/image'
import { ImageRepository } from 'src/course/application/repositories/image.repository'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'
import { CourseImage } from 'src/course/domain/value-objects/course.image'

export class ImageRedisRepositoryProxy implements ImageRepository {
    constructor(private imageRepository: ImageRepository) {}
    async getById(id: CourseImage): Promise<Optional<Image>> {
        const possibleImage = (await redisClient.hGetAll(
            'image:' + id.image,
        )) as Optional<Image>
        if (possibleImage?.id) return possibleImage
        const image = await this.imageRepository.getById(id)
        if (image) await redisClient.hSet('image:' + id.image, image)
        return image
    }

    existById(id: CourseImage): Promise<boolean> {
        return this.imageRepository.existById(id)
    }
}
