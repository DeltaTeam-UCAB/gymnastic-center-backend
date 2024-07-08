import { Entity } from 'src/core/domain/entity/entity'
import { TrainerId } from '../value-objects/trainer.id'
import { TrainerName } from '../value-objects/trainer.name'
import { Clonable } from 'src/core/domain/clonable/clonable'

export class Trainer extends Entity<TrainerId> implements Clonable<Trainer> {
    constructor(
        id: TrainerId,
        private data: {
            name: TrainerName
        },
    ) {
        super(id)
    }

    clone(): Trainer {
        return new Trainer(this.id, {
            ...this.data,
        })
    }

    get name() {
        return this.data.name
    }
}
