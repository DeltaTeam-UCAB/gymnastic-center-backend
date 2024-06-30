import { Inject, Injectable } from '@nestjs/common'
import {
    subscriptionDeleted,
    SUBSCRIPTION_DELETED,
} from 'src/subscription/domain/events/subscription.deleted'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'

@Injectable()
export class SubscriptionDeletedEventListener {
    constructor(
        private eventhandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE)
        private readonly eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventhandle.listen(
            SUBSCRIPTION_DELETED,
            (json) =>
                subscriptionDeleted({
                    id: new SubscriptionID(json.id._id),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
