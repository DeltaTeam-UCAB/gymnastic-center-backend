import { Entity } from 'src/core/domain/entity/entity'
import { TrainerId } from '../value-objects/trainer.id'
import { TrainerName } from '../value-objects/trainer.name'

export class Trainer extends Entity<TrainerId> {
    constructor(
        id: TrainerId,
        private data: {
            name: TrainerName
        },
    ) {
        super(id)
    }

    get name() {
        return this.data.name
    }
}
