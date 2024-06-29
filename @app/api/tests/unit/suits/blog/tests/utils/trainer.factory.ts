import { Trainer } from '../../../../../../src/blog/domain/entities/trainer'
import { TrainerId } from '../../../../../../src/blog/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../../src/blog/domain/value-objects/trainer.name'

export const createTrainer = (data?: { id?: string; name?: string }) =>
    new Trainer(
        new TrainerId(data?.id ?? '84821c3f-0e84-4bf4-a3a8-520e42e54121'),
        {
            name: new TrainerName(data?.name ?? 'name test trainer'),
        },
    )
