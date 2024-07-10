import { domainEventFactory } from 'src/core/domain/events/event'
import { TrainerID } from '../value-objects/trainer.id'
import { TrainerName } from '../value-objects/trainer.name'
import { TrainerLocation } from '../value-objects/trainer.location'
import { ClientID } from '../value-objects/client.id'
import { TrainerImage } from '../value-objects/trainer.image'

export const TRAINER_CREATED = 'TRAINER_CREATED'

export const trainerCreated = domainEventFactory<{
    id: TrainerID
    _name: TrainerName
    location: TrainerLocation
    image: TrainerImage
    followers: ClientID[]
}>(TRAINER_CREATED)
