import { domainEventFactory } from 'src/core/domain/events/event'
import { TrainerID } from '../value-objects/trainer.id'
import { ClientID } from '../value-objects/client.id'

export const FOLLOWER_ADDED = 'FOLLOWER_ADDED'

export const followerAdded = domainEventFactory<{
    id: TrainerID
    follower: ClientID
}>(FOLLOWER_ADDED)
