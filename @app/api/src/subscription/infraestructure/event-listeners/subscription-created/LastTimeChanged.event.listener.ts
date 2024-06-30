import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import {
    lastTimeChanged,
    LAST_TIME_CHANGED,
} from '../../../domain/events/last.time.changed'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import { Time } from 'src/subscription/domain/value-objects/time'

@Injectable()
export class LastTimeChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            LAST_TIME_CHANGED,
            (json) =>
                lastTimeChanged({
                    id: new SubscriptionID(json.id._id),
                    lastTime: new Time(json.lastTime._date),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
