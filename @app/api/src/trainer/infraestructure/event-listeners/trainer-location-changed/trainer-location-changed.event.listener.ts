import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    TRAINER_LOCATION_CHANGED,
    trainerLocationChanged,
} from '../../../domain/events/trainer.location.changed'
import { TrainerID } from 'src/trainer/domain/value-objects/trainer.id'
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer.location'

@Injectable()
export class TrainerLocationChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            TRAINER_LOCATION_CHANGED,
            TRAINER_LOCATION_CHANGED + '_STORAGE',
            (json) =>
                trainerLocationChanged({
                    id: new TrainerID(json.id._id),
                    location: new TrainerLocation(json.location._location),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
