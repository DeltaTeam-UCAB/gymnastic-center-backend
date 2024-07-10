import { Optional } from '@mono/types-utils'
import { Image } from '../../../../../../src/course/application/models/image'
import { ImageRepository } from '../../../../../../src/course/application/repositories/image.repository'
import { CourseImage } from '../../../../../../src/course/domain/value-objects/course.image'

export class ImageRepositoryMock implements ImageRepository {
    constructor(private images: Image[] = []) {}
    async getById(id: CourseImage): Promise<Optional<Image>> {
        return this.images.find((e) => e.id === id.image)
    }

    async existById(id: CourseImage): Promise<boolean> {
        return this.images.some((e) => e.id === id.image)
    }
}
