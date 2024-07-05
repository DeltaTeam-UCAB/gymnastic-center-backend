import { Trainer } from '../../../../../../src/course/domain/entities/trainer'
import { TrainerID } from '../../../../../../src/course/domain/value-objects/trainer.id'
import { TrainerName } from '../../../../../../src/course/domain/value-objects/trainer.name'

export const createTrainer = (data?: { id?: string; name?: string }): Trainer =>
    new Trainer(
        new TrainerID(data?.id ?? '17bafccd-15d1-4804-a59b-7833973ff26d'),
        {
            name: new TrainerName(data?.name ?? 'test trainer name'),
        },
    )
