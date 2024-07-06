import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    FOLLOWER_ADDED,
    followerAdded,
} from '../../../domain/events/follower.added'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

@Injectable()
export class FollowerAddedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            FOLLOWER_ADDED,
            (json) =>
                followerAdded({
                    id: new TrainerID(json.id._id),
                    follower: new ClientID(json.follower._id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
