import { domainEventFactory } from 'src/core/domain/events/event'
import { TrainerID } from '../value-objects/trainer.id'
import { TrainerName } from '../value-objects/trainer.name'

export const TRAINER_NAME_CHANGED = 'TRAINER_NAME_CHANGED'

export const trainerNameChanged = domainEventFactory<{
    id: TrainerID
    _name: TrainerName
}>(TRAINER_NAME_CHANGED)
