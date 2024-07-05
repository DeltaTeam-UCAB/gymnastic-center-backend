import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    courseTrainerChanged,
    COURSE_TRAINER_CHANGED,
} from '../../../domain/events/course.trainer.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { Trainer } from 'src/course/domain/entities/trainer'
import { TrainerID } from 'src/course/domain/value-objects/trainer.id'
import { TrainerName } from 'src/course/domain/value-objects/trainer.name'

@Injectable()
export class courseTrainerChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_TRAINER_CHANGED,
            (json) =>
                courseTrainerChanged({
                    id: new CourseID(json.id._id),
                    trainer: new Trainer(new TrainerID(json.trainer._id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
