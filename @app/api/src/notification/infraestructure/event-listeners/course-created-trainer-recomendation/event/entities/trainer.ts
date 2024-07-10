import { Entity } from 'src/core/domain/entity/entity'
import { TrainerID } from '../value-objects/trainer.id'
import { TrainerName } from '../value-objects/trainer.name'

export class Trainer extends Entity<TrainerID> {
    constructor(
        id: TrainerID,
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
