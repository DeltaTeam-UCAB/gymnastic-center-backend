import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    FOLLOWER_REMOVED,
    followerRemoved,
} from '../../../domain/events/follower.removed'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

@Injectable()
export class FollowerRemovedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            FOLLOWER_REMOVED,
            (json) =>
                followerRemoved({
                    id: new TrainerID(json.id._id),
                    follower: new ClientID(json.follower._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
