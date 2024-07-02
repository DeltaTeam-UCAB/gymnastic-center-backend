import { Optional } from '@mono/types-utils'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'

export interface TrainerRepository {
    existById(id: TrainerID): Promise<boolean>
    getById(id: TrainerID): Promise<Optional<Trainer>>
}
