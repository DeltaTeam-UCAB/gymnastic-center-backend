import { domainEventFactory } from 'src/core/domain/events/event'
import { TrainerID } from './value-objects/trainer.id'

export const TRAINER_DELETED = 'TRAINER_DELETED'

export const trainerDeleted = domainEventFactory<{
    id: TrainerID
}>(TRAINER_DELETED)
