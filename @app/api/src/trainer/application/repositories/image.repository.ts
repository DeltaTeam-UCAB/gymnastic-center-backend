import { Optional } from '@mono/types-utils'
import { TrainerImage } from 'src/trainer/domain/value-objects/trainer.image'
import { Image } from '../models/image'

export interface ImageRepository {
    getById(id: TrainerImage): Promise<Optional<Image>>
    existById(id: TrainerImage): Promise<boolean>
}
