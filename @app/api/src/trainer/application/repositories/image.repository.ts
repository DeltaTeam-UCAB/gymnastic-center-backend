import { Optional } from '@mono/types-utils'
import { Image } from 'src/course/application/models/image'
import { TrainerImage } from 'src/trainer/domain/value-objects/trainer.image'

export interface ImageRepository {
    getById(id: TrainerImage): Promise<Optional<Image>>
    existById(id: TrainerImage): Promise<boolean>
}
