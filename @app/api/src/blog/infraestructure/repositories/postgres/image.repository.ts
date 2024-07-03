import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'src/blog/application/models/image'
import { ImageRepository } from 'src/blog/application/repositories/image.repository'
import { Image as ImageORM } from '../../models/postgres/image.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ImageByBlogPostgresRepository implements ImageRepository {
    constructor(
        @InjectRepository(ImageORM) private imageProvider: Repository<ImageORM>,
    ) {}
    getById(id: string): Promise<Optional<Image>> {
        return this.imageProvider.findOneBy({
            id,
        })
    }
    existById(id: string): Promise<boolean> {
        return this.imageProvider.existsBy({
            id,
        })
    }
}
