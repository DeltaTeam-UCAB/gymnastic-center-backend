import { Optional } from '@mono/types-utils'
import { Trainer } from '../../domain/entities/trainer'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'

export interface TrainerRepository {
    existsById(id: TrainerId): Promise<boolean>
    getById(id: TrainerId): Promise<Optional<Trainer>>
}
