import { Optional } from '@mono/types-utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Image } from 'src/trainer/application/models/image'
import { Image as ImageORM } from '../../models/postgres/image.entity'
import { Repository } from 'typeorm'
import { ImageRepository } from 'src/trainer/application/repositories/image.repository'
import { TrainerImage } from 'src/trainer/domain/value-objects/trainer.image'

@Injectable()
export class ImagePostgresByTrainerRepository implements ImageRepository {
    constructor(
        @InjectRepository(ImageORM) private imageProvider: Repository<ImageORM>,
    ) {}
    getById(id: TrainerImage): Promise<Optional<Image>> {
        return this.imageProvider.findOneBy({
            id: id.image,
        })
    }
    existById(id: TrainerImage): Promise<boolean> {
        return this.imageProvider.existsBy({
            id: id.image,
        })
    }
}
