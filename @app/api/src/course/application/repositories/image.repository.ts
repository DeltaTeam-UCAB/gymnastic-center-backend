import { Optional } from '@mono/types-utils'
import { CourseImage } from 'src/course/domain/value-objects/course.image'
import { Image } from 'src/course/application/models/image'

export interface ImageRepository {
    getById(id: CourseImage): Promise<Optional<Image>>
    existById(id: CourseImage): Promise<boolean>
}
