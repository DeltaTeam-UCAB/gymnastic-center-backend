import { domainEventFactory } from 'src/core/domain/events/event'
import { TrainerID } from '../value-objects/trainer.id'
import { TrainerLocation } from '../value-objects/trainer.location'

export const TRAINER_LOCATION_CHANGED = 'TRAINER_LOCATION_CHANGED'

export const trainerLocationChanged = domainEventFactory<{
    id: TrainerID
    location: TrainerLocation
}>(TRAINER_LOCATION_CHANGED)
