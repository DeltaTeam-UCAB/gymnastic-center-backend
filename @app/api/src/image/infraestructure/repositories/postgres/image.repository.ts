import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Image } from 'src/image/application/models/image'
import { ImageRepository } from 'src/image/application/repositories/image.repository'
import { Image as ImageORM } from '../../models/postgres/image.entity'
import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ImagePostgresRepository implements ImageRepository {
    constructor(
        @InjectRepository(ImageORM) private imageProvider: Repository<ImageORM>,
    ) {}
    async save(image: Image): Promise<Result<Image>> {
        await this.imageProvider.save(this.imageProvider.create(image))
        return Result.success(image)
    }

    getAll(): Promise<Image[]> {
        return this.imageProvider.find()
    }

    getById(id: string): Promise<Optional<Image>> {
        return this.imageProvider.findOneBy({
            id,
        })
    }
}
