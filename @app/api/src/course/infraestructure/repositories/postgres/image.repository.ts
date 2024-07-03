import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'src/course/application/models/image'
import { ImageRepository } from 'src/course/application/repositories/image.repository'
import { Image as ImageORM } from '../../models/postgres/image.entity'
import { Repository } from 'typeorm'
import { CourseImage } from 'src/course/domain/value-objects/course.image'

@Injectable()
export class ImagePostgresByCourseRepository implements ImageRepository {
    constructor(
        @InjectRepository(ImageORM) private imageProvider: Repository<ImageORM>,
    ) {}
    getById(id: CourseImage): Promise<Optional<Image>> {
        return this.imageProvider.findOneBy({
            id: id.image,
        })
    }
    existById(id: CourseImage): Promise<boolean> {
        return this.imageProvider.existsBy({
            id: id.image,
        })
    }
}
