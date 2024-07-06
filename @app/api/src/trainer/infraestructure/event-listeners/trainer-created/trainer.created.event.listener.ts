import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    TRAINER_CREATED,
    trainerCreated,
} from 'src/trainer/domain/events/trainer.created'
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer.location'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerName } from 'src/trainer/domain/value-objects/trainer.name'
import { ClientID } from 'src/trainer/domain/value-objects/client.id'

@Injectable()
export class TrainerCreatedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            TRAINER_CREATED,
            (json) =>
                trainerCreated({
                    id: new TrainerID(json.id._id),
                    _name: new TrainerName(json._name._name),
                    location: new TrainerLocation(json.location._location),
                    followers: (json.followers as Record<any, any>[]).map(
                        (follower) => new ClientID(follower._id._id),
                    ),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
